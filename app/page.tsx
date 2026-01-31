"use client";
import Image from "next/image";
// import rawText from "./Text_Samples/left_hand.tsx"
import { useState, useEffect } from 'react'
import { Card } from "./components/Card/Card";
// import { Lesson } from "./components/Lesson";
import styles from "./components/Lesson.module.css";
import { stringify } from "querystring";
import textarea from 'react'
import { BrowserRouter, Route, Router, Routes, useNavigate } from 'react-router-dom'
import ProblemKeyPage from "./components/ProblemKeys/page";
import Link from 'next/link';
import { clear_database, createLesson, drop_database, init_database, retrieve_database_entries } from "./lib/appCRUDfunctions";

const lesson1text = "Lorem Ipsum only five centuries"
const lesson2text = "Calvins Lesson 2 text"
const lesson3text = "Lorem Ipsum has been the industry's"
const lesson4text = "standard dummy text ever since the 1500s"
const lesson5text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
type LessonsDict = {
  [key: number]: [title: string, text: string]
}
export function NavBar() {
  return (
    <div>
      <Link href={"/"}> Home Page </Link> |
      <Link href={"/components/ProblemKeys"}> Problem Keys </Link>
    </div>
  );
}
export function NewLessonPopupComponent({inputTitle, inputText, titleUpdater, textUpdater, popupUpdater}) {
    return (
      <div>
        <div
          style={{
            justifyContent:'center',
            justifyItems:'center',
            display:'flex',
            flexDirection:'column'
          }}
        >
          {/* New Lesson popup */}
          Lesson Name
            <textarea
                name="title"
                autoFocus={true}
                defaultValue="ex. Lesson 2"
                onChange={e => {
                  // setInputTitle(e.target.value)
                  titleUpdater(e.target.value)
                  // console.log(e.target.value)
                }
                }
              >
                {/* textttt */}

            </textarea>
            Lesson Text
            <textarea
            name="text"
            autoFocus={true}
            defaultValue="Fill in lesson text here"
              onChange={e => {
                textUpdater(e.target.value)
                // setInputText(e.target.value)
                }}
            >
              {/* textttt */}
            </textarea>
          </div>
          <button
          className={styles.create_lesson_button}
          onClick={() => {
            console.log("Submit button")
            console.log("title: ", inputTitle)
            console.log("text: ", inputText)
            createLesson(inputTitle, inputText, popupUpdater)
            // setNewLessonPopup(false)
          }}
          >
            CREATE LESSON
          </button>
      </div>
    )
}


export function HomePage()  {
  const [serverText, setServerText] = useState<string>()
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [newLessonPopup, setNewLessonPopup] = useState<boolean>(false);
  const [lessonsDict, setLessonsDict] = useState<LessonsDict>()
  const [inputTitle, setInputTitle] = useState<string>("")
  const [inputText, setInputText] = useState<string>("")

  useEffect(() => {
    retrieve_database_entries(setLessonsDict)
  }, [newLessonPopup])
  useEffect(() => {
    setNewLessonPopup(false)
  }, [])

  if (activeLessonId !== null ) {
    if (lessonsDict) {
      // const dictEntry = lessonsDict.find()
      // entries_dict[id] = (title, correct, wrong, text)
      console.log("WANT THE DATA FROM THIS ENTRY!!!!!!!!!!!!!!!!!!!!!")
      console.log(lessonsDict[activeLessonId])
      const [title, correct_count, wrong_count, text] = lessonsDict[activeLessonId]
      console.log("Title and text I am about to pass onto the card class")
      console.log("Title | ", title, "... Text | ", text)
      return (
        <Card
          title={title}
          text={text}
          id={activeLessonId}
          backToMain={setActiveLessonId}
        >
        </Card>
      )
    }
  } else if (newLessonPopup) {
    return (
      <NewLessonPopupComponent
        inputTitle={inputTitle}
        inputText={inputText}
        titleUpdater={setInputTitle}
        textUpdater={setInputText}    
        popupUpdater={setNewLessonPopup}
      />
    )
  }
  
  else {
    if (!lessonsDict) {
      let resp = retrieve_database_entries(setLessonsDict)
      return (
        <div>
          No Lessons-Dict entries

          <div/>
            {/* <button
              onClick={() => {
                console.log("New Lesson Button")
                setNewLessonPopup(true)
                let resp = retrieve_database_entries(setLessonsDict)
                console.log(resp)
              }}
            >
              New Lesson +
            </button> */}
        </div>
      )
    }
      return ( // -------------------- THIS IS WHERE THE LESSON IS PICKED AND PASSED FORWARD ------------------
          <div className={styles.main_screen}>
            <main className={styles.lesson_list}>
              { 
              Object.entries(lessonsDict).map(([id, lesson]) => (
                  <button
                    key={id}
                    onClick={() => setActiveLessonId(Number(id))}
                    className={styles.lesson_card}
                  >
                    {lesson[0]}
                  </button>
                ))}
            </main>
            <div style={{
              display:'flex',
              flexDirection: 'column',
              fontWeight: 'bold',
              // width:'50%' ,
              fontSize:'large',
              color: 'orange',
              // background: 'lightgreen',
              gap:10,
              padding:10
            }}> 
              {/* <button className="item"
                onClick={drop_database}
              >
                DROP Database Schema
              </button> */}
              <button className="item"
                onClick ={() => {
                  clear_database(),
                  retrieve_database_entries(setLessonsDict)
                }}
                

              >
                Clear database tables
              </button>
              
              {/* <div/> */}
              <button className="item"
                onClick={init_database}
              >
                Init Database
              </button>
              <button
                onClick={() => {
                  console.log("New Lesson Button")
                  setNewLessonPopup(true)
                  let resp = retrieve_database_entries(setLessonsDict)
                  console.log(resp)
                }}
              >
                New Lesson +
              </button>
            </div>
          </div>
      );
  }
}

export default function Root() {
  return (
    <div>
      <NavBar/>
      <HomePage/>
    </div>

  );
}