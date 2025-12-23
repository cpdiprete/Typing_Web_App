"use client";
import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             Edit the page.tsx file to edit this screen or some shit man idk. 
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
import { useState, useEffect } from 'react'
import { Card } from "./components/Card";
// import { Lesson } from "./components/Lesson";
import styles from "./components/Lesson.module.css";

const lesson1text = "Lorem Ipsum only five centuries"
const lesson2text = "Calvins Lesson 2 text"
const lesson3text = "Lorem Ipsum has been the industry's"
const lesson4text = "standard dummy text ever since the 1500s"

type LessonsDict = {
  [key: number]: [title: string, text: string]
}

const lessonsDict: LessonsDict = {
  0: ["lesson 1", lesson1text], 
  1: ["lesson 2", lesson2text],
  2: ["lesson 3", lesson3text],
  3: ["lesson 4", lesson4text],

}
// const hardcoded = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"

export default function Root()  {
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
      </div>
    );
  }
}
