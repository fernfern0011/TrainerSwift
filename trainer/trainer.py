from flask import Flask, jsonify, request
from config import load_config
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
                         "password": trainer[3], "stripeid": trainer[4], "created_timestamp": trainer[5]} for trainer in trainerlist]

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
                        "password": trainer[3], "stripeid": trainer[4], "created_timestamp": trainer[5]}

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

# [POST] createNewTrainer
@app.route('/trainer/create', methods=['POST'])
def create_new_trainer_query():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

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
            # Insert the new trainer into the database
            cur.execute(
                f"INSERT INTO account (trainerid, username, email, password) VALUES (nextval('account_id_seq'), %s, %s, %s) RETURNING trainerid;",
                (username, email, password, ))

            # Get the ID of the newly inserted trainer
            new_trainerid = cur.fetchone()[0]
            
            if new_trainerid:
                # Insert the new trainer id into info database
                cur.execute(
                f"INSERT INTO info (trainerid) VALUES (%s) RETURNING trainerid;",
                (new_trainerid, ))
                
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
        
        try:
            # Update a post
            cur.execute(f"""UPDATE account SET username = %s, email = %s, password = %s WHERE trainerid = %s;""",
                        (data['username'], data['email'], data['password'], trainerid, ))

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
# [GET] getAllCategory # Done
@app.route('/category', methods=['GET'])
def read_all_category_query():
    con = get_db_connection(config)
    cur = con.cursor()
        
    cur.execute(f'SELECT * FROM category ORDER BY CatID ASC')

    catlist = cur.fetchall()
    cur.close()
    con.close()

    catlist_json = [{"catid": catlist[0], "catname": catlist[1]} for cat in catlist]

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
    
        
# [GET] getOneCategory # Done
@app.route('/category/<int:catid>', methods=['GET'])
def read_category_by_id_query(catid):
    con = get_db_connection(config)
    cur = con.cursor()

    cur.execute(f'SELECT * FROM category WHERE catid = %s;', (catid, ))

    cat = cur.fetchall()
    cur.close()
    con.close()

    if cat:
        cat_json = {"catid": cat[0], "catname": cat[1]}
        return jsonify({
            "code": 200,
            "data": {
                "cert": cat_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no category."
    })    
    
    
# [POST] createNewCategory # Done
@app.route('/category/create', methods=['POST'])
def create_new_category_query():
    if request.method == 'POST':
        data = request.get_json()
        catname = data['catname']

        con = get_db_connection(config)
        cur = con.cursor()
        
        # Check whether Post ID exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM category WHERE catname = %s);', (catname, ))
        catname_exists = cur.fetchone()[0]

        if catname_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Category name already exists"
            })
        try:
            # Insert the new category into the database
            cur.execute(
                f"INSERT INTO category (catid, catname) VALUES (nextval('category_id_seq'), %s) RETURNING catid;",
                (catname, ))

            return jsonify({
                    "code": 201,
                    "message": "Category created successfully."
                })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new category."
            })        
        
# [DELETE] deleteCategory # Done
@app.route('/category/<int:catid>', methods=['DELETE'])
def delete_category_by_id_query(catid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()
        
        try:
            # Delete a certificate
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
# [GET] getAllCertification # Done
@app.route('/certification', methods=['GET'])
def read_all_certification_query():
    con = get_db_connection(config)
    cur = con.cursor()
    
    cur.execute(f'SELECT * FROM certification ORDER BY certid ASC')

    certlist = cur.fetchall()
    cur.close()
    con.close()

    certlist_json = [{"certid": certlist[0], "trainerid": certlist[1], "certdetail": certlist[2], "catdetail": certlist[3]} for cert in certlist]

    if len(certlist):
        return jsonify({
            "code": 200,
            "data": {
                "cert": [certlist for certlist in certlist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no certificate."
    })
        
# [GET] getOneCertification # Done
@app.route('/certification/<int:certid>', methods=['GET'])
def read_certification_by_id_query(certid):
    con = get_db_connection(config)
    cur = con.cursor()    
    
    cur.execute(f'SELECT * FROM certification WHERE certid = %s;', (certid, ))

    cert = cur.fetchall()
    cur.close()
    con.close()

    if cert:
        cert_json = {"certid": cert[0], "trainerid": cert[1], "certdetail": cert[2], "catdetail": cert[3]}
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

        certid = data['certid']
        trainerid = data['trainerid']
        certdetail = data['certdetail']
        catid = data['catid']
                
        con = get_db_connection(config)
        cur = con.cursor()
        
        # Check whether Post ID exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM certificate WHERE certid = %s);', (certid, ))
        cert_exists = cur.fetchone()[0]

        if cert_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Certificate already exists"
            })
        try:
            # Insert the new certificate into the database
            cur.execute(
                f"INSERT INTO certificate (certid, trainerid, certdetail, catid) VALUES (nextval('certificate_id_seq'), %s) RETURNING certid;",
                (trainerid, certdetail, catid))

            return jsonify({
                    "code": 201,
                    "message": "Certificate created successfully."
                })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new certificate."
            })      
        
# [DELETE] deleteCertification # Done
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

    trainerinfolist_json = [{"trainerid": trainerinfo[0], "bio": trainerinfo[1], "image": trainerinfo[2],
                         "height": trainerinfo[3], "weight": trainerinfo[4], "dob": trainerinfo[5], 
                         "gender": trainerinfo[6], "verified": trainerinfo[7], "created_timestamp": trainerinfo[8]} for trainerinfo in trainerinfolist]

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
        trainerinfo_json = {"trainerid": trainerinfo[0], "bio": trainerinfo[1], "image": trainerinfo[2],
                        "height": trainerinfo[3], "weight": trainerinfo[4], "dob": trainerinfo[5], 
                        "gender": trainerinfo[6], "verified": trainerinfo[7], "created_timestamp": trainerinfo[8]}

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
            cur.execute(f"""UPDATE info SET bio = %s, image = %s, height = %s, weight = %s, dob = %s, gender = %s, verified = %s WHERE trainerid = %s;""",
                (data['bio'], data['image'], data['height'], data['weight'], data['dob'], data['gender'], data['verified'], trainerid, ))

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
