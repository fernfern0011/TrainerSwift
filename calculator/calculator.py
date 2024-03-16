from flask import Flask, request, jsonify
from invokes import invoke_http

app = Flask(__name__)

physical_activity_level = 1.6

@app.route('/calculator')
def calculate():
    data = request.get_json()
    clientid = data["clientid"]
    weight = data["weight"]
    height = data["height"]
    age = data["age"]

    is_bulk = request.args.get('type') == "bulk"

    # https://steelsupplements.com/blogs/steel-blog/lean-bulking-macros-everything-you-need-to-know#:~:text=When%20you%20are%20bulking%2C%20the,of%20which%20are%20important%20macros.

    calories_needed = (10 * weight + 6.25 * height - 5 * age - 161) * physical_activity_level * (1.1 if is_bulk else 0.9)
    protein_needed = weight * (2.5 if is_bulk else 2.2)
    carbs_needed = weight * (7 if is_bulk else 2)
    fat_needed = weight * (2 if is_bulk else 1)

    # https://www.omnicalculator.com/health/maintenance-calorie

    response = invoke_http('http://127.0.0.1:5000/diet/get_monthly_average',json={"clientid":clientid})
    average_value = response["data"]
    average_calories = float(average_value["average_calories"])
    average_carbs = float(average_value["average_carbs"])
    average_protein = float(average_value["average_protein"])
    average_fat = float(average_value["average_fat"])

    
    return jsonify({
        "calories": calories_needed,
        "carbs": carbs_needed,
        "protein": protein_needed,
        "fat": fat_needed,
        "calories_diff":calories_needed-average_calories,
        "carbs_diff":carbs_needed-average_carbs,
        "protein_diff":protein_needed-average_protein,
        "fat_diff":fat_needed-average_fat
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)