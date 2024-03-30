from flask import Flask, jsonify, request
from config import load_config
from dbConnection import *
app = Flask(__name__)  # special variable that will call __main__


# Post #
# [GET] getAllPost
@app.route('/post', methods=['GET'])
def read_all_post_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM post ORDER BY postid ASC')

    postlist = cur.fetchall()
    cur.close()
    con.close()

    postlist_json = [{"postid": post[0], "title": post[1], "description": post[2],
                      "category": post[3], "trainerid": post[4], "image": post[5], "created_timestamp": post[6]} for post in postlist]

    if len(postlist):
        return jsonify({
            "code": 200,
            "data": {
                "post": [post for post in postlist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no post."
    })

# [GET] getOnePost
@app.route('/post/<int:postid>', methods=['GET'])
def read_post_by_id_query(postid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM post WHERE postid = %s;', (postid, ))

    postinfo = cur.fetchone()
    cur.close()
    con.close()

    if postinfo:
        post_json = {'postid': postinfo[0], 'title': postinfo[1], 'description': postinfo[2],
                     'category': postinfo[3], 'trainerid': postinfo[4], 'image': postinfo[5], 'created_timestamp': postinfo[6]}

        return jsonify({
            "code": 200,
            "data": {
                "post": post_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no post."
    })

# [POST] createNewPost
@app.route('/post/create', methods=['POST'])
def create_new_post_query():
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        category = data.get('category')
        trainerid = data.get('trainerid')
        image = data.get('image')

        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Create new post
            cur.execute("INSERT INTO post (postid, title, description, category, trainerid, image) VALUES (nextval('post_id_seq'), %s, %s, %s, %s, %s) RETURNING postid;",
                        (title, description, category, trainerid, image, ))

            # Get the ID of the newly inserted post
            new_postid = cur.fetchone()[0]

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 201,
                "new_postid": new_postid,
                "message": "Post created successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new post."
            })

# [PUT] updatePost
@app.route('/post/<int:postid>', methods=['PUT'])
def update_post_query(postid):
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Update a post
            cur.execute(f"""UPDATE post SET title = %s, description = %s, category = %s, image = %s WHERE trainerid = %s AND postid = %s;""",
                        (data['title'], data['description'], data['category'], data['trainerid'], data['image'], postid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Post updated successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to update post."
            })

# [DELETE] deletePost
@app.route('/post/<int:postid>', methods=['DELETE'])
def delete_post_query(postid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Delete a post
            cur.execute(
                f'DELETE FROM post WHERE postid = %s;', (postid, ))
            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Post deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a post."
            })


# Package #
# [GET] getAllPackage
@app.route('/package', methods=['GET'])
def read_all_packages_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM package ORDER BY packageid ASC')

    packagelist = cur.fetchall()
    cur.close()
    con.close()

    packagelist_json = [{'packageid': package[0], 'name': package[1], 'detail': package[2],
                         'price': package[3], 'mode': package[4], 'address': package[5], 'postid': package[6], 'ispremium': package[7], 'created_timestamp': package[8]} for package in packagelist]

    if len(packagelist):
        return jsonify({
            "code": 200,
            "data": {
                "package": [package for package in packagelist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no package."
    })

# [GET] getOnePackage
@app.route('/package/<int:packageid>', methods=['GET'])
def read_package_by_id_query(packageid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM package WHERE packageid = %s;', (packageid, ))

    packageinfo = cur.fetchone()
    cur.close()
    con.close()

    if packageinfo:
        package_json = {'packageid': packageinfo[0], 'name': packageinfo[1], 'detail': packageinfo[2],
                        'price': packageinfo[3], 'mode': packageinfo[4], 'address': packageinfo[5], 'postid': packageinfo[6], 'ispremium': packageinfo[7], 'created_timestamp': packageinfo[8]}

        return jsonify({
            "code": 200,
            "data": {
                "package": package_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no package."
    })

# [GET] getAllPackageByPostid
@app.route('/post/<int:postid>/package', methods=['GET'])
def read_packagelist_by_postid_query(postid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f"SELECT p.*, a.day, json_agg(jsonb_build_object('availabilityid', a.availabilityid, 'time', a.time, 'status', a.status)) AS timeslots FROM package p INNER JOIN availability a ON a.packageid = p.packageid WHERE p.postid = %s AND a.status = 'Open' GROUP BY p.packageid, a.day;", (postid, ))

    packagelist = cur.fetchall()
    cur.close()
    con.close()

    packagelist_json = [{'packageid': package[0], 'name': package[1], 'detail': package[2],
                         'price': package[3], 'mode': package[4], 'address': package[5], 'postid': package[6], 'ispremium': package[7], 'created_timestamp': package[8], 'day': package[9], 'timeslots': package[10]} for package in packagelist]

    if len(packagelist):
        return jsonify({
            "code": 200,
            "data": {
                "package": [package for package in packagelist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no package."
    })

# [POST] createNewPackage
@app.route('/package/create', methods=['POST'])
def create_new_package_query():
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        detail = data.get('detail')
        price = data.get('price')
        mode = data.get('mode')
        address = data.get('address')
        postid = data.get('postid')
        ispremium = data.get('ispremium')

        con = get_db_connection(config)
        cur = con.cursor()

        # Check whether Post ID exists
        cur.execute(
            f'SELECT EXISTS(SELECT 1 FROM post WHERE postid = %s);', (postid, ))
        post_exists = cur.fetchone()[0]

        if not post_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Post ID does not exist"
            })

        try:
            # Create new package
            cur.execute("INSERT INTO package (packageid, name, detail, price, mode, address, postid, ispremium) VALUES (nextval('package_id_seq'), %s, %s, %s, %s, %s, %s, %s) RETURNING packageid;",
                        (name, detail, price, mode, address, postid, ispremium, ))

            # Get the ID of the newly inserted package
            new_packageid = cur.fetchone()[0]

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 201,
                "new_packageid": new_packageid,
                "message": "Package created successfully."
            })

        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create new package."
            })

# [PUT] updatePackage
@app.route('/package/<int:packageid>', methods=['PUT'])
def update_package_by_id_query(packageid):
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Update a package
            cur.execute(f"""UPDATE package SET name = %s, detail = %s, price = %s, mode = %s, address = %s, ispremium = %s WHERE postid = %s AND packageid = %s;""",
                        (data['name'], data['detail'], data['price'], data['mode'], data['address'], data['ispremium'], data['postid'], packageid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Package updated successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to update package."
            })

# [DELETE] deletePackage
@app.route('/package/<int:packageid>', methods=['DELETE'])
def delete_package_by_id_query(packageid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Delete a package
            cur.execute(
                f'DELETE FROM package WHERE packageid = %s;', (packageid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Package deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a package."
            })


# Availability #
# [GET] getAllAvailabilities
@app.route('/availability', methods=['GET'])
def read_all_availability_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM availability ORDER BY availabilityid ASC')

    availabilitylist = cur.fetchall()
    cur.close()
    con.close()

    availabilitylist_json = [{"availabilityid": avail[0], "day": avail[1], "time": avail[2],
                              "status": avail[3], "packageid": avail[4], "created_timestamp": avail[5]} for avail in availabilitylist]

    if len(availabilitylist):
        return jsonify({
            "code": 200,
            "data": {
                "availabily": [avail for avail in availabilitylist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no availability."
    })

# [GET] getOneAvailability
@app.route('/availability/<int:availabilityid>', methods=['GET'])
def read__availability_by_id_query(availabilityid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM availability WHERE availabilityid = %s;', (availabilityid, ))

    availabilityinfo = cur.fetchone()
    cur.close()
    con.close()

    if availabilityinfo:
        availability_json = {"availabilityid": availabilityinfo[0], "day": availabilityinfo[1], "time": availabilityinfo[2],
                             "status": availabilityinfo[3], "packageid": availabilityinfo[4], "created_timestamp": availabilityinfo[5]}

        return jsonify({
            "code": 200,
            "data": {
                "availability": availability_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no availability."
    })

# [GET] getOneAvailabilityByPackageid
@app.route('/package/<int:packageid>/availability', methods=['GET'])
def read__availability_by_packageid_query(packageid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM availability WHERE packageid = %s ORDER BY availabilityid ASC;', (packageid, ))

    availabilityinfo = cur.fetchall()
    cur.close()
    con.close()

    availabilityinfo_for_package_json = [{"availabilityid": availinfo[0], "day": availinfo[1], "time": availinfo[2],
                                          "status": availinfo[3], "packageid": availinfo[4]} for availinfo in availabilityinfo]

    if len(availabilityinfo):
        return jsonify({
            "code": 200,
            "data": {
                "availability": [availinfo for availinfo in availabilityinfo_for_package_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no availability."
    })

# [GET] createNewAvailability
@app.route('/availability/create', methods=['POST'])
def create_availability_query():
    if request.method == 'POST':
        data = request.get_json()
        day = data.get('day')
        time = data.get('time')
        status = data.get('status')
        packageid = data.get('packageid')

        con = get_db_connection(config)
        cur = con.cursor()

        # check if the availability exists
        cur.execute(
            f"SELECT EXISTS(SELECT 1 FROM availability WHERE day = %s AND time = %s AND status = %s AND packageid = %s);", (day, time, status, packageid, ))
        availability_exists = cur.fetchone()[0]

        if availability_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Availability already exists."
            })

        try:
            # Create new availability
            cur.execute(f"""INSERT INTO availability (availabilityid, day, time, status, packageid)
                        VALUES (nextval('availability_id_seq'), %s, %s, %s, %s) RETURNING availabilityid;""",
                        (day, time, status, packageid, ))

            # Get the ID of the newly inserted availability
            new_availabilityid = cur.fetchone()[0]

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 201,
                "new_availabilityid": new_availabilityid,
                "message": "Availability created successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create an availability."
            })

# [PUT] updateAvailabilityStatus
@app.route('/availability/update_status', methods=['PUT'])
def update_availability_status_query():
    if request.method == 'PUT':
        data = request.get_json()
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            # Update an availability status
            cur.execute(f"""UPDATE availability SET status = %s WHERE availabilityid = %s;""",
                        (data['status'], data['availabilityid'], ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Availability updated successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to update an availability."
            })

# [DELETE] deleteAvailability
@app.route('/availability/<int:availabilityid>', methods=['DELETE'])
def delete_availability_query(availabilityid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()
        try:
            # Delete an availability
            cur.execute(
                f'DELETE FROM availability WHERE availabilityid = %s;', (availabilityid, ))

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Availability deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete an availability."
            })


# Bookedby #
# [GET] getAllBookedby
@app.route('/bookedby', methods=['GET'])
def read_all_bookedby_query():
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM bookedby ORDER BY bookedbyid ASC')

    bookedbylist = cur.fetchall()
    cur.close()
    con.close()

    bookedbylist_json = [{"bookedbyid": booked[0], "trainerid": booked[1],
                          "traineeid": booked[2], "availabilityid": booked[3], "ispremium": booked[4], "created_timestamp": booked[5]} for booked in bookedbylist]

    if len(bookedbylist):
        return jsonify({
            "code": 200,
            "data": {
                "bookedby": [booked for booked in bookedbylist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no booking."
    })

# [GET] getOneBookedby
@app.route('/bookedby/<int:bookedbyid>', methods=['GET'])
def read_bookedby_by_id_query(bookedbyid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT * FROM bookedby WHERE bookedbyid = %s;', (bookedbyid, ))

    bookedbyinfo = cur.fetchone()
    cur.close()
    con.close()

    if bookedbyinfo:
        bookedby_json = {'bookedbyid': bookedbyinfo[0], 'trainerid': bookedbyinfo[1], 'traineeid': bookedbyinfo[2],
                         'availability': bookedbyinfo[3], 'ispremium': bookedbyinfo[4], "created_timestamp": bookedbyinfo[5]}

        return jsonify({
            "code": 200,
            "data": {
                "bookedby": bookedby_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no booking."
    })

# [GET] getOneBookedbyDetails
@app.route('/bookedby/<int:bookedbyid>/details', methods=['GET'])
def read_bookedby_details_by_id_query(bookedbyid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT b.trainerid, a.day, a.time, pa.name, pa.address FROM bookedby b INNER JOIN availability a ON a.availabilityid = b.availabilityid INNER JOIN package pa ON pa.packageid = a.packageid WHERE b.bookedbyid = %s;', (bookedbyid, ))

    bookedbydetails = cur.fetchone()
    cur.close()
    con.close()

    if bookedbydetails:
        bookedbydetails_json = {
            'trainerid': bookedbydetails[0], 'availability_day': bookedbydetails[1], 'availability_time': bookedbydetails[2], 'package_name': bookedbydetails[3], 'address': bookedbydetails[4]}

        return jsonify({
            "code": 200,
            "data": {
                "bookedby_details": bookedbydetails_json
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no booking."
    })

# [GET] getAllBookedbyByTrainerid
@app.route('/trainer/<int:trainerid>/bookedby', methods=['GET'])
def read_bookedby_by_trainerid_query(trainerid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM bookedby WHERE trainerid = %s;', (trainerid, ))

    bookedbylist = cur.fetchall()
    cur.close()
    con.close()

    bookedbylist_json = [{"bookedbyid": booked[0], "trainerid": booked[1],
                          "traineeid": booked[2], "availabilityid": booked[3], "ispremium": booked[4], "created_timestamp": booked[5]} for booked in bookedbylist]

    if len(bookedbylist):
        return jsonify({
            "code": 200,
            "data": {
                "bookedby": [booked for booked in bookedbylist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no booking."
    })

# [GET] getAllBookedbyByTraineeid
@app.route('/trainee/<int:traineeid>/bookedby', methods=['GET'])
def read_bookedby_by_traineeid_query(traineeid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM bookedby WHERE traineeid = %s;', (traineeid, ))

    bookedbylist = cur.fetchall()
    cur.close()
    con.close()

    bookedbylist_json = [{"bookedbyid": booked[0], "trainerid": booked[1],
                          "traineeid": booked[2], "availabilityid": booked[3], "ispremium": booked[4], "created_timestamp": booked[5]} for booked in bookedbylist]

    if len(bookedbylist):
        return jsonify({
            "code": 200,
            "data": {
                "bookedby": [booked for booked in bookedbylist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no booking."
    })
    
# [GET] getAllBookedbyDetailsByTraineeid
@app.route('/trainee/<int:traineeid>/bookedbydetails', methods=['GET'])
def read_bookedbydetails_by_traineeid_query(traineeid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT b.trainerid, a.day, a.time, pa.name, pa.address FROM bookedby b INNER JOIN availability a ON a.availabilityid = b.availabilityid INNER JOIN package pa ON pa.packageid = a.packageid WHERE b.traineeid = %s;', (traineeid, ))

    bookedbydetailslist = cur.fetchall()
    cur.close()
    con.close()
    
    bookedbydetailslist_json = [{
            'trainerid': bookedbydetail[0], 'availability_day': bookedbydetail[1], 'availability_time': bookedbydetail[2], 'package_name': bookedbydetail[3], 'address': bookedbydetail[4]} for bookedbydetail in bookedbydetailslist]

    if len(bookedbydetailslist):
        return jsonify({
            "code": 200,
            "data": {
                "bookedby_details": [bookedbydetail for bookedbydetail in bookedbydetailslist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no booking."
    })

# [GET] getAllBookedbyDetailsByTrainerid
@app.route('/trainer/<int:trainerid>/bookedbydetails', methods=['GET'])
def read_bookedbydetails_by_trainerid_query(trainerid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(
        f'SELECT b.traineeid, a.day, a.time, pa.name, pa.address FROM bookedby b INNER JOIN availability a ON a.availabilityid = b.availabilityid INNER JOIN package pa ON pa.packageid = a.packageid WHERE b.trainerid = %s;', (trainerid, ))

    bookedbydetailslist = cur.fetchall()
    cur.close()
    con.close()
    
    bookedbydetailslist_json = [{
            'traineeid': bookedbydetail[0], 'availability_day': bookedbydetail[1], 'availability_time': bookedbydetail[2], 'package_name': bookedbydetail[3], 'address': bookedbydetail[4]} for bookedbydetail in bookedbydetailslist]

    if len(bookedbydetailslist):
        return jsonify({
            "code": 200,
            "data": {
                "bookedby_details": [bookedbydetail for bookedbydetail in bookedbydetailslist_json]
            }
        })
    return jsonify({
        "code": 400,
        "message": "There is no booking."
    })

# [POST] createNewBookedby
@app.route('/bookedby/create', methods=['POST'])
def create_bookedby_query():
    if request.method == 'POST':
        data = request.get_json()
        trainerid = data.get('trainerid')
        traineeid = data.get('traineeid')
        availabilityid = data.get('availabilityid')
        ispremium = data.get('ispremium')

        con = get_db_connection(config)
        cur = con.cursor()

        # check if the bookedby exists
        cur.execute(
            f"SELECT EXISTS(SELECT 1 FROM bookedby WHERE traineeid = %s AND availabilityid = %s);", (traineeid, availabilityid, ))
        bookedby_exists = cur.fetchone()[0]

        if bookedby_exists:
            return jsonify({
                "code": 400,
                "message": "Failed to create. Booking already exists."
            })

        try:
            # Create new bookedby
            cur.execute(f"""INSERT INTO bookedby (bookedbyid, trainerid, traineeid, availabilityid, ispremium)
                        VALUES (nextval('bookedby_id_seq'), %s, %s, %s, %s) RETURNING bookedbyid;""",
                        (trainerid, traineeid, availabilityid, ispremium,))

            # Get the ID of the newly inserted package
            new_bookedbyid = cur.fetchone()[0]

            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 201,
                "new_bookedbyid": new_bookedbyid,
                "message": "Booking created successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to create a booking."
            })

# [DELETE] deleteBookedby
@app.route('/bookedby/<int:bookedbyid>', methods=['DELETE'])
def delete_bookedby_by_id_query(bookedbyid):
    if request.method == 'DELETE':
        con = get_db_connection(config)
        cur = con.cursor()

        try:
            cur.execute(
                f'DELETE FROM bookedby WHERE bookedbyid = %s;', (bookedbyid, ))
            con.commit()
            cur.close()
            con.close()

            return jsonify({
                "code": 200,
                "message": "Booking deleted successfully."
            })
        except:
            return jsonify({
                "code": 400,
                "message": "Failed to delete a booking."
            })


if __name__ == '__main__':
    config = load_config()
    app.run(host='0.0.0.0', port=5000, debug=True)
