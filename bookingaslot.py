from flask import Flask, request, jsonify
from flask_cors import CORS
from os import environ
# docker build -t dylanchua/bookingaslot:1.0 ./

import os, sys

import requests
from invokes import invoke_http

app = Flask(__name__)
CORS(app)

trainerURL = environ.get('trainerURL', 'http://127.0.0.1:5000')
bookingURL = environ.get('bookingURL', 'http://127.0.0.1:5001')

@app.route("/payment", methods=['POST'])
def place_order():
    # Simple check of input format and data of the request are JSON
    if request.is_json:
        try:
            payment = request.get_json()
            print("\nReceived a request for payment in JSON:", payment)

            result = processPayment(payment)
            return jsonify(result), result["code"]

        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "bookingaslot.py internal error: " + ex_str
            }), 500

    # if reached here, not a JSON request.
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


def processPayment(payment):
    # 2. Send the order info {cart items}
    # Invoke the order microservice
    trainerExist = False
    slotExist = False

    print('\n-----Invoking trainer microservice-----')
    trainerID = payment.get('trainerID', None)
    trainerResult = invoke_http(f"{trainerURL}/trainer/{trainerID}", method='GET')
    print('trainerResult:', trainerResult)

    # Check the order result; if a failure, send it to the error microservice.

    if trainerResult['code'] == 200:
        trainerID = trainerResult['data']['trainer']['trainerid']
        trainerExist = True
        # If the above line executes successfully, it means trainerResult["code"] exists
        print(f"Trainer {trainerID} exists")
    else:
        # Handle the case when trainerResult["code"] does not exist
        # Return an error response or handle it accordingly
        print(trainerResult)
        return {
            "code": 500,
            "message": "Trainer does not exist."
        }

    # 5. Send new order to shipping
    # Invoke the shipping record microservice
    print('\n\n-----Invoking booking microservice-----')
    package = payment.get('packageID', None)
    bookingResult = invoke_http(f"{bookingURL}/package/{package}/availability", method='GET')
    print("bookingResult:", bookingResult, '\n')

    # Check the shipping result;
    # if a failure, send it to the error microservice.
    slots = []
    slotid = []
    if bookingResult['code'] == 200:
        for data in bookingResult['data']['availability']:
            if data['status'] == 'Open':
                slots.append(data)
                slotid.append(data['availabilityid'])
                slotExist = True
        # If the above line executes successfully, it means trainerResult["code"] exists
        print(f"Package {package} exists")
    else:
        # Handle the case when trainerResult["code"] does not exist
        # Return an error response or handle it accordingly
        return {
            "code": 500,
            "message": "Package does not exist."
        }
    
    if len(slots) != 0:
        print(f"There are slots for package {package}")
    else:
        return {
            "code": 500,
            "message": "There are no slots for package requested"
        }    

    if trainerExist and slotExist:
        availabilityID = payment.get('availabilityID', None)
        if availabilityID in slotid:
            json_data = {
                "availabilityid": availabilityID,
                "status": "Reserved"
            }
            successfulReservation = invoke_http(f"{bookingURL}/availability/update_status", method='put', json=json_data)
            print(successfulReservation)

        else:
            return {
                "code": 500,
                "message": "Availability ID does not match slot"
        }    
    reservationResult = invoke_http(f"{bookingURL}/package/{package}/availability", method='GET')
    

    # 7. Return created order, shipping record
    return {
    "code": 201,
        "data": {
            "Trainer Exist": trainerExist,
            "Package Status": reservationResult
        }
    }


# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          " for placing a payment...")
    app.run(host="0.0.0.0", port=5100, debug=True)