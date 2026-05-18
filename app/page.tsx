"use client";
import Image from "next/image";
// import rawText from "./Text_Samples/left_hand.tsx"
import { useState, useEffect } from 'react'
import { Card } from "./components/Card/Card";
import home_page_styles from "./Home_page_styles.module.css"
import { stringify } from "querystring";
import textarea from 'react'
import { BrowserRouter, Route, Router, Routes, useNavigate } from 'react-router-dom'
import ProblemKeyPage from "./components/ProblemKeys/page";
import Link from 'next/link';
import { clear_database, createLesson, drop_database, init_database, retrieve_database_entries, getTopXProblemKeys, populate_lessons_from_archive, get_account_total_wpm_and_accuracy } from "./lib/appCRUDfunctions";

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
export async function deleteLessonsRender(updater, setLessonsDict) {
  let result = await clear_database()
  retrieve_database_entries(setLessonsDict)

  updater(prev => prev + 1)

}
export async function archiveFunctionsRender(updater) {
  let result = await populate_lessons_from_archive()
  updater(prev => prev + 1)
}
export async function display_wpm_and_accuracy(wpm_updater, accuracy_updater) {
  let [wpm, accuracy] = await get_account_total_wpm_and_accuracy() 
  wpm_updater(wpm)
  accuracy_updater(accuracy)
}
export function NewLessonPopupComponent({inputTitle, inputText, titleUpdater, textUpdater, popupUpdater}) {
  /*
    Renders the popup for a new lesson being created
    The user will set the input title and text
    This component 
  */
    return (
      <div className={home_page_styles.fullPage}>
        <h1 className = {home_page_styles.pageTitle}>Make a new lesson page</h1>
      <div
        className={home_page_styles.newLessonPopup}
          >
          <h1 className={home_page_styles.lessonCardSubtitles}>Lesson Name</h1>
        <div
        >
          <textarea
            name="title"
            className={`${home_page_styles.lessonInput} ${home_page_styles.titleInput}`}
            autoFocus={true}
            defaultValue="ex. Lesson 2"
            onChange={e => titleUpdater(e.target.value)}
          />
            </div>
            <h1 className={home_page_styles.lessonCardSubtitles}>Lesson Text</h1>
            <div>
          <textarea
            name="text"
            className={`${home_page_styles.lessonInput} ${home_page_styles.textInput}`}
            autoFocus={true}
            defaultValue="Fill in lesson text here"
            onChange={e => textUpdater(e.target.value)}
          />
          </div>
          <button
          className={home_page_styles.create_lesson_button}
          onClick={() => {
            // console.log("Submit button")
            console.log("title: ", inputTitle)
            console.log("text: ", inputText)
            createLesson(inputTitle, inputText, popupUpdater)
          }}
          >
            CREATE LESSON
          </button>
      </div>
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
  const [reRenderLessons, setReRerenderLessons] = useState<number>(0);
  const [accountTotalWpm, setAccountTotalWpm] = useState<number>(0);
  const [accountTotalAccuracy, setAccountTotalAccuracy] = useState<number>(0);

  useEffect(() => {
    retrieve_database_entries(setLessonsDict)
    display_wpm_and_accuracy(setAccountTotalWpm, setAccountTotalAccuracy)
  }, [newLessonPopup, reRenderLessons])
  useEffect(() => {
    setNewLessonPopup(false)
  }, [])

  if (activeLessonId !== null ) {
    if (lessonsDict) {
      // const dictEntry = lessonsDict.find()
      // entries_dict[id] = (title, correct, wrong, text)
      const [title, correct_count, wrong_count, text] = lessonsDict[activeLessonId]
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
        </div>
      )
    }
      return ( // -------------------- THIS IS WHERE THE LESSON IS PICKED AND PASSED FORWARD ------------------
          <div className={home_page_styles.main_screen}>
            <div>
              All-time Stats
              <h1>WPM: {accountTotalWpm}</h1>
              <h1>Accuracy: {accountTotalAccuracy}</h1>
            </div>
            <main className={home_page_styles.lesson_list}>
              { 
              Object.entries(lessonsDict).map(([id, lesson]) => (
                  <button
                    key={id}
                    onClick={() => setActiveLessonId(Number(id))}
                    className={home_page_styles.lesson_card}
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
              <button className="item"
                onClick ={() => {
                  deleteLessonsRender(setReRerenderLessons, setLessonsDict)
                }}
              >
                Clear database tables
              </button>

              <button
                onClick={() => {
                  setNewLessonPopup(true)
                  let resp = retrieve_database_entries(setLessonsDict)
                }}
              >
                New Lesson +
              </button>
              <button
                onClick={() => {
                  console.log("Restore Archived Lessons")
                  archiveFunctionsRender(setReRerenderLessons)
                  populate_lessons_from_archive()
                }}
              >
                Restore Archived Lessons
              </button>
            </div>
          </div>
      );
  }
}

export default function Root() {
  return (
    <div style = {{
      alignItems: 'center',
      // flexDirection: 'column'
    }}>
      <NavBar/>
      <HomePage/>
    </div>

  );
}