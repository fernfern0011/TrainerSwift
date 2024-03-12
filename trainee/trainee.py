from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/trainee'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Account(db.Model):
    __tablename__ = 'Account'
    TraineeID = db.Column(db.String(50), primary_key=True)
    Username = db.Column(db.String(50), nullable=False)
    Email = db.Column(db.String(100), nullable=False)
    Password = db.Column(db.String(50), nullable=False)
    Created_timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    db.UniqueConstraint('TraineeID', 'Email')

    def __init__(self,TraineeID,Username,Email,Password):
        self.TraineeID = TraineeID
        self.Username = Username
        self.Email = Email
        self.Password = Password
    
    def json(self):
        return {"TraineeID": self.TraineeID, "Username": self.Username, "Email": self.Email, "Password": self.Password}

@app.route("/Trainee")
def get_all():
    trainees = Account.query.all()
    return jsonify([Trainee.json() for Trainee in trainees])

@app.route("/trainee/<trainee_id>")
def find_by_traineeid(trainee_id):
    trainee = Account.query.get(trainee_id)
    if trainee:
        return jsonify(trainee.json())
    return jsonify({"message": "Trainee not found"})

@app.route("/trainee/<trainee_id>", methods=['POST'])
def create_trainee(trainee_id):
    data = request.get_json()

    existing_trainee = Account.query.get(trainee_id)
    if existing_trainee:
        return jsonify({"message": "Cannot create Trainee with the same ID."})

    add_trainee = Account(TraineeID=trainee_id, Username=data['Username'], Email=data['Email'], Password=data['Password'])
    db.session.add(add_trainee)
    db.session.commit()

    return jsonify(add_trainee.json())

if __name__ == "__main__":
    app.run(port=5000,debug=True)