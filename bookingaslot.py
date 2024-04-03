from flask import Flask, request, jsonify
from flask_cors import CORS
from os import environ
import time
import amqp_connection
import json
import pika
import threading
# docker build -t dylanchua/bookingaslot:1.0 ./

import os, sys

from invokes import invoke_http

app = Flask(__name__)
CORS(app)

# Get environment variables with default values if not provided
traineeURL = os.environ.get('traineeURL', 'http://localhost:8000/traineeapi')
trainerURL = os.environ.get('trainerURL', 'http://localhost:8000/trainerapi')
bookingURL = os.environ.get('bookingURL', 'http://localhost:8000/bookingapi')
notificationURL = os.environ.get('notificationURL', 'http://notificationapi' )
websocketURL = os.environ.get('websocketURL', 'http://localhost:8000/websocketapi')


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
    traineeExist = False
    trainerExist = False
    slotExist = False
    paymentSuccessful = False
    paymentDetails = ''

    print('\n-----Invoking trainee microservice-----')
    traineeID = payment.get('traineeID', None)
    traineeResult = invoke_http(f"{traineeURL}/trainee/{traineeID}", method='GET')
    print('traineeResult:', traineeResult)

    # Check the order result; if a failure, send it to the error microservice.

    if traineeResult['code'] == 200:
        traineeID = traineeResult['data']['trainee']['traineeid']
        traineeUsername = traineeResult['data']['trainee']['username']
        traineeEmail = traineeResult['data']['trainee']['email']
        traineeExist = True
        # If the above line executes successfully, it means trainerResult["code"] exists
        print(f"Trainee {traineeID} exists")
    else:
        # Handle the case when trainerResult["code"] does not exist
        # Return an error response or handle it accordingly
        print(traineeResult)
        return {
            "code": 500,
            "message": "Trainee does not exist."
        }

    print('\n-----Invoking trainer microservice-----')
    trainerID = payment.get('trainerID', None)
    trainerResult = invoke_http(f"{trainerURL}/trainer/{trainerID}", method='GET')
    print('trainerResult:', trainerResult)

    # Check the order result; if a failure, send it to the error microservice.

    if trainerResult['code'] == 200:
        trainerID = trainerResult['data']['trainer']['trainerid']
        trainerName = trainerResult['data']['trainer']['username']
        trainerEmail = trainerResult['data']['trainer']['email']
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
    post = invoke_http(f"{bookingURL}/package/{package}", method='GET')
    postid = post['data']['package']['postid']
    isPremium = post['data']['package']['ispremium']
    trainer = invoke_http(f"{bookingURL}/post/{postid}", method='GET')

    trainerID2 = trainer['data']['post']['trainerid']

    if trainerID2 == trainerID:
        print("Trainer owns the post")
    else:
        return {
            "code": 500,
            "message": "Trainer does not own the post"
        }

    bookingResult = invoke_http(f"{bookingURL}/package/{package}/availability", method='GET')
    print("bookingResult:", bookingResult, '\n')

    slots = []
    slotid = []
    if bookingResult['code'] == 200:
        for data in bookingResult['data']['availability']:
            print(data)
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
    print(slots)
    if len(slots) != 0:
        print(f"There are slots for package {package}")
    else:
        return {
            "code": 500,
            "message": "There are no slots for package requested"
        }    

    if traineeExist and trainerExist and slotExist:
        availabilityID = payment.get('availabilityID', None)
        print(availabilityID)
        print(slotid)
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
    
    print('\n-----Invoking stripe microservice-----')
    e_queue_name = 'payment_notifications'        # queue to be subscribed by Error microservice
    def receivePayment(channel):
        try:
            nonlocal paymentSuccessful
            # set up a consumer and start to wait for coming messages
            channel.basic_consume(queue=e_queue_name, on_message_callback=callback, auto_ack=True)
            print('stripe microservice: Consuming from queue:', e_queue_name)

            def stop_consuming_after_timeout():
                nonlocal paymentSuccessful
                for x in range(60):
                    print('hi')
                    if paymentSuccessful:
                        break
                    time.sleep(5)  # Wait for 10 seconds
                channel.stop_consuming()  # Stop consuming messages

            # Start a thread to stop consuming after 10 seconds
            timeout_thread = threading.Thread(target=stop_consuming_after_timeout)
            timeout_thread.start()

            # Start consuming messages
            channel.start_consuming()

            # Wait for the timeout thread to finish
            timeout_thread.join()

            print("Consuming stopped after 10 seconds.")
        
        except pika.exceptions.AMQPError as e:
            print(f"stripe microservice: Failed to connect: {e}") 

        except KeyboardInterrupt:
            print("stripe microservice: Program interrupted by user.")

    def callback(channel, method, properties, body): # required signature for the callback; no return
        nonlocal paymentSuccessful
        print("\nPayment Received")
        processPayment(body)
        print()
        paymentSuccessful = True
        channel.stop_consuming()

    def processPayment(paymentMsg):
        nonlocal paymentDetails
        print("stripe microservice: Payment Successful")
        try:
            paymentDetails = json.loads(paymentMsg)
            print("--JSON:", paymentDetails)
        except Exception as e:
            print("--NOT JSON:", e)
            print("--DATA:", paymentMsg)
        print()
    
    print("Stripe microservice: Getting Connection")
    connection = amqp_connection.create_connection() #get the connection to the broker
    print("Stripe microservice: Connection established successfully")
    channel = connection.channel()
    receivePayment(channel)

    print(paymentSuccessful)
    if paymentSuccessful == True:
        print(f"Payment successful")
        json_data = {
                "availabilityid": availabilityID,
                "status": "Closed"
            }
        successfulPayment = invoke_http(f"{bookingURL}/availability/update_status", method='put', json=json_data)
        print(successfulPayment)
    else:
        print(f"Payment unsuccessful")
        json_data = {
            "availabilityid": availabilityID,
            "status": "Open"
                }
        invoke_http(f"{bookingURL}/availability/update_status", method='put', json=json_data)
        print("Slot has been opened again")
        return {
            "code": 500,
            "message": "Payment was not completed within 5 minutes."
        }
    paymentResult = invoke_http(f"{bookingURL}/package/{package}/availability", method='GET')

    print("idiot")
    print('\n\n-----Invoking notification microservice-----')
    availabilityDetails = invoke_http(f"{bookingURL}/availability/{availabilityID}", method='GET')
    print(availabilityDetails)
    day = availabilityDetails['data']['availability']['day']
    timeslot = availabilityDetails['data']['availability']['time']
    print('hi')
    transactionNumber = paymentDetails['paymentIntent']['id']
    amount = paymentDetails['paymentIntent']['amount_received'] / 100

    json_data = {

        "data": {
            "traineeEmail": traineeEmail,
            "trainerEmail": trainerEmail,
            "clientName": traineeUsername,
            "trainerName": trainerName,
            "date": day,
            "time": timeslot,
            "transactionNumber": transactionNumber,
            "amount": amount
        }  
    }

    print(json_data)
    print("idiot")
    print(notificationURL)
    invoke_http(f"{notificationURL}/send-email", method='post', json=json_data)
   
    print('\n\n-----Invoking chat microservice-----')
    traineeID_str = str(traineeID)
    trainerID_str = str(trainerID)
    json_data = {
        "traineeID": traineeID_str,
        'trainerID': trainerID_str,
        "connection": True,
        "message":"yesss i'm here class is still taking place sorry",
        "sender" : "trainee"
    }
    print(json_data)
    successfulChat = invoke_http(f"{websocketURL}/websocketchat", method='post', json=json_data)
    print(successfulChat)

    print('\n\n-----Add booking into database-----')
    json_data = {
        "traineeid": traineeID,
        "availabilityid": availabilityID,
        'trainerid': trainerID,
        'ispremium': isPremium
    }
    successfulBookedby = invoke_http(f"{bookingURL}/bookedby/create", method='POST', json=json_data)
    print(successfulBookedby)

    # 7. Return created order, shipping record
    return {
    "code": 201,
        "data": {
            "Trainee Exist": traineeExist,
            "Trainer Exist": trainerExist,
            "Package Status": paymentResult,
            "Payment Result": paymentSuccessful,
            "ispremium": isPremium
        }
    }


# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          " for placing a payment...")
    app.run(host="0.0.0.0", port=5000, debug=True)
