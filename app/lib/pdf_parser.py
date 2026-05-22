import pymupdf
import db

if __name__ == "__main__":
    # get the start of a chapter, until the end of the chapter from the user input
    chapter1Start = 14
    Chapter1end = 28
    lesson_character_limit = 400
    doc = pymupdf.open("./example.pdf") # file path that I can replace with my file upload section
    page_count = 0
    for page in doc: 
        if page_count < chapter1Start:
            page_count += 1
            continue
        if page_count >= Chapter1end:
            break
        page_text = page.get_text()
        for i in range(0, len(page_text), lesson_character_limit):
            title = f"Book Page: {i}"
            text = page_text[i:i + lesson_character_limit].strip()
            db.add_lesson(title, text)
        page_count += 1
    print("done")
