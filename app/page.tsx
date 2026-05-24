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
    <div className={home_page_styles.navBar}>
      <Link className={home_page_styles.navBarText} href={"/"}> Home Page </Link>
      <Link className={home_page_styles.navBarText} href={"/components/ProblemKeys"}> Problem Keys </Link>
    </div>
  );
}
export function AllTimeStats(
  {reRenderPageUpdater}
  // {accountTotalWpm, setAccountTotalAccuracy, setTotalTypingTime}
) {
  const [accountTotalWpm, setAccountTotalWpm] = useState<number>(0);
  const [accountTotalAccuracy, setAccountTotalAccuracy] = useState<number>(0);
  const [totalTypingTime, setTotalTypingTime] = useState<string>('unknown')
  const [reRenderAllTimeStats, setReRenderAllTimeStats] = useState<void>();

  useEffect(() => {
    display_wpm_and_accuracy(setAccountTotalWpm, setAccountTotalAccuracy, setTotalTypingTime)
  }, [reRenderAllTimeStats])
  return (
    <div className={home_page_styles.allTimeStatsFullContainer}>
        <h1 className={home_page_styles.allTimeStatsTitle}>All Time Statistics </h1>
      <div className={home_page_styles.allTimeStatsContainer}>
        <h1 className={home_page_styles.wpmText}>WPM: {accountTotalWpm}</h1>
        <h1 className={home_page_styles.wpmText}>Accuracy: {accountTotalAccuracy}%</h1>
        <h1 className={home_page_styles.wpmText}>Total Time: {totalTypingTime}</h1>
      </div>
    </div>
  )
}
export async function deleteLessonsRender(updater, setLessonsDict) {
  let result = await clear_database(updater)
  retrieve_database_entries(setLessonsDict)
  // some way to re-render the global stats, how can I call one to trigger the other?
}
export async function archiveFunctionsRender(updater, setLessonsDict) {
  let result = await populate_lessons_from_archive(updater)
  retrieve_database_entries(setLessonsDict)
}
export async function display_wpm_and_accuracy(wpm_updater, accuracy_updater, typing_time_updater) {
  let [wpm, accuracy, total_typing_time] = await get_account_total_wpm_and_accuracy() 
  wpm_updater(wpm)
  accuracy_updater(accuracy)
  typing_time_updater(total_typing_time)
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
export function HomePage({reRenderPageUpdater, lessonsDict, setLessonsDict})  {
  const [serverText, setServerText] = useState<string>()
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [newLessonPopup, setNewLessonPopup] = useState<boolean>(false);
  // const [lessonsDict, setLessonsDict] = useState<LessonsDict>()
  const [inputTitle, setInputTitle] = useState<string>("")
  const [inputText, setInputText] = useState<string>("")
  const [reRenderLessons, setReRerenderLessons] = useState<void>();

  useEffect(() => {
    retrieve_database_entries(setLessonsDict)
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
          // backToMain={handleBackToMain} // end goal is to use this to update the activeLessonId (like whats already happening), and to re-render the global typing stats as well
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
            <div className={home_page_styles.dbButtonBox}style={{
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
                  archiveFunctionsRender(setReRerenderLessons, setLessonsDict)
                  // populate_lessons_from_archive()
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
  const [reRenderHomePage, setReRenderHomePage] = useState<void>() // NEED TO CALL THIS FROM SUBMODULES TO BOTH RE-RENDER THE ALL TIME STATS, AS WELL AS THE ENTIRE LESSONS PAGE
  const [lessonDict, setLessonDict] = useState<LessonsDict>()
  useEffect(() => {
    retrieve_database_entries(setLessonDict)
  }, [reRenderHomePage])

  return (
    <div style = {{
      alignItems: 'center',
      // flexDirection: 'column'
    }}>
      <NavBar/>
      <AllTimeStats reRenderPageUpdater={setReRenderHomePage}/>
      <HomePage 
        reRenderPageUpdater={setReRenderHomePage}
        lessonsDict={lessonDict}
        setLessonsDict={setLessonDict}
      />
    </div>

  );
}