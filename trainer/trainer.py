from flask import Flask, jsonify, request
from config import *
from dbConnection import *
app = Flask(__name__)  # special variable that will call __main__


# Trainer Account #
# [GET] getAllTrainer
@app.route('/trainer', methods=['GET'])
def read_all_trainer_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM account ORDER BY trainerid ASC')

    trainerlist = cur.fetchall()
    cur.close()
    con.close()

    trainerlist_json = [{"trainerid": trainer[0], "username": trainer[1], "email": trainer[2],
                         "password": trainer[3], "stripeid": trainer[4], "name": trainer[5], "created_timestamp": trainer[6]} for trainer in trainerlist]

    if len(trainerlist):
        return jsonify({
            "code": 200,
            "data": {
                "trainer": [trainer for trainer in trainerlist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainer."
    })

# [GET] getOneTrainer
@app.route('/trainer/<int:trainerid>', methods=['GET'])
def read_trainer_by_id_query(trainerid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM account WHERE trainerid = %s;', (trainerid, ))

    trainer = cur.fetchone()
    cur.close()
    con.close()

    if trainer:
        trainer_json = {"trainerid": trainer[0], "username": trainer[1], "email": trainer[2],
                        "password": trainer[3], "stripeid": trainer[4], "name": trainer[5], "created_timestamp": trainer[6]}

        return jsonify({
            "code": 200,
            "data": {
                "trainer": trainer_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainer."
    })

# [POST] verifyAccount
@app.route('/trainer/login', methods=['POST'])
def verify_account():
    if request.method == 'POST':
        data = request.get_json()
        email = data['email']
        password = data['password']

        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether account exists
        cur.execute(
            f'SELECT * FROM account WHERE email = %s AND password = %s;', (email, password, ))
        trainerInfo = cur.fetchone()
        cur.close()
        con.close()
        
        if trainerInfo:
            trainer_json = {"trainerid": trainerInfo[0], "username": trainerInfo[1], "email": trainerInfo[2],
                            "stripeid": trainerInfo[4], "name": trainerInfo[5]}

            return jsonify({
                "code": 201,
                "data": {
                    "trainer": trainer_json
                }
            })
        return jsonify({
            "code": 400,
            "message": "Account does not exist."
        })

# [POST] createNewTrainer
@app.route('/trainer/create', methods=['POST'])
def create_new_trainer_query():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']
        name = data['name']
        stripeid = data['stripeid']

        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether account exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM account WHERE email = %s);', (email, ))
        email_exists = cur.fetchone()[0]

        if email_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Email already exists"
            })

        try:
            # Insert the new trainer into the database
            cur.execute(
                f"INSERT INTO account (trainerid, username, email, password, name, stripeid) VALUES (nextval('account_id_seq'), %s, %s, %s, %s, %s) RETURNING trainerid;",
                (username, email, password, name, ))

            # Get the ID of the newly inserted trainer
            new_trainerid = cur.fetchone()[0]

            if new_trainerid:
                # Insert the new trainer id into info database
                cur.execute(
                    f"INSERT INTO info (trainerid, name) VALUES (%s, %s) RETURNING trainerid;",
                    (new_trainerid, name, ))

                confirmed_new_trainerid = cur.fetchone()[0]

                con.commit()
                cur.close()
                con.close()

                return jsonify({
                    "code": 201,
                    "new_trainerid": confirmed_new_trainerid,
                    "message": "Trainer created successfully."
                })

        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new trainer."
            })

# [PUT] updateTrainer
@app.route('/trainer/<int:trainerid>', methods=['PUT'])
def update_trainer_query(trainerid):
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()
        username = data['username']
        email = data['email']
        password = data['password']
        name = data['name']
        stripeid = data['stripeid']

        try:
            # Update a trainer and trainerinfo
            cur.execute(f"""UPDATE account SET username = %s, email = %s, password = %s, name = %s, stripeid = %s WHERE trainerid = %s;""",
                        (username, email, password, name, stripeid, trainerid, ))

            cur.execute(f"""UPDATE info SET name = %s WHERE trainerid = %s;""",
                        (name, trainerid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Trainer updated successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to update trainer."
            })

