"use client";
import Image from "next/image";
// import rawText from "./Text_Samples/left_hand.tsx"
import { useState, useEffect } from 'react'
import { Card } from "./components/Card";
// import { Lesson } from "./components/Lesson";
import styles from "./components/Lesson.module.css";
import { stringify } from "querystring";
import textarea from 'react'


const lesson1text = "Lorem Ipsum only five centuries"
const lesson2text = "Calvins Lesson 2 text"
const lesson3text = "Lorem Ipsum has been the industry's"
const lesson4text = "standard dummy text ever since the 1500s"
const lesson5text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"

type LessonsDict = {
  [key: number]: [title: string, text: string]
}



// const lessonsDict: LessonsDict = {
//   0: ["lesson 1", lesson1text], 
//   1: ["lesson 2", lesson2text],
//   2: ["lesson 3", lesson3text],
//   3: ["lesson 4", lesson4text],
//   4: ["lesson 5", lesson5text]

// }
// const hardcoded = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"

export function drop_database() {
  // const endpoint = "http://127.0.0.1:5000/dropdb";
  const endpoint = "http://localhost:5000/dropdb";
  fetch(endpoint).then(response => {
    if (!response.ok) {
      throw new Error(
        `Http error!!!`
      );
    }
    return response.json()
  })
}
export function init_database() {
  // const endpoint = "http://127.0.0.1:5000/init_db";
  const endpoint = "http://127.0.0.1:5000/init_db";
  fetch(endpoint).then(response=> {
    if (!response.ok) {
      throw new Error(
        'Http error in page.init_database'
      )
    }
    return response.json()
  })
}
export function retrieve_database_entries(updater) {
  // http://localhost:5000
  const endpoint = 'http://localhost:5000/get_entries_dict'
  // const endpoint = 'http://127.0.0.1:5000/get_entries_dict'
  // http://127.0.0.1:5000
  let entries_dict = fetch(endpoint).then(response => {
    if (!response.ok) {
      throw new Error (
        'Http error in page.retrieve_database_entries!'
      )
    }
    // console.log(response)
    return response.json()
  }).then(data => {
    // console.log(data.entries_dict[0])
    // return data.entries_dict
    console.log("page.txt.retrieve_database_entries() response...")
    console.log(data.entries_dict)
    updater(data.entries_dict)
  })
  // console.log(entries_dict)
}
export function createLesson(title:string, text:string, popup_updater_function){
  console.log("------------------------")
  console.log("Title:", title)
  console.log("Text:", text)
  // const endpoint = `http://127.0.0.1:5000/add_lesson/${title}/${text}`
  const endpoint = `http://localhost:5000/add_lesson/${title}/${text}`
  console.log(`page.tsx.createLesson endpoint: ${endpoint}`)
  console.log("------------------------")
    // const endpoint = `http://127.0.0.1:5000/total_stats/${card_id}/${correct_chars}/${incorrect_chars}/${seconds}`;
    // // const endpoint = `http://127.0.0.1:5000/total_stats/${card_id}/${correct_chars}/${incorrect_chars}/${100}`;
    fetch(endpoint, {
        method: "POST",
    }).then(response => {
      if (!response.ok) {
        throw new Error(
          'Http error in page/createLesson'
        )
      }
      popup_updater_function(false)
      return response // need to return something so I xan make an "if ..then based on this funcgion to set the new lesson popup"
    })
}
// export function create

export default function Root()  {
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
                  setInputTitle(e.target.value)
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
                setInputText(e.target.value)
                // console.log(e.target.value)
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
            createLesson(inputTitle, inputText, setNewLessonPopup)
            // setNewLessonPopup(false)
          }}
          >
            CREATE LESSON
          </button>
      </div>

    )
  }
  
  else {
    if (!lessonsDict) {
      return (
        <div>
          No Lessons-Dict entries
          <div/>
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
            <button className="item"
              onClick={drop_database}
            >
              Clear Database Schema
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
