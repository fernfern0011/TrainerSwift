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

    is_bulk = request.args.get('type') == "bulk"

    # https://steelsupplements.com/blogs/steel-blog/lean-bulking-macros-everything-you-need-to-know#:~:text=When%20you%20are%20bulking%2C%20the,of%20which%20are%20important%20macros.

    calories_needed = (10 * weight + 6.25 * height - 5 * age - 161) * physical_activity_level * (1.1 if is_bulk else 0.9)
    protein_needed = weight * (2.5 if is_bulk else 2.2)
    carbs_needed = weight * (7 if is_bulk else 2)
    fat_needed = weight * (2 if is_bulk else 1)

    # https://www.omnicalculator.com/health/maintenance-calorie

    
    return jsonify({
        "code": 200,
        "data": {
            "calories_needed": calories_needed,
            "carbs_needed": carbs_needed,
            "protein_needed": protein_needed,
            "fat_needed": fat_needed,
            "calories_diff":calories_needed-average_calories,
            "carbs_diff":carbs_needed-average_carbs,
            "protein_diff":protein_needed-average_protein,
            "fat_diff":fat_needed-average_fat
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)