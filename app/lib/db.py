import sqlite3

# lesson Id: [chars_total, right_total, wrong_total, total time typing]
# create_table = '<create_table_statement>'
def clear_db():
    query = """
    DROP TABLE IF EXISTS Lessons"""
    try:
        with sqlite3.connect("typing.db") as typing_db:
            cursor = typing_db.cursor()
            cursor.execute(query)
    except sqlite3.OperationalError as e:
        print("Failed to delete database:", e)
def init_db():
    create_table = """CREATE TABLE IF NOT EXISTS Lessons
                    (id INTEGER PRIMARY KEY, 
                    title text NOT NULL, 
                    total_typed_chars Integer, 
                    total_correct_chars Integer,
                    total_wrong_chars Integer
                    );"""
    try:
        with sqlite3.connect("typing.db") as typing_db:
            cursor = typing_db.cursor()
            cursor.execute(create_table)
    except sqlite3.OperationalError as e:
        print("Failed to open database:", e)

def retrieve_stats(id: int):
    query = """
        SELECT total_typed_chars, total_wrong_chars
        FROM Lessons
        WHERE id = ?
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (id,))   # <-- tuple is REQUIRED
        result = cursor.fetchone()
        print(result)
    # print(result)
    return result

def add_lesson(id, title):
    query = """
        INSERT OR IGNORE INTO Lessons (id, title, total_typed_chars, total_correct_chars, total_wrong_chars)
        VALUES (?, ?, 0, 0, 0)
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (id, title))
def store_stats(id, char_count):
    query = """
        UPDATE Lessons 
        SET total_typed_chars = total_typed_chars + ?
        WHERE id = ?
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (char_count, id))
        
def view_whole_db():
    # print(typing_db)
    query = """SELECT * FROM Lessons"""
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        print("whole db outpout: " + str(result))
        
def update_correct_and_incorrect_chars(card_id, correct, incorrect):
    query = """
    UPDATE Lessons
    SET total_correct_chars = total_correct_chars + ?, total_wrong_chars = total_wrong_chars + ?
    WHERE id=?
    """
    # query = """
    #     UPDATE Lessons
    #     SET total_correct_chars = ?, total_wrong_chars = ?
    #     WHERE id=?
    # """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (correct, incorrect, card_id))
        
def get_total_accuracy(card_id):
    # correct_query = """
    # SELECT total_correct_chars WHERE id=?
    # """
    correct_query = """
    SELECT total_correct_chars,
    total_wrong_chars
    FROM Lessons
    WHERE id=?
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(correct_query, (card_id,))
        outputs= cursor.fetchone()
    # print("Wrong count fetched: " + str(wrong_count))
    right_count = outputs[0]
    wrong_count = outputs[1]
    accuracy = round((right_count - wrong_count) / right_count, 2)
    
    print("Wrong count fetched: " + str(wrong_count))
    print("Accuracy " + str(accuracy))
    return accuracy


def testing_refresh_db():
    clear_db() 
    init_db()
    add_lesson(0, "Calvins test")

if __name__ == "__main__":
    testing_refresh_db()
    # update_correct_and_incorrect_chars(0, 20, 5)
    # get_total_accuracy(0)
    # view_whole_db()
    
