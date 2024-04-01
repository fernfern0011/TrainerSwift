from flask import Flask, request, jsonify
from flask_cors import CORS
from config import *
from dbConnection import *

app = Flask(__name__)
CORS(app)

physical_activity_level = 1.6

@app.route('/<int:traineeid>/calculator', methods=['GET'])
def recent(traineeid):
    con = get_db_connection(config)
    cur = con.cursor()
    cur.execute(f"SELECT * FROM calculator WHERE traineeid={traineeid}")

    calc = cur.fetchall()
    cur.close()
    con.close()

    calcList_json = {
        "nutrients": "Calories",
        "current": calc[1],
        "target":{
            "bulk": calc[5],
            "cut": calc[9]
        },
        "diff":{
            "bulk": calc[1]-calc[5],
            "cut": calc[1]-calc[9]
        },
        "nutrients": "Carbs",
        "current": calc[2],
        "target":{
            "bulk": calc[6],
            "cut": calc[10]
        },
        "diff":{
            "bulk": calc[2]-calc[6],
            "cut": calc[2]-calc[10]
        },
        "nutrients": "Protein",
        "current": calc[3],
        "target":{
            "bulk": calc[7],
            "cut": calc[11]
        },
        "diff":{
            "bulk": calc[3]-calc[7],
            "cut": calc[3]-calc[11]
        },
        "nutrients": "Fat",
        "current": calc[4],
        "target":{
            "bulk": calc[8],
            "cut": calc[12]
        },
        "diff":{
            "bulk": calc[4]-calc[8],
            "cut": calc[4]-calc[12]
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

@app.route('/calculator', methods=["POST"])
def calculate():
    data = request.get_json()
    weight = data["weight"]
    height = data["height"]
    age = data["age"]
    average_calories = float(data["info"]["average_calories"])
    average_carbs = float(data["info"]["average_carbs"])
    average_protein = float(data["info"]["average_protein"])
    average_fat = float(data["info"]["average_fat"])

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