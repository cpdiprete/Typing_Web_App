"use client";
import styles from "./Card.module.css";
import { useState, useEffect, useReducer } from 'react'
// import styles from "./Card.module.css";
let finished = false
type CardProps = {
    text: string,
    title: string
    id?: number
}
type CharProps = {
    character: string,
    correct?: boolean,
    seen?: boolean
}
type State = {
    curChar: number,
    lastWrong: boolean,
    correctDict: Record<number, number>
    numWrong: number
    numRight: number
    startTime: number
    textLength: number
    status: string
}

export function Individual_Character({character, correct, seen}: CharProps) {
    let set_color = "grey"
    let bg_color = null
    if (!seen) {
        set_color = "grey"
    } else {
        if (correct) {
            set_color = "green"
            bg_color = "lightGreen"
        } else {
            set_color = "red"
            bg_color = "#FFCCCB"
        }
    }
    if (bg_color !== null) {
        return (
            <span style={{color: set_color, backgroundColor: bg_color}}> {character}</span>
        )
    } else {
        return (
            <span style={{color: set_color}}> {character}</span>
        )
    }
}

function reducer(state: State, action: { type: string; key?: string }) {
    switch (action.type) {
        case "BACKSPACE":
            return {
                ...state,
                curChar: Math.max(0, state.curChar - 1),
                lastWrong: false,
            };

        case "CORRECT":
            // console.log("Num righr: ", state.numRight)
            // console.log("cur Char: ", state.curChar)
            return {
                ...state,
                curChar: state.curChar + 1,
                lastWrong: false,
                correctDict: {
                    ...state.correctDict,
                    [state.curChar]: 1,
                },
                numRight: state.numRight + 1
            };

        case "WRONG":
            if (!state.lastWrong) { // this is the first wrong
                return {
                    ...state,
                    curChar: state.curChar + 1,
                    lastWrong: true,
                    numWrong: state.numWrong + 1
                };
            } else {
                return {
                    ...state,
                    lastWrong: true
                };
            }
        case "DONE":
            console.log("DONE")
            return {
                ...state,
                status: "FINISHED"
            }
            // Now I want to call the end screen with the spot


        default:
        return state;
    }
}

export function Card({text, title, id}: CardProps) {
    const [state, dispatch] = useReducer(reducer, {
        curChar: 0,
        lastWrong: false,
        correctDict: {},
        numRight: 0,
        numWrong: 0,
        startTime: Date.now(),
        textLength: text.length,
        status: "Typing"
    });

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                return; // Don't need to do anything
            };
            if (e.key === "Backspace") {
                dispatch({ type: "BACKSPACE" });
            } else if (e.key === text[state.curChar]) {
                if (state.curChar >= (text.length - 1)) { // No more chars to type
                    dispatch({ type: "DONE" });
                } else {
                    dispatch({ type: "CORRECT" });
                }
            } else {
                dispatch({ type: "WRONG" });
            }
        };
        // console.log("EFFECT RAN");
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler); // Cleanup to remove old handler before the next one comes
    }, [state.curChar]);

    if (state.status === "FINISHED") {
            let accuracy_percentage = 100 * (state.numRight - state.numWrong) / state.numRight
            console.log("Accuracy:", (accuracy_percentage).toFixed(1), "%")
            let seconds = (Date.now() - state.startTime) / 1000
            let mins = seconds / 60
            console.log("Elapsed seconds: ", seconds.toFixed())
            let wpm = (state.textLength / 5) / mins
            console.log("WPM: ", wpm.toFixed(2))
        return  (
            <div>
                <p>DONE WITH TYPING TEST!!</p>
                <p>WPM: {wpm.toFixed(0)}</p>
                <p>Accuracy: {(accuracy_percentage).toFixed(1)}</p>
            </div>
        )
    } else {
    return (
        // state.status === "FINISHED" 
        <div className={styles.card_text}>
        {text.split("").map((ch, index) => (
            <Individual_Character
                key={index}
                character={ch}
                seen={index < state.curChar}
                correct={index in state.correctDict}
            />
        ))}
        </div>
    );
    }
}


