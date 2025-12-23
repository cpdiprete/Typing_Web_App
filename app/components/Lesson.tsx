import { useState, useEffect } from 'react'
import { Card } from "./Card";

type LessonProps = {
    id: number
    text: string,
    title: string
    activeLessonId: number | null
    onSelect: (id: number) => void;
}
const lesson1 = "Lorem Ipsum only five centuries"

export function Lesson({id, text, title, activeLessonId, onSelect}: LessonProps) {
    // if (activeLessonId === id) {
    // }
    // return (
    //     <div>
    //         <button
    //             onClick={() => {
    //                 onSelect(id)
    //             }}>
    //                 Attempt: {title}
    //         </button>
    //     </div>
    // )

}