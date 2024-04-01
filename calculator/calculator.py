from flask import Flask, request, jsonify
from flask_cors import CORS
from config import *
from dbConnection import *

app = Flask(__name__)
CORS(app)

physical_activity_level = 1.6

@app.route('/calculator/<int:traineeid>', methods=['GET'])
def recent(traineeid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f"SELECT * FROM calculator WHERE traineeid={traineeid}")

    calc = cur.fetchall()
    cur.close()
    con.close()

    calcList_json = {
        "nutrients": "Calories",
        "current": round(calc[1],2),
        "target":{
            "bulk": round(calc[5],2),
            "cut": round(calc[9],2)
        },
        "diff":{
            "bulk": round(calc[1]-calc[5],2),
            "cut": round(calc[1]-calc[9],2)
        },
        "nutrients": "Carbs",
        "current": round(calc[2],2),
        "target":{
            "bulk": round(calc[6],2),
            "cut": round(calc[10],2)
        },
        "diff":{
            "bulk": round(calc[2]-calc[6],2),
            "cut": round(calc[2]-calc[10],2)
        },
        "nutrients": "Protein",
        "current": round(calc[3],2),
        "target":{
            "bulk": round(calc[7],2),
            "cut": round(calc[11],2)
        },
        "diff":{
            "bulk": round(calc[3]-calc[7],2),
            "cut": round(calc[3]-calc[11],2)
        },
        "nutrients": "Fat",
        "current": round(calc[4],2),
        "target":{
            "bulk": round(calc[8],2),
            "cut": round(calc[12],2)
        },
        "diff":{
            "bulk": round(calc[4]-calc[8],2),
            "cut": round(calc[4]-calc[12],2)
        }
    }

    if len(calc):
        return jsonify({
            "code": 200,
            "data": calcList_json
        })
    
    return jsonify({
        "code": 400,
        "message": "There is no data."
    })

@app.route('/calculator/<int:traineeid>', methods=["POST"])
def calculate(traineeid):
    data = request.get_json()
    weight = data["weight"]
    height = data["height"]
    age = data["age"]
    average_calories = float(data["info"]["average_calories"])
    average_carbs = float(data["info"]["average_carbs"])
    average_protein = float(data["info"]["average_protein"])
    average_fat = float(data["info"]["average_fat"])

    con = get_db_connection(config)
    cur = con.cursor()

    # https://steelsupplements.com/blogs/steel-blog/lean-bulking-macros-everything-you-need-to-know#:~:text=When%20you%20are%20bulking%2C%20the,of%20which%20are%20important%20macros.

    calories_needed_bulk = (10 * weight + 6.25 * height - 5 * age - 161) * physical_activity_level * 1.1
    calories_needed_cut = (10 * weight + 6.25 * height - 5 * age - 161) * physical_activity_level * 0.9
    protein_needed_bulk = weight * 2.5 
    protein_needed_cut = weight * 2.2
    carbs_needed_bulk = weight * 7
    carbs_needed_cut = weight * 2
    fat_needed_bulk = weight * 2
    fat_needed_cut = weight * 1

    calories_diff_bulk = average_calories-calories_needed_bulk
    calories_diff_cut = average_calories-calories_needed_cut
    carbs_diff_bulk = average_carbs-carbs_needed_bulk
    carbs_diff_cut = average_carbs-carbs_needed_cut
    protein_diff_bulk = average_protein-protein_needed_bulk
    protein_diff_cut = average_protein-protein_needed_cut
    fat_diff_bulk = average_fat-fat_needed_bulk
    fat_diff_cut = average_fat-fat_needed_cut

    # https://www.omnicalculator.com/health/maintenance-calorie


    cur.execute(f'SELECT EXISTS(SELECT 1 FROM calculator WHERE traineeid=%s);', (traineeid,))
    trainee_exists = cur.fetchone()[0]

    if trainee_exists:
        cur.execute(f"UPDATE meal SET current_calories=%s, current_carbs=%s, current_protein=%s, current_fat=%s, target_calories_bulk=%s, target_carbs_bulk=%s, target_protein_bulk=%s, target_fat_bulk=%s, target_calories_cut=%s, target_carbs_cut=%s, target_protein_cut=%s, target_fat_cut=%s WHERE traineeid = %s",(average_calories, average_carbs, average_protein, average_fat, calories_needed_bulk, protein_needed_bulk, carbs_needed_bulk, fat_needed_bulk, calories_needed_cut, protein_needed_cut, carbs_needed_cut, fat_needed_cut, traineeid, ))
    else:
        cur.execute(f"INSERT INTO calculator (traineeid, current_calories, current_carbs, current_protein, current_fat, target_calories_bulk, target_carbs_bulk, target_protein_bulk, target_fat_bulk, target_calories_cut, target_carbs_cut, target_protein_cut, target_fat_cut) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (traineeid, average_calories, average_carbs, average_protein, average_fat, calories_needed_bulk, protein_needed_bulk, carbs_needed_bulk, fat_needed_bulk, calories_needed_cut, protein_needed_cut, carbs_needed_cut, fat_needed_cut, ))


    cur.close()
    con.close()

    
    return jsonify({
        "code": 200,
        "data": [
            {
                "nutrients": "Calories",
                "current": round(average_calories,2),
                "target": {
                    "bulk": round(calories_needed_bulk,2),
                    "cut": round(calories_needed_cut,2)
                },
                "diff": {
                    "bulk": round(calories_diff_bulk,2),
                    "cut": round(calories_diff_cut,2)
                },
            },
            {
                "nutrients": "Carbs",
                "current": round(average_carbs,2),
                "target": {
                    "bulk": round(carbs_needed_bulk,2),
                    "cut": round(carbs_needed_cut,2)
                },
                "diff": {
                    "bulk": round(carbs_diff_bulk,2),
                    "cut": round(carbs_diff_cut,2)
                },
            },
            {
                "nutrients": "Protein",
                "current": round(average_protein,2),
                "target": {
                    "bulk": round(protein_needed_bulk,2),
                    "cut": round(protein_needed_cut,2)
                },
                "diff": {
                    "bulk": round(protein_diff_bulk,2),
                    "cut": round(protein_diff_cut,2)
                },
            },
            {
                "nutrients": "Fats",
                "current": round(average_fat,2),
                "target": {
                    "bulk": round(fat_needed_bulk,2),
                    "cut": round(fat_needed_cut,2)
                },
                "diff": {
                    "bulk": round(fat_diff_bulk,2),
                    "cut": round(fat_diff_cut,2)
                },
            },
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)