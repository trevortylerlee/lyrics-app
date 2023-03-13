import { useEffect, useState } from "react"
import styles from '@/styles/Game.module.css'

export default function Option({label, onClick, questionOver, correctTrack}) {

  return (
    <button onClick={onClick} className={
      questionOver && label === correctTrack ? `${styles.correct}` : `${styles.incorrect}`
    } disabled={
      questionOver && label !== correctTrack ? true : false
    }>
      {label}
    </button>
  )
}