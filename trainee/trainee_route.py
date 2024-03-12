from flask import Flask, jsonify, request
from config import load_config
from dbConnection import *
app = Flask(__name__)  # special variable that will call __main__

# trainee Account #
# [GET] getAllTrainee
@app.route('/trainee', methods=['GET'])
def read_all_trainee_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM account ORDER BY traineeid ASC')

    traineelist = cur.fetchall()
    cur.close()
    con.close()

    traineelist_json = [{"traineeid": trainee[0], "username": trainee[1], "email": trainee[2],
                         "password": trainee[3], "created_timestamp": trainee[4]} for trainee in traineelist]

    if len(traineelist):
        return jsonify({
            "code": 200,
            "data": {
                "trainee": [trainee for trainee in traineelist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainee."
    })

# [GET] getOnetrainee
@app.route('/trainee/<int:traineeid>', methods=['GET'])
def read_trainee_by_id_query(traineeid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM account WHERE traineeid = %s;', (traineeid, ))

    trainee = cur.fetchone()
    cur.close()
    con.close()

    if trainee:
        trainee_json = {"traineeid": trainee[0], "username": trainee[1], "email": trainee[2],
                        "password": trainee[3], "created_timestamp": trainee[4]}

        return jsonify({
            "code": 200,
            "data": {
                "trainee": trainee_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainee."
    })

# [POST] createNewtrainee
@app.route('/trainee/create', methods=['POST'])
def create_new_trainee_query():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']
        created_timestamp = data['created_timestamp']

        con = get_db_connection(config)
        cur = con.cursor()
        
        # Check whether Post ID exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM account WHERE email = %s);', (email, ))
        email_exists = cur.fetchone()[0]

        if email_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Email already exists"
            })
            
        try:
            # Insert the new trainee into the database
            cur.execute(
                f"INSERT INTO account (traineeid, username, email, password, created_timestamp) VALUES (nextval('account_id_seq'), %s, %s, %s) RETURNING traineeid;",
                (username, email, password, created_timestamp, ))

        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new trainee."
            })

# [PUT] updatetrainee
@app.route('/trainee/<int:traineeid>', methods=['PUT'])
def update_trainee_query(traineeid):
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()
        
        try:
            # Update a post
            cur.execute(f"""UPDATE account SET username = %s, email = %s, password = %s, created_timestamp = %s WHERE traineeid = %s;""",
                        (data['username'], data['email'], data['password'], data['created_timestamp'], traineeid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Trainee updated successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to update trainee."
            })

# [DELETE] deletetrainee
@app.route('/trainee/<int:traineeid>', methods=['DELETE'])
def delete_trainee_by_id_query(traineeid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Delete a trainee
            cur.execute(
                f'DELETE FROM account WHERE traineeid = %s;', (traineeid, ))
            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "trainee deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a trainee."
            })

if __name__ == '__main__':
    config = load_config()
    app.run(host='0.0.0.0', port=5000, debug=True)