# [DELETE] deleteTrainer
@app.route('/trainer/<int:trainerid>', methods=['DELETE'])
def delete_trainer_by_id_query(trainerid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Delete a trainer
            cur.execute(
                f'DELETE FROM account WHERE trainerid = %s;', (trainerid, ))
            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Trainer deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a trainer."
            })


# Category #
# [GET] getAllCategory
@app.route('/category', methods=['GET'])
def read_all_category_query():
    con = get_db_connection(config)
    cur = con.cursor()

    cur.execute(f'SELECT * FROM category ORDER BY catid ASC')

    catlist = cur.fetchall()
    cur.close()
    con.close()

    catlist_json = [{"catid": cat[0], "catcode": cat[1],
                     "catname": cat[2], "created_timestamp": cat[3]} for cat in catlist]

    if len(catlist):
        return jsonify({
            "code": 200,
            "data": {
                "cat": [catlist for catlist in catlist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no category."
    })

# [GET] getOneCategory
@app.route('/category/<int:catid>', methods=['GET'])
def read_category_by_id_query(catid):
    con = get_db_connection(config)
    cur = con.cursor()

    cur.execute(f'SELECT * FROM category WHERE catid = %s;', (catid, ))

    cat = cur.fetchone()
    cur.close()
    con.close()

    if cat:
        cat_json = {"catid": cat[0], "catcode": cat[1],
                    "catname": cat[2], "created_timestamp": cat[3]}

        return jsonify({
            "code": 200,
            "data": {
                "category": cat_json
            }
        })

    return jsonify({
        "code": 400,
        "message": "There is no category."
    })

# [POST] createNewCategory
@app.route('/category/create', methods=['POST'])
def create_new_category_query():
    if request.method == 'POST':
        data = request.get_json()
        catcode = data['catcode']
        catname = data['catname']

        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether Category ID exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM category WHERE catcode = %s AND catname = %s);', (catcode, catname, ))
        cat_exists = cur.fetchone()[0]

        if cat_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Category already exists"
            })

        try:
            # Insert the new category into the database
            cur.execute(
                f"INSERT INTO category (catid, catcode, catname) VALUES (nextval('category_id_seq'), %s, %s) RETURNING catid;",
                (catcode, catname, ))

            # Get the ID of the newly inserted category
            new_catid = cur.fetchone()[0]

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 201,
                "new_catid": new_catid,
                "message": "Category created successfully."
            })

        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new category."
            })

# [DELETE] deleteCategory
@app.route('/category/<int:catid>', methods=['DELETE'])
def delete_category_by_id_query(catid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Delete a category
            cur.execute(f'DELETE FROM category WHERE catid = %s;', (catid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Category deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a category."
            })


# Certification #
# [GET] getAllCertification
@app.route('/certification', methods=['GET'])
def read_all_certification_query():
    con = get_db_connection(config)
    cur = con.cursor()

    cur.execute(f'SELECT * FROM certification ORDER BY certid ASC')

    certlist = cur.fetchall()
    cur.close()
    con.close()

    certlist_json = [{"certid": cert[0], "certcode": cert[1], "certname": cert[2],
                      "trainerid": cert[3], "catid": cert[4], "created_timestamp": cert[5]} for cert in certlist]

    if len(certlist):
        return jsonify({
            "code": 200,
            "data": {
                "certification": [certlist for certlist in certlist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no certificate."
    })

# [GET] getOneCertification
@app.route('/certification/<int:certid>', methods=['GET'])
def read_certification_by_id_query(certid):
    con = get_db_connection(config)
    cur = con.cursor()

    cur.execute(f'SELECT * FROM certification WHERE certid = %s;', (certid, ))

    cert = cur.fetchone()
    cur.close()
    con.close()

    if cert:
        cert_json = {"certid": cert[0], "certcode": cert[1], "certname": cert[2],
                     "trainerid": cert[3], "catid": cert[4], "created_timestamp": cert[5]}

        return jsonify({
            "code": 200,
            "data": {
                "cert": cert_json
            }
        })

    return jsonify({
        "code": 400,
        "message": "There is no certificate."
    })

# [POST] createNewCertification
@app.route('/certification/create', methods=['POST'])
def create_new_certification_query():
    if request.method == 'POST':
        data = request.get_json()
        certcode = data['certcode']
        certname = data['certname']
        trainerid = data['trainerid']
        catid = data['catid']

        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether Certification ID exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM certification WHERE trainerid = %s AND catid = %s);', (trainerid, catid, ))
        cert_exists = cur.fetchone()[0]

        if cert_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Certificate already exists"
            })

        try:
            # Insert the new certificate into the database
            cur.execute(
                f"INSERT INTO certification (certid, certcode, certname, trainerid, catid) VALUES (nextval('certification_id_seq'), %s, %s, %s, %s) RETURNING certid;",
                (certcode, certname, trainerid, catid, ))

            # Get the ID of the newly inserted certification
            new_certificationid = cur.fetchone()[0]

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 201,
                "new_certificationid": new_certificationid,
                "message": "Certificate created successfully."
            })

        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new certificate."
            })

