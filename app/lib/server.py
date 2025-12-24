from flask import Flask
from db import retrieve_stats

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello world"

@app.route("/Get_stats/<int:lesson_id>")
def get_words(lesson_id: int):
    return 80

@app.route("/Post_stats/<int:words_typed>")
def post_stats(words_typed: int):
    return 103333