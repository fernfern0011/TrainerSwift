from flask import Flask, jsonify, request
from flask_cors import CORS
from config import *
from dbConnection import *
from invokes import invoke_http

app = Flask(__name__)
CORS(app)

calories_URL="https://api.edamam.com/api/nutrition-data"
app_id="70f0b79f"
app_key="2ad7ba4942b277d6e7b316a5d45c39cc"
nutrition_type="logging"

@app.route('/diet/<int:traineeid>/all')
def get_all_meal(traineeid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f"SELECT * FROM meal WHERE traineeid={traineeid} ORDER BY date_time DESC")

    meallist = cur.fetchall()
    cur.close()
    con.close()

    meallist_json = [{"traineeid": meal[0], "mealid": meal[1], "foodname": meal[2], "quantity": meal[3], "calories": round(meal[4],2), "carbs": round(meal[5],2), "protein": round(meal[6],2), "fat": round(meal[7],2), "date_time": meal[8]} for meal in meallist]

    if len(meallist):
        return jsonify({
            "code": 200,
            "data": {
                "meal": [meal for meal in meallist_json]
            }
        })
    
    return jsonify({
        "code": 400,
        "message": [{"traineeid": "No Data", "mealid": "No Data", "foodname": "No Data", "quantity": "No Data", "calories": "No Data", "carbs": "No Data", "protein": "No Data", "fat": "No Data", "date_time": "No Data"}]
    })

@app.route('/diet/<int:traineeid>/monthly')
def get_all_meal_by_month(traineeid):
    month = request.args.get('month')

    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f"SELECT * FROM meal WHERE traineeid={traineeid} AND TO_CHAR(date_time, 'Month') LIKE '%{month}%' ORDER BY date_time DESC")

    meallist = cur.fetchall()
    cur.close()
    con.close()

    meallist_json = [{"traineeid": meal[0], "mealid": meal[1], "foodname": meal[2], "quantity": meal[3], "calories": meal[4], "carbs": meal[5], "protein": meal[6], "fat": meal[7]} for meal in meallist]

    if len(meallist):
        return jsonify({
            "code": 200,
            "data": {
                "meal": [meal for meal in meallist_json]
            }
        })
    
    return jsonify({
        "code": 400,
        "message": "There is no meal."
    })

@app.route('/diet/<int:traineeid>/average')
def get_monthly_average(traineeid):

    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f"SELECT AVG(calories), AVG(carbs), AVG(protein), AVG(fat) FROM meal WHERE traineeid={traineeid} AND EXTRACT(MONTH FROM date_time)=EXTRACT(MONTH FROM CURRENT_TIMESTAMP) AND EXTRACT(YEAR FROM date_time)=EXTRACT(YEAR FROM CURRENT_TIMESTAMP) ")

    average_value = cur.fetchone()
    cur.close()
    con.close()

    if average_value != (None, ):
        return jsonify({
            "code": 200,
            "data": {
                "average_calories": average_value[0],
                "average_carbs": average_value[1],
                "average_protein": average_value[2],
                "average_fat": average_value[3]
            }
        })
    
    return jsonify({
        "code": 400,
        "message": "There is no meal."
    })

@app.route('/diet/add', methods=['POST'])
def add_meal():
    data = request.get_json()
    traineeid = data["traineeid"]
    foodname = data["meal"]["foodname"]
    quantity = data["meal"]["quantity"]

    global calories_URL
    calories_URL+=f"?app_id={app_id}&app_key={app_key}&nutrition-type={nutrition_type}&ingr={foodname}"
    
    response = invoke_http(calories_URL)
    calories = response['calories'] * quantity
    carbs = response['totalNutrients']['CHOCDF']['quantity'] * quantity
    protein = response['totalNutrients']['PROCNT']['quantity'] * quantity
    fat = response['totalNutrients']['FAT']['quantity'] * quantity

    con = get_db_connection(config)
    cur = con.cursor()

    try:
        cur.execute(f'INSERT INTO meal (traineeid, foodname, quantity, calories, carbs, protein, fat) VALUES (%s, %s, %s, %s, %s, %s, %s)', (traineeid, foodname, quantity, calories, carbs, protein, fat))
        cur.execute(f'SELECT * FROM meal ORDER BY mealid DESC')
        new_meal=cur.fetchone()
        meal_json={"traineeid": new_meal[0], "mealid": new_meal[1], "foodname": new_meal[2], "quantity": new_meal[3], "calories": new_meal[4], "carbs": new_meal[5], "protein": new_meal[6], "fat": new_meal[7]}

        con.commit()
        cur.close()
        con.close()

        return jsonify({
            "code":201,
            "data": meal_json,
            "message": f"Meal {meal_json['foodname']} successfully added."
        })

    except:
        return jsonify({
            "code": 400,
            "message": "Fail to add meal."
        })
    
@app.route('/diet/delete', methods=['DELETE'])
def delete_meal():
    data = request.get_json()
    mealid = data["mealid"]

    con = get_db_connection(config)
    cur = con.cursor()

    try:
        cur.execute(f'SELECT foodname FROM meal WHERE mealid={mealid}')
        deleted_meal = cur.fetchone()[0]

        cur.execute(f'DELETE FROM meal WHERE mealid={mealid}')

        con.commit()
        cur.close()
        con.close()

        return jsonify({
            "code":201,
            "deleted_meal": deleted_meal,
            "message": f"Meal {deleted_meal} successfully deleted."
        })

    except:
        return jsonify({
            "code": 400,
            "message": "Fail to delete meal."
        })
    
@app.route('/diet/update', methods=['PUT'])
def update_meal():
    data = request.get_json()
    mealid = data["mealid"]
    foodname = data["meal"]["foodname"]
    quantity = data["meal"]["quantity"]

    con = get_db_connection(config)
    cur = con.cursor()

    try:
        cur.execute(f'SELECT * FROM meal WHERE mealid={mealid}')
        result = cur.fetchone()
        target_foodname = result[0]
        target_quantity = result[1]
        target_calories = result[2]
        target_carbs = result[3]
        target_protein = result[4]
        target_fat = result[5]

        if target_foodname != foodname:
            global calories_URL
            calories_URL+=f"?app_id={app_id}&app_key={app_key}&nutrition-type={nutrition_type}&ingr={foodname}"
            
            response = invoke_http(calories_URL)
            calories = response['calories'] * quantity
            carbs = response['totalNutrients']['CHOCDF']['quantity'] * quantity
            protein = response['totalNutrients']['PROCNT']['quantity'] * quantity
            fat = response['totalNutrients']['FAT']['quantity'] * quantity

        elif target_quantity != quantity:
            calories = target_calories / target_quantity * quantity
            carbs = target_carbs / target_quantity * quantity
            protein = target_protein / target_quantity * quantity
            fat = target_fat / target_quantity * quantity

        print(foodname, quantity, calories, carbs, protein, fat)

        cur.execute(f"UPDATE meal SET foodname=%s, quantity=%s, calories=%s, carbs=%s, protein=%s, fat=%s WHERE mealid = %s",(foodname, quantity, calories, carbs, protein, fat, mealid, ))
        
        cur.execute(f"SELECT * FROM meal WHERE mealid={mealid}")
        updated_meal=cur.fetchone()[2]

        con.commit()
        cur.close()
        con.close()

        return jsonify({
            "code":201,
            "new_meal": updated_meal,
            "message": f"Meal {updated_meal} successfully updated."
        })

    except:
        return jsonify({
            "code": 400,
            "message": "Fail to update meal."
        })
    
if __name__ == "__main__":
    config = load_config()
    app.run(host="0.0.0.0", port=5000, debug=True)