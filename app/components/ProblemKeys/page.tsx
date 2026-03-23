"use client";
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Link from 'next/link'
import { NavBar } from '@/app/page'
import { getProblemKeys } from '@/app/lib/appCRUDfunctions';
import styles from "./problemKey.module.css";

export async function blahh(setter) {
    const pk = await getProblemKeys()
    setter(pk)
    // setter()
}
// export function problemKeysGraphic(problemKeys: <Array<any>>) {

// }
export function ProblemKeyContainer({problemKey}) {
    return ( 
        <div>
            YEAHHHH-------------------
                {problemKey?.slice(0, 5).map(([character, accuracy], index) => (
                
                <div key={index}>char: {character} | accuracy: {accuracy}% </div>
            ))}
        </div>
    )
}

export default function ProblemKeyPage() {
    const [problemKeys, setProblemKeys] = useState<Array<any>>()
    return (
        

    <div>
        <NavBar/>
        <h1>Here are your problem keys</h1>
        <button className="item"
        onClick={() => {
            blahh(setProblemKeys)
        }}
        >
        Init Database
        </button>
        <div>
            
            <ProblemKeyContainer
                problemKey={problemKeys}
            />
            {/* {problemKeys?.slice(0, 5).map(([character, accuracy], index) => (
                
                <div key={index}>char: {character} | accuracy: {accuracy}% </div>
            ))} */}
            
        </div>
    <div>
    </div>
    </div>
    )
}