"use client";
import Image from "next/image";
// import rawText from "./Text_Samples/left_hand.tsx"
import { useState, useEffect } from 'react'
import { Card } from "./components/Card";
// import { Lesson } from "./components/Lesson";
import styles from "./components/Lesson.module.css";
import { stringify } from "querystring";

const lesson1text = "Lorem Ipsum only five centuries"
const lesson2text = "Calvins Lesson 2 text"
const lesson3text = "Lorem Ipsum has been the industry's"
const lesson4text = "standard dummy text ever since the 1500s"
const lesson5text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"

type LessonsDict = {
  [key: number]: [title: string, text: string]
}

const lessonsDict: LessonsDict = {
  0: ["lesson 1", lesson1text], 
  1: ["lesson 2", lesson2text],
  2: ["lesson 3", lesson3text],
  3: ["lesson 4", lesson4text],
  4: ["lesson 5", lesson5text]

}
// const hardcoded = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
export function testServerConnection(updaterFunction) {
  // const endpoint = "http://127.0.0.1:5000";
  const endpoint = "http://127.0.0.1:5000/get_stats";
  fetch(endpoint).then(response => {
    if (!response.ok) {
      throw new Error(
        `Http error!!!`
      );
    }
    console.log("Response is actually fine!!!!")
    return response.json()
  }).then(data => {
      console.log("checking data?")
      console.log(data)
      updaterFunction(JSON.stringify(data))
  })
}

export function drop_database() {
  // const endpoint = "http://127.0.0.1:5000/drop_database"
  // const endpoint = "http://127.0.0.1:5000/dropdb";

  // const endpoint = "http://127.0.0.1:5000/get_stats"
  const endpoint = "http://127.0.0.1:5000/dropdb";
  fetch(endpoint).then(response => {
    if (!response.ok) {
      throw new Error(
        `Http error!!!`
      );
    }
    return response.json()
  })
}

export async function testPostMethods(minutes: number) {
  // const endpoint = "http://127.0.0.1:5000";
  const endpoint = `http://127.0.0.1:5000/post_minutes/${minutes}`;
  const response = await fetch(endpoint, {
    method: "POST",
  })
  if (!response.ok) {
    throw new Error("Request failed");
  }
  const data = await response.json();
  console.log(data);
}

export default function Root()  {
  const [serverText, setServerText] = useState<string>()
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  if (activeLessonId !== null) {
    // const dictEntry = lessonsDict.find()
    const [title, text] = lessonsDict[activeLessonId]
    return (
      <Card
        title={title}
        text={text}
        backToMain={setActiveLessonId}
      >
      </Card>
    )
  } else {
    return (
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
        <button
          onClick={() => {
              setServerText(testServerConnection(setServerText))
          }}>
            Test the GET Methods
            {'\n' + serverText}
        </button>

        <button
        onClick={() => {
            testPostMethods(100)
        }}
        >
          Test Post Methods
        </button>
        <button
          onClick={drop_database}
        >
          Clear Database Schema
        </button>
      </div>
    );
  }
}
