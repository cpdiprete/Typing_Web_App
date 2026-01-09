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

@app.route('/dropdb', methods=['GET'])
def drop_database():
    print("Dropping the database")
    db.clear_db()
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
# `http://127.0.0.1:5000/total_words/${correct_chars}/${incorrect_chars}`;
@app.route('/get_accuracy/<int:card_id>')
def get_accuracy(card_id):
    blah = db.get_total_accuracy(card_id)
    print(f"Server tried to get card accuracy for id={card_id}.. output={blah}")
    # return blah
    return jsonify({
    "status": "ok",
    "accuracy": blah
    })

@app.route('/total_words/<int:card_id>/<int:correct>/<int:incorrect>', methods=['POST'])
def update_correct_and_incorrect(card_id, correct, incorrect):
    print("CAlled function to update total accurcayyyyyyyy")
    print(f"card_id={card_id} | correct_count={correct} | incorrect={incorrect}")
    db.update_correct_and_incorrect_chars(card_id, correct, incorrect)
    return jsonify({
        "status": "ok"
    })
    
# if __name__ == "__main__":
#     app.run(port=5000)