import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import httpx

app = Flask(__name__)
CORS(app)

token = os.environ.get('BOT_TOKEN')
chat_id = os.environ.get('CHAT_ID')

@app.route('/push', methods=['POST'])
def push():
    data = request.json
    username = data["pusher"]["name"]
    repo_commits = len(data["commits"])

    httpx.post(f"https://api.telegram.org/bot{token}/sendMessage", json={
        "chat_id": chat_id,
        "text": f"🌲 {username} pushed {repo_commits} new commit(s) to Junggle!"
    })

    return jsonify({"message": "Message sent"}), 200


@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Service is running"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)