# [DELETE] deleteCertification
@app.route('/certification/<int:certid>', methods=['DELETE'])
def delete_certification_by_id_query(certid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Delete a certificate
            cur.execute(
                f'DELETE FROM certification WHERE certid = %s;', (certid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Certification deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a certification."
            })


# Trainer Info #
# [GET] getAllTrainerInfo
@app.route('/trainerinfo', methods=['GET'])
def read_all_trainerinfo_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM info ORDER BY trainerid ASC')

    trainerinfolist = cur.fetchall()
    cur.close()
    con.close()

    trainerinfolist_json = [{"trainerid": trainerinfo[0], "name": trainerinfo[1], "bio": trainerinfo[2], "image": trainerinfo[3],
                             "height": trainerinfo[4], "weight": trainerinfo[5], "dob": trainerinfo[6],
                             "gender": trainerinfo[7], "verified": trainerinfo[8], "created_timestamp": trainerinfo[9]} for trainerinfo in trainerinfolist]

    if len(trainerinfolist):
        return jsonify({
            "code": 200,
            "data": {
                "trainerinfo": [trainerinfo for trainerinfo in trainerinfolist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainer information."
    })

# [GET] getOneTrainerInfo
@app.route('/trainerinfo/<int:trainerid>', methods=['GET'])
def read_trainerinfo_by_id_query(trainerid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM info WHERE trainerid = %s;', (trainerid, ))

    trainerinfo = cur.fetchone()
    cur.close()
    con.close()

    if trainerinfo:
        trainerinfo_json = {"trainerid": trainerinfo[0], "name": trainerinfo[1], "bio": trainerinfo[2], "image": trainerinfo[3],
                            "height": trainerinfo[4], "weight": trainerinfo[5], "dob": trainerinfo[6],
                            "gender": trainerinfo[7], "verified": trainerinfo[8], "created_timestamp": trainerinfo[9]}

        return jsonify({
            "code": 200,
            "data": {
                "trainerinfo": trainerinfo_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no trainer information."
    })

# [PUT] updateTrainerInfo
@app.route('/trainerinfo/<int:trainerid>', methods=['PUT'])
def update_trainerinfo_by_id_query(trainerid):
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether Trainer ID exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM info WHERE trainerid = %s);', (trainerid, ))
        trainerid_exists = cur.fetchone()[0]

        if not trainerid_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to update. Account does not exist"
            })

        try:
            # Update the trainer info into the database
            cur.execute(f"""UPDATE info SET name = %s, bio = %s, image = %s, height = %s, weight = %s, dob = %s, gender = %s, verified = %s WHERE trainerid = %s;""",
                        (data['name'], data['bio'], data['image'], data['height'], data['weight'], data['dob'], data['gender'], data['verified'], trainerid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Trainer Information updated successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to update trainer information."
            })


if __name__ == '__main__':
    config = load_config()
    app.run(host='0.0.0.0', port=5000, debug=True)
