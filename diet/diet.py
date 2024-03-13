from flask import Flask, jsonify, request
from config import *
from dbConnection import *
from invokes import invoke_http
app = Flask(__name__)

calories_URL="https://api.edamam.com/api/nutrition-data"
app_id="70f0b79f"
app_key="2ad7ba4942b277d6e7b316a5d45c39cc"
nutrition_type="logging"

@app.route('/diet')
def get_all_meal():
    data = request.get_json()
    clientid = data["clientid"]

    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f'SELECT * FROM Meal WHERE clientid={clientid} ORDER BY calories DESC')

    meallist = cur.fetchall()
    cur.close()
    con.close()

    meallist_json = [{"clientid": meal[0], "mealid": meal[1], "foodname": meal[2], "quantity": meal[3], "calories": meal[4], "carbs": meal[5], "protein": meal[6], "fat": meal[7]} for meal in meallist]

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

@app.route('/diet/add', methods=['POST'])
def add_meal():
    data = request.get_json()
    clientid = data["clientid"]
    foodname = data["foodname"]
    quantity = data["quantity"]

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
        cur.execute(f'INSERT INTO meal (clientid, foodname, quantity, calories, carbs, protein, fat) VALUES (%s, %s, %s, %s, %s, %s, %s)', (clientid, foodname, quantity, calories, carbs, protein, fat))
        cur.execute(f'SELECT * FROM meal ORDER BY mealid DESC')
        new_meal=cur.fetchone()[2]

        con.commit()
        cur.close()
        con.close()

        return jsonify({
            "code":201,
            "new_meal": new_meal,
            "message": f"Meal {new_meal} successfully added."
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
    foodname = data["foodname"]
    quantity = data["quantity"]

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
            "code":200,
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