import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

conn_params = {
    'database': 'verceldb',
    'user': 'default',
    'password': 's2fbryFa6Yej',
    'host': 'ep-old-darkness-a1f9hm2w-pooler.ap-southeast-1.aws.neon.tech',
    'port': '5432'
}

# Route to retrieve all trainers
@app.route("/trainer")
def get_all():
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        cur.execute("SELECT * FROM Account")
        trainers = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify(trainers)

    except psycopg2.Error as e:
        print("Error fetching data from PostgreSQL:", e)
        return []

# Route to retrieve a specific trainer by ID
@app.route("/trainer/<trainer_id>")
def find_by_trainerid(trainer_id):
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        cur.execute(f"SELECT * FROM Account WHERE TrainerID = '{trainer_id}'")
        trainer = cur.fetchone()

        cur.close()
        conn.close()

        if trainer:
            return jsonify(trainer)
        else:
            return jsonify({"message": "Trainer not found"})
        
    except psycopg2.Error as e:
        print("Error fetching data from PostgreSQL:", e)
        return {'error': 'Failed to fetch data from database'}

# Route to create a new trainer
@app.route("/trainer", methods=['POST'])
def create_trainer():
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        data = request.get_json()
        trainer_id = data['trainerID']
        email = data['email']
        password = data['password']
        stripe_id = data['stripeid']

        # Insert the new trainer into the database
        cur.execute(f"INSERT INTO Account (trainerID, email, password, stripeid) VALUES ('{trainer_id}', '{email}', '{password}', '{stripe_id}')")
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "Trainer created successfully"})
    except psycopg2.Error as e:
        print("Error creating new trainer in PostgreSQL:", e)
        return {'error': 'Failed to create new trainer in database'}
    
@app.route('/trainer/<int:trainer_id>', methods=['DELETE'])
def delete_package(trainer_id):
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        data = request.get_json()
        trainer_id = data['trainerID']

        # Insert the new trainer into the database
        cur.execute('DELETE FROM Account WHERE trainerid= %s;', (trainer_id,))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "Trainer deleted successfully"})
    except psycopg2.Error as e:
        print("Error deleting trainer in PostgreSQL:", e)
        return {'error': 'Failed to delete trainer in database'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
