from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
# from db import retrieve_stats
import db

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from the backend!"})

@app.route('/dropdb', methods=['GET'])
def drop_database():
    print("Dropping the database")
    db.drop_db()
    return jsonify({"message": "Hello from the backend!"})
@app.route('/init_db')
def init_db():
    db.init_db()
    return jsonify({"message": "Hello from the backend!"})

@app.route('/get_accuracy/<int:card_id>')
def get_accuracy(card_id):
    blah = db.get_total_accuracy(card_id)
    # return blah
    return jsonify({
    "status": "ok",
    "accuracy": blah
    })
@app.route('/get_wpm/<int:card_id>')
def get_wpm(card_id):
    blah = db.get_total_wpm(card_id)
    # print(f"Server tried to get card wpm for id={card_id}.. output={blah}")
    # return blah
    return jsonify({
        "status": "ok",
        "wpm": blah
    })
@app.route('/total_stats/<int:card_id>/<int:correct>/<int:incorrect>/<int:seconds>', methods=['POST'])
def update_total_stats(card_id, correct, incorrect, seconds):
    # print("CAlled function to update total stats")
    # print(f"card_id={card_id} | correct_count={correct} | incorrect={incorrect}")
    db.update_chars_and_seconds(card_id, correct, incorrect, seconds)
    return jsonify({
        "status": "ok"
    })
    
@app.route('/get_entries_dict')
def get_entries_dict():
    entries_dict = db.retrieve_all_db_entries()
    return jsonify({
        "status": "ok",
        "entries_dict": entries_dict
    })
@app.route('/add_lesson/<string:title>/<string:text>', methods=['POST'])
def add_lesson(title, text):
    # print(f"Add lesson was called with title:{title} | text={text}")
    db.add_lesson(title, text) ## need to 
    return jsonify({
        "status": "ok"
    })
    
@app.route('/get_wpm_and_accuracy_plot/<int:cardId>')
def get_wpm_and_accuracy_plot(cardId):
    wpm_accuracies = db.get_wpm_plot(cardId) ## format is [(wpm, accuracy), (wpm, accuracy), etc.]
    wpms = []
    accuracies = []
    for entry in wpm_accuracies:
        wpms.append(round(entry[0], 0))
        accuracies.append(round(entry[1], 2))
    print(f"wpms: {wpms}")
    print(f"accuracies: {accuracies}")
    return jsonify({
        "status": "ok",
        "wpms" : wpms,
        "accuracies": accuracies
    })
    
# if __name__ == "__main__":
#     app.run(port=5000)