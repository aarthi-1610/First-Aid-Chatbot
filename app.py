from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import process
import json

app = Flask(__name__)
CORS(app)

# Load first-aid responses from JSON file
with open("first_aid_data.json", "r") as file:
    data = json.load(file)

# Convert data into a dictionary for easy searching
responses = {entry["condition"].lower(): entry["response"] for entry in data["first_aid"]}

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").lower().strip()

    # Direct match check
    if user_input in responses:
        return jsonify({"response": responses[user_input]})

    # Check if user input contains any known keyword
    for key in responses.keys():
        if key in user_input:
            return jsonify({"response": responses[key]})

    # Use fuzzy matching as a fallback
    best_match, confidence = process.extractOne(user_input, responses.keys())

    if confidence > 60:
        return jsonify({"response": responses[best_match]})

    # If no match is found, return a default response
    return jsonify({"response": "I'm sorry, I don't have information on that. Please consult a medical professional."})

if __name__ == "__main__":
    app.run(debug=True)
