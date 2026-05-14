"use client";
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Link from 'next/link'
import { NavBar } from '@/app/page'
import { getTopXProblemKeys } from '@/app/lib/appCRUDfunctions';
import styles from "./problemKey.module.css";

export async function blahh(setter) {
    const pk = await getTopXProblemKeys(5)
    setter(pk)
}
export function ProblemKeyContainer({problemKey}) {
    return ( 
        <div className={styles.problemKeyContainer}>
                {problemKey?.map(([character, accuracy], index) => (
                <div key={index}>char: {character} | accuracy: {accuracy}% </div>
            ))}
        </div>
    )
}
export default function ProblemKeyPage() {
    const [problemKeys, setProblemKeys] = useState<Array<any>>()
    useEffect(() => {
        blahh(setProblemKeys)
    }, [])
    return (
    <div>
        <NavBar/>
        <button className="item"
            onClick={() => {
                blahh(setProblemKeys)
            }}
        >
        Show problem Keys
        </button>
        <div>
            <ProblemKeyContainer
                problemKey={problemKeys}
            />
        </div>
    <div>
    </div>
    </div>
    )
}