from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/trainer'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

class Account(db.Model):
    __tablename__ = 'Account'
    TrainerID = db.Column(db.String(50), primary_key=True)
    Email = db.Column(db.String(100), nullable=False)
    Password = db.Column(db.String(50), nullable=False)
    db.UniqueConstraint('TrainerID', 'Email')

    def __init__(self,TrainerID,Email,Password):
        self.TrainerID = TrainerID
        self.Email = Email
        self.Password = Password
    
    def json(self):
        return {"TrainerID": self.TrainerID, "Email": self.Email, "Password": self.Password}

class Category(db.Model):
    __tablename__ = 'Category'
    CatID = db.Column(db.String(50), primary_key=True)
    CatName = db.Column(db.String(50), nullable=False)
    db.UniqueConstraint('CatID', 'CatName')

    def __init__(self,CatID,CatName):
        self.CatID = CatID
        self.CatName = CatName

    def json(self):
        return {"CatID": self.CatID, "CatName": self.CatName}

class Certification(db.Model):
    __tablename__ = 'Certification'
    CertID = db.Column(db.String(50), primary_key=True)
    TrainerID = db.Column(db.String(50), db.ForeignKey('Account.TrainerID'), nullable=False)
    CertDetail = db.Column(db.String(50))
    CatID = db.Column(db.String(50), db.ForeignKey('Category.CatID'), nullable=False)
    db.UniqueConstraint('CertID')
    account = db.relationship("Account")
    category = db.relationship("Category")

    def __init__(self,CertID,TrainerID,CertDetail,CatID):
        self.CertID = CertID
        self.TrainerID = TrainerID
        self.CertDetail = CertDetail
        self.CatID = CatID

    def json(self):
        return {"CertID": self.CertID, "TrainerID": self.TrainerID, "CertDetail": self.CertDetail, "CatID": self.CatID}

class Info(db.Model):
    __tablename__ = 'Info'
    TrainerID = db.Column(db.String(50), db.ForeignKey('Account.TrainerID'), primary_key=True)
    StripeID = db.Column(db.String(50), nullable=False)
    Bio = db.Column(db.String(100))
    Img = db.Column(db.String(50))
    Height = db.Column(db.DECIMAL(10,2))
    Weight = db.Column(db.DECIMAL(10,2))
    DateOfBirth = db.Column(db.Date)
    Verified = db.Column(db.Boolean, nullable=False)
    Gender = db.Column(db.String(25))
    db.UniqueConstraint('TrainerID', 'StripeID')
    account = db.relationship("Account")

    def __init__(self,TrainerID,StripeID,Bio,Img,Height,Weight,DateOfBirth,Verified,Gender):
        self.TrainerID = TrainerID
        self.StripeID = StripeID
        self.Bio = Bio
        self.Img = Img
        self.Height = Height
        self.Weight = Weight
        self.DateOfBirth = DateOfBirth
        self.Verified = Verified
        self.Gender = Gender

    def json(self):
        return {"TrainerID": self.TrainerID, "StripeID": self.StripeID, "Bio": self.Bio, "Img": self.Img, "Height": self.Height, "Weight": self.Weight, "DateOfBirth": self.DateOfBirth, "Verified": self.Verified, "Gender": self.Gender}

class BankAccount(db.Model):
    __tablename__ = 'BankAccount'
    TrainerID = db.Column(db.String(50), db.ForeignKey('Account.TrainerID'), primary_key=True)
    AccountNum = db.Column(db.String(50), nullable=False)
    BankName = db.Column(db.String(50), nullable=False)
    db.UniqueConstraint('TrainerID', 'AccountNum')
    account = db.relationship("Account")

    def __init__(self,TrainerID,AccountNum,BankName):
        self.TrainerID = TrainerID
        self.AccountNum = AccountNum
        self.BankName = BankName

    def json(self):
        return {"TrainerID": self.TrainerID, "AccountNum": self.AccountNum, "BankName": self.BankName}


@app.route("/trainer")
def get_all():
    trainers = Account.query.all()
    return jsonify([trainer.json() for trainer in trainers])

@app.route("/trainer/<trainer_id>")
def find_by_trainerid(trainer_id):
    trainer = Account.query.get(trainer_id)
    if trainer:
        return jsonify(trainer.json())
    return jsonify({"message": "Trainer not found"})

@app.route("/trainer/<trainer_id>", methods=['POST'])
def create_trainer(trainer_id):
    data = request.get_json()

    existing_trainer = Account.query.get(trainer_id)
    if existing_trainer:
        return jsonify({"message": "Cannot create Trainer with the same ID."})

    add_trainer = Account(TrainerID=trainer_id, Email=data['Email'], Password=data['Password'])
    db.session.add(add_trainer)
    db.session.commit()

    return jsonify(add_trainer.json())

if __name__ == "__main__":
    app.run(port=5000,debug=True)