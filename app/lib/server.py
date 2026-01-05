from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
# from db import retrieve_stats
import db

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from the backend!"})

@app.route('/get_stats', methods=['GET'])
def get_stats():
    # db.retrieve_stats(0)
    db.init_db()
    db.view_whole_db()
    return jsonify({"message": "Hello from getStatsss!"})

@app.route('/post_minutes/<int:minutes>', methods=['POST', 'GET'])
def post_stats(seconds, words):
    print("seconds recieved: " + str(seconds))
    db.init_db()
    db.add_lesson(0, "TEST Lessonn!")
    # db.store_stats(0, 14)
    return jsonify({
        "status": "ok",
        "minutes": seconds
    })
    
if __name__ == "__main__":
    app.run(port=5000)