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
        // new flexbox with row stacking instead of column stacking
    <div className={styles.problemKeyFullPage}>
        <h1 className={styles.pageTitle}>PROBLEM KEYS</h1>
        <div className={styles.problemKeyContainer}>
            <div className={styles.titleRow}>
                <h1 className={styles.problemKeyCharacter}>char</h1> 
                <h1 className={styles.accuracy_text}>accuracy</h1>
            </div> 
            
                {problemKey?.map(([character, accuracy], index) => (
                <div key={index} className={styles.problemKeyCard}>
                    <h1 className={styles.problemKeyCharacter}> {index + 1}{")"} {character} </h1> 
                    <h1 className={styles.accuracy_text}> {accuracy}% </h1>
                    </div>
            ))}
        </div>
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