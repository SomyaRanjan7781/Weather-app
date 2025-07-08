from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
app = Flask(__name__)
CORS(app)
API_KEY = "8b578569eecee3ba36ea02c94b036ebc"
@app.route("/", methods=["GET"])
def home():
    return "🌦️ Weather Backend is running!"
@app.route("/get_weather", methods=["POST"])
def get_weather():
    data = request.get_json()
    city = data.get("city")
    if not city:
        return jsonify({"error": "No city provided"}), 400
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    
    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404
    weather_data = response.json()
    result = {
        "city": weather_data["name"],
        "country": weather_data["sys"]["country"],
        "temperature": weather_data["main"]["temp"],
        "humidity": weather_data["main"]["humidity"],
        "description": weather_data["weather"][0]["description"],
        "icon": weather_data["weather"][0]["icon"]
    }
    return jsonify(result)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)