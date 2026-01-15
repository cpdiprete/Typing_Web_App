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
                    text_data text NOT NULL,
                    total_typed_chars Integer, 
                    total_correct_chars Integer,
                    total_wrong_chars Integer,
                    seconds Integer
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

def add_lesson(title, text_data):
    new_id = get_next_valid_card_id()
    query = """
        INSERT OR IGNORE INTO Lessons (id, title, text_data, total_typed_chars, total_correct_chars, total_wrong_chars, seconds)
        VALUES (?, ?, ?, 0, 0, 0, 0)
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        # cursor.execute(query, (id, title, text_data))
        cursor.execute(query, (new_id, title, text_data))
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

def retrieve_all_db_entries():
    query = """
    SELECT id, title, total_correct_chars, total_wrong_chars, text_data
    FROM Lessons
    """
    entries_dict = dict()
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        for i in range(len(result)):
            id = result[i][0]
            title = result[i][1]
            correct = result[i][2]
            wrong = result[i][3]
            text = result[i][4]
            entries_dict[id] = (title, correct, wrong, text)
        return entries_dict
        
def update_chars_and_seconds(card_id, correct, incorrect, seconds):
    query = """
    UPDATE Lessons
    SET total_correct_chars = total_correct_chars + ?,
    total_wrong_chars = total_wrong_chars + ?,
    seconds = seconds + ?
    WHERE id=?
    """
    # query = """
    #     UPDATE Lessons
    #     SET total_correct_chars = ?, total_wrong_chars = ?
    #     WHERE id=?
    # """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (correct, incorrect, seconds, card_id))
        
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

def get_total_wpm(card_id):
    query = """
    SELECT total_correct_chars,
    total_wrong_chars,
    seconds
    FROM Lessons
    WHERE id=?"""
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (card_id,))
        result = cursor.fetchone()
        correct, wrong, milliseconds = result
        wpm = (correct + wrong) / 5
        seconds = milliseconds / 1000
        mins = seconds / 60
        wpm = wpm / mins
        return wpm
def get_next_valid_card_id():
    query = """
    SELECT id
    FROM Lessons
    ORDER BY id DESC
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query)
        fetched_row = cursor.fetchone()
        if (fetched_row is None):
            return 0
        (row_id,) = fetched_row ## it comes as a tuple containing a single integer
        print(f"one output: {row_id}")
        next_id = row_id + 1
        return next_id
        # all_fetch = cursor.fetchall()
        # print(f"All output: {all_fetch}" )
        
    
## __________________ Testing database methods section __________________
def testing_refresh_db():
    clear_db() 
    init_db()
def testing_lesson_additions():
    add_lesson(100, "Calvins test", "This is calvin testing his shit")
    add_lesson(100, "other one", "This is one more test for me to do")
    add_lesson(200, "nother", "bullshlsh fjj ")
    add_lesson(300, "one another", "budfddf")
    # add_lesson(4, "one another", "budfddf")
    update_chars_and_seconds(0, 20, 10, 1000)
    update_chars_and_seconds(1, 10, 15, 10000)
    
def test_incrementing_lesson():
    next_id = get_next_valid_card_id()
    add_lesson(next_id, f"title... {str(next_id)}", f"text... {str(next_id)}")
    

if __name__ == "__main__":
    # testing_refresh_db()
    view_whole_db()
    # testing_lesson_additions()
    # print(retrieve_all_db_entries())
    # test_incrementing_lesson()
    
    # get_total_accuracy(0)
    # print(get_total_wpm(0))
    
    
    
