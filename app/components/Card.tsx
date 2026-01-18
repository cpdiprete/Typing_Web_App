"use client";
import styles from "./Card.module.css";
import { useState, useEffect, useReducer } from 'react'
import { Wpmchart } from "./wpmplots"
import useSound from "use-sound"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { color } from "chart.js/helpers";
// import get_wpm_and_accuracy_plot from "./wpmplots"
let finished = false
type CardProps = {
    text: string,
    title: string
    id?: number
    backToMain:(id:number | null) => void;
}
type CharProps = {
    character: string,
    correct?: boolean,
    seen?: boolean
}
type State = {
    curChar: number,
    lastWrong: boolean,
    correctDict: Record<number | any, number | any>
    numWrong: number
    numRight: number
    textLength: number
    status: string
    startTime: number
    endTime: number
}
export async function updateTotalStats(card_id:number, correct_chars: number, incorrect_chars: number, seconds:number) {
  // const endpoint = "http://127.0.0.1:5000";
    const endpoint = `http://127.0.0.1:5000/total_stats/${card_id}/${correct_chars}/${incorrect_chars}/${seconds}`;
    // const endpoint = `http://127.0.0.1:5000/total_stats/${card_id}/${correct_chars}/${incorrect_chars}/${100}`;
    const response = await fetch(endpoint, {
        method: "POST",
    })
    if (!response.ok) {
        throw new Error("Request failed");
    }
    console.log("Updated total accuracy")
    // const data = await response.json();
    // console.log(data);
}

export async function getTotalAccuracy(card_id) {
    console.log("trying to check total accuracy")
    const endpoint = `http://127.0.0.1:5000/get_accuracy/${card_id}`;
    console.log("fetching from endpoint", endpoint)
    const response = await fetch(endpoint)
    if (!response.ok) {
        console.log("Issue, response = ",  response)
        throw new Error(`Http error!!!, `);
    }
    const data = await response.json();
    console.log(data.accuracy)
    return data.accuracy;
    // let accuracy_percentage = (100 * (state.numRight - state.numWrong) / state.numRight).toFixed(1)
}

export async function getTotalWpm(card_id) {
    const endpoint = `http://127.0.0.1:5000/get_wpm/${card_id}`;
    const response = await fetch(endpoint)
    if (!response.ok) {
        console.log("Issue, response = ",  response)
        throw new Error(`Http error!!!, `);
    }
    const data = await response.json();
    console.log(data)
    return data.wpm.toFixed(1)
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
            delete state.correctDict[state.curChar - 1] // Clear the previous correct status from dictionary
            return {
                ...state,
                correctDict: {
                    ...state.correctDict
                },
                curChar: Math.max(0, state.curChar - 1),
                lastWrong: false,
            };
        case "CORRECT":
            let new_state = {
                ...state,
                curChar: state.curChar + 1,
                lastWrong: false,
                correctDict: {
                    ...state.correctDict,
                    [state.curChar]: 1,
                },
                numRight: state.numRight + 1
            }
            if (state.curChar === 0) {
                new_state = {
                    ...new_state,
                    startTime: Date.now()
                }
            }
            return new_state;
        case "WRONG":
            let wrong_state = state
            if (!state.lastWrong) { // this is the first wrong
                wrong_state = {
                    ...state,
                    curChar: state.curChar + 1,
                    lastWrong: true,
                    numWrong: state.numWrong + 1
                };
            } else {
                wrong_state = {
                    ...state,
                    lastWrong: true
                };
            }
            if (state.curChar === 0) {
                wrong_state = {
                    ...wrong_state,
                    startTime: Date.now()
                }
            }
            return wrong_state
        case "DONE":
            console.log("DONE")
            return {
                ...state,
                status: "FINISHED", // This is what triggers the end title card screen
                endTime: Date.now()
            }
        case "RESTART":
            return {
                ...state,
                curChar: 0,
                lastWrong: false,
                correctDict: {},
                numRight: 0,
                numWrong: 0,
                startTime: Date.now(),
                status: "Typing",
                endTime: Date.now()
            }
        default:
        return state;
    }
}

