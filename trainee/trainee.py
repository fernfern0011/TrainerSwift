from flask import Flask, jsonify, request
from config import *
from dbConnection import *
app = Flask(__name__)  # special variable that will call __main__

# Trainee Account #
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

# [GET] getOneTrainee
@app.route("/trainee/<traineeid>", methods=['GET'])
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

# [POST] createNewTrainee
@app.route('/trainee/create', methods=['POST'])
def create_new_trainee_query():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether Trainee ID exists
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
                f"INSERT INTO account (traineeid, username, email, password) VALUES (nextval('account_id_seq'), %s, %s, %s) RETURNING traineeid;",
                (username, email, password, ))

            # Get the ID of the newly inserted trainee
            new_traineeid = cur.fetchone()[0]

            if new_traineeid:
                # Insert the new trainee id into info database
                cur.execute(f"INSERT INTO info (traineeid) VALUES (%s) RETURNING traineeid;",
                            (new_traineeid, ))
                
                confirmed_new_traineeid = cur.fetchone()[0]

                con.commit()
                cur.close()
                con.close()
                
                return jsonify({
                    "code": 201,
                    "new_traineeid": confirmed_new_traineeid,
                    "message": "Trainee created successfully."
                })

        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new trainee."
            })

# [PUT] updateTrainee
@app.route('/trainee/<int:traineeid>', methods=['PUT'])
def update_trainee_query(traineeid):
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Update a post
            cur.execute(f"""UPDATE account SET username = %s, email = %s, password = %s WHERE traineeid = %s;""",
                        (data['username'], data['email'], data['password'], traineeid, ))

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

# [DELETE] deleteTrainee
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
                "message": "Trainee deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a trainee."
            })


# Trainee Info #
# [GET] getAllTraineeInfo
@app.route('/traineeinfo', methods=['GET'])
def read_all_traineeinfo_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM info ORDER BY traineeid ASC')

    traineeinfolist = cur.fetchall()
    cur.close()
    con.close()

    traineeinfolist_json = [{"traineeid": traineeinfo[0], "height": traineeinfo[1], "weight": traineeinfo[2],
                         "age": traineeinfo[3], "created_timestamp": traineeinfo[4]} for traineeinfo in traineeinfolist]

    if len(traineeinfolist):
        return jsonify({
            "code": 200,
            "data": {
                "traineeinfo": [traineeinfo for traineeinfo in traineeinfolist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainee information."
    })  

# [GET] getOneTraineeInfo
@app.route('/traineeinfo/<int:traineeid>', methods=['GET'])
def read_traineeinfo_by_id_query(traineeid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM info WHERE traineeid = %s;', (traineeid, ))

    traineeinfo = cur.fetchone()
    cur.close()
    con.close()

    if traineeinfo:
        traineeinfo_json = {"traineeid": traineeinfo[0], "height": traineeinfo[1], "weight": traineeinfo[2], "age": traineeinfo[3], "created_timestamp": traineeinfo[4]}

        return jsonify({
            "code": 200,
            "data": {
                "traineeinfo": traineeinfo_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainee information."
    })
    
# [PUT] updateTraineeInfo
@app.route('/traineeinfo/<int:traineeid>', methods=['PUT'])
def update_traineeinfo_by_id_query(traineeid):
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether Trainee ID exists
        cur.execute(
             f'SELECT EXISTS(SELECT 1 FROM info WHERE traineeid = %s);', (traineeid, ))
        traineeid_exists = cur.fetchone()[0]

        if not traineeid_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to update. Account does not exist"
            })
            
        try:
            # Update the trainee info into the database
            cur.execute(f"""UPDATE info SET height = %s, weight = %s, age = %s WHERE traineeid = %s;""",
                (data['height'], data['weight'], data['age'], traineeid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "trainee Information updated successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to update trainee information."
            })    

if __name__ == '__main__':
    config = load_config()
    app.run(host='0.0.0.0', port=5000, debug=True)
