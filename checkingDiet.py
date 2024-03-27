from flask import Flask, request, jsonify
from flask_cors import CORS
from invokes import invoke_http
from os import environ
import os, sys

app = Flask(__name__)
CORS(app)

dietURL = environ.get('dietURL')
traineeURL = environ.get('traineeURL')
calcURL = environ.get('calcURL')

@app.route('/check_my_diet', methods=["POST"])
def check_my_diet():

    if request.is_json:
        try:
            diet = request.get_json()
            print("\nReceived a request to check diet in JSON:", diet)

            result = processDiet(diet)
            return jsonify(result), result["code"]

        except Exception as e:
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "checkMyDiet.py internal error: " + ex_str
            }), 500

    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400

def processDiet(diet):
    traineeExist = False
    mealAddedSuccessfully = False

    print('\n-----Invoking trainee microservice-----')
    traineeid = diet.get('traineeid', None)
    traineeResult = invoke_http(f"{traineeURL}/traineeinfo/{traineeid}", method='GET')
    print('traineeResult:', traineeResult)

    if traineeResult['code'] == 200:
        traineeExist = True
        retrievedTraineeid = traineeResult['data']['traineeinfo']['traineeid']
        print(f"Trainee {retrievedTraineeid} exists")

        height = traineeResult['data']['traineeinfo']['height']
        weight = traineeResult['data']['traineeinfo']['weight']
        age = traineeResult['data']['traineeinfo']['age']

    else:
        print(traineeResult)
        return {
            "code": 500,
            "message": "Trainee does not exist."
        }
    
    print('\n\n-----Invoking diet microservice-----')
    dietResult = invoke_http(f"{dietURL}/diet/add", method='POST', json=diet)
    print("dietResult:", dietResult, '\n')

    if dietResult['code'] == 201:
        mealAddedSuccessfully=True
        added_meal = dietResult["data"]["foodname"]
        print(f"Meal {added_meal} added")

    else:
        return {
            "code": 500,
            "message": "Meal failed to update."
        }
    
    print('\n-----Invoking trainee microservice-----')
    monthlyAverageMeal = invoke_http(f"{dietURL}/diet/get_monthly_average", method='GET', json={"traineeid":traineeid})
    averageValue = monthlyAverageMeal["data"]
    
    print('\n\n-----Invoking calculator microservice-----')

    details = {"height": height, "weight": weight, "age":age, "info": averageValue}
    calcResult = invoke_http(f"{calcURL}/calculator", method='POST', json=details)
    print("calcResult:", calcResult, '\n')

    if calcResult['code'] == 200:
        data = calcResult["data"]
        print(f"Data {data} calculated")

    else:
        return {
            "code": 500,
            "message": "Calculator fail to calculate."
        }

    return {
    "code": 201,
        "data": {
            "traineeExist": traineeExist,
            "mealAddedSuccessfully": mealAddedSuccessfully,
            "addedMeal": added_meal,
            "calcResult": calcResult
        }
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)