function get_wpm(state: State) {
    let seconds = (state.endTime - state.startTime) / 1000
    let mins = seconds / 60
    let wpm = ((state.numRight + state.numWrong) / 5) / mins // The div by 5-characters comes from arbitrary wpm standard calculations
    return wpm.toFixed(1)
}
function get_accuracy(state: State) {
    let accuracy_percentage = (100 * (state.numRight - state.numWrong) / state.numRight).toFixed(0)
    return accuracy_percentage
}
export function Card({text, title, id, backToMain}: CardProps) {
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const [allTimeWpm, setAllTimeWpm] = useState<number>(9999999)
    const [allTimeAccuracy, setAllTimeAccuracy] = useState<number>(9999999)
    const [soundCorrect] = useSound('/sounds/keyboard.wav', {
        volume:.50,
        sprite: {
            click: [800, 900]
        }
    })
    const [soundWrong] = useSound('/sounds/wrong.wav', {
        volume:.30,
    })

    const [state, dispatch] = useReducer(reducer, {
        curChar: 0,
        lastWrong: false,
        correctDict: {},
        numRight: 0,
        numWrong: 0,
        startTime: Date.now(),
        textLength: text.length,
        status: "Typing",
        endTime: Date.now()
    });
    useEffect(() => {
        console.log("Ran a useeEffect!")
        setAudioUnlocked(true);
    }, [])
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
                    soundCorrect({id: 'click'});
                    dispatch({ type: "CORRECT" });
                }
            } 
            else {
                soundWrong()
                if (state.curChar >= (text.length - 1) && (!state.lastWrong)) {
                    dispatch({type: "DONE"})
                }
                dispatch({ type: "WRONG" });
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler); // Cleanup to remove old handler before the next one comes
    }, [state.curChar]);

    useEffect(() => {
        if (state.status !== "FINISHED") {
            return;
        }
        if ((id === null) || (id === undefined)) {
            return
        }
        // getTotalAccuracy(id) // hardcoded card_id as 0
        updateTotalStats(id, state.numRight, state.numWrong, (state.endTime - state.startTime)).then(() => {
            getTotalWpm(id).then(wppm=> setAllTimeWpm(wppm)).catch((err)=> console.error(err))
            getTotalAccuracy(id).then(acc=> setAllTimeAccuracy(acc)).catch((err)=> console.error(err))
            // get_wpm_and_accuracy_plot(id)
        })
    }, [state.status, id])


    if (state.status === "FINISHED") {
        let wpm = get_wpm(state)
        let accuracy_percentage = get_accuracy(state)
        return  (
        <div className={styles.typing_screen}>
            <div className={styles.finish_display_stats_card}>
                <p>DONE WITH TYPING TEST!!</p>
                <p>WPM: {wpm}</p>
                <p>Accuracy: {accuracy_percentage}%</p>
                {/* {saveStatsInDatabase} */}
                <button className={styles.retry_button} 
                    onClick={() => {console.log("button pressed!!!!")
                        dispatch({ type: "RESTART" });
                    }}>
                Retry Lesson
                </button> 
                <div>
                </div>
                <button className={styles.retry_button}
                onClick={() => {
                    backToMain(null)
                }}>
                    Back to Main Menu
                </button>
                <div className={styles.all_time_stats_card}>
                    ----------All time stats----------
                    <p style={{color:"#ff4757"}}>WPM: {allTimeWpm}</p>
                    <p style={{color: '#2e86de'}}>Accuracy: {100* allTimeAccuracy} %</p>
                    {/* <p>Accuracy: {allTimeAccuracy} %</p> */}
                    <Wpmchart
                        id={id}
                    >
                    </Wpmchart>
                </div>
            </div>
        </div>
        )
    } else {
        return (
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