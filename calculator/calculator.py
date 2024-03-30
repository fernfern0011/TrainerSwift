from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

physical_activity_level = 1.6

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

    # https://www.omnicalculator.com/health/maintenance-calorie

    
    return jsonify({
        "code": 200,
        "data": [
            {
                "nutrients": "Calories",
                "current": average_calories,
                "target": {
                    "bulk": calories_needed_bulk,
                    "cut": calories_needed_cut
                },
                "diff": {
                    "bulk": average_calories-calories_needed_bulk,
                    "cut": average_calories-calories_needed_cut
                },
            },
            {
                "nutrients": "Carbs",
                "current": average_carbs,
                "target": {
                    "bulk": carbs_needed_bulk,
                    "cut": carbs_needed_cut
                },
                "diff": {
                    "bulk": average_carbs-carbs_needed_bulk,
                    "cut": average_carbs-carbs_needed_cut
                },
            },
            {
                "nutrients": "Protein",
                "current": average_protein,
                "target": {
                    "bulk": protein_needed_bulk,
                    "cut": protein_needed_cut
                },
                "diff": {
                    "bulk": average_protein-protein_needed_bulk,
                    "cut": average_protein-protein_needed_cut
                },
            },
            {
                "nutrients": "Fats",
                "current": average_fat,
                "target": {
                    "bulk": fat_needed_bulk,
                    "cut": fat_needed_cut
                },
                "diff": {
                    "bulk": average_fat-fat_needed_bulk,
                    "cut": average_fat-fat_needed_cut
                },
            },
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)