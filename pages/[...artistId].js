import styles from '@/styles/Game.module.css'
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"

import Option from "@/components/Option"

export default function Game() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [trackIds, setTrackIds] = useState([])
  const [toggleNextAlbum, setToggleNextAlbum] = useState(false)

  const [correctTrack, setCorrectTrack] = useState('')
  const [choice1, setChoice1] = useState('')
  const [choice2, setChoice2] = useState('')
  const [choice3, setChoice3] = useState('')
  const [choice4, setChoice4] = useState('')

  const [isClicked1, setIsClicked1] = useState(false)
  const [isClicked2, setIsClicked2] = useState(false)
  const [isClicked3, setIsClicked3] = useState(false)
  const [isClicked4, setIsClicked4] = useState(false)

  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [line3, setLine3] = useState('')

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [linesRevealed, setLinesRevealed] = useState(0)
  const [questionOver, setQuestionOver] = useState(false)

  const { artistId } = router.query
  console.log(artistId)
  const artistName = router.query.name
  console.log(artistName)

  // Get albums
  useEffect(() => {
    // get the album discography for the artist
    // select random album
    // select random song
    // get random song lyrics

    if (artistId) {
      getAllAlbums()
    }

  }, [router.query.artistId])

  useEffect(() => {
    // Get a random album id

    if (albums.length > 0) {
      const randomNum = Math.floor(Math.random() * albums.length)
      const randomAlbum = albums[randomNum]
      const albumId = randomAlbum
      getSongs(albumId.album.album_id)
    }

  }, [albums, toggleNextAlbum])

  useEffect(() => {
    // Get 4 random song ids from the album

    let arr = [];
    if (songs.length > 0) {
      while (arr.length < 4) {
        let r = Math.floor(Math.random() * songs.length);
        if (arr.indexOf(r) === -1) arr.push(r);
      }
      console.log(arr);
      // setTrackIds(arr)
      setChoice1(songs[arr[0]])
      setChoice2(songs[arr[1]])
      setChoice3(songs[arr[2]])
      setChoice4(songs[arr[3]])

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const correctNum = getRandomInt(0, 3)
      setCorrectTrack(songs[arr[correctNum]])
    }
  }, [songs])

  useEffect(() => {
    // Get lyrics for the random song

    if (correctTrack !== '') {
      getLyrics(correctTrack.track.track_id)
    }

  }, [correctTrack])

  async function getAlbums(artistId, page) {
    const response = await fetch(`/api/getAlbums?artistId=${artistId}&page=${page}`)
    const data = await response.json()
    const albums = data.result.message.body.album_list
    // console.log('data:', data)
    return albums
  }

  async function getAllAlbums() {
    const mainAlbums = []

    const page1 = await getAlbums(artistId, 1)

    if (page1) {
      for (let i = 0; i < page1.length; i++) {
        const albumRating = page1[i].album.album_rating
        if (albumRating > 90) {
          mainAlbums.push(page1[i])
        }
      }
    }

    // if (page1.length >= 99) {
    //   const page2 = await getAlbums(artistId, 2)

    //   if (page2) {
    //     for (let i = 0; i < page2.length; i++) {
    //       const albumRating = page2[i].album.album_rating
    //       if (albumRating > 90) {
    //         mainAlbums.push(page2[i])
    //       }
    //     }
    //   }
    // }

    // console.log(mainAlbums)
    setAlbums(mainAlbums)
  }

  async function getSongs(albumId) {
    const response = await fetch(`/api/getSongs?albumId=${albumId}`)
    const data = await response.json()
    // console.log(data.message.body.track_list)
    // console.log(data.message.body.track_list.length)

    if (data.message.body.track_list.length >= 4) {
      setSongs(data.message.body.track_list)
      // console.log('set songs')
    } else {
      setToggleNextAlbum(!toggleNextAlbum)
      // console.log('getting next album')
    }
  }

  async function getLyrics(trackId) {
    const response = await fetch(`/api/getLyrics?trackId=${trackId}`)
    const data = await response.json()
    const lyrics = data.message.body.lyrics.lyrics_body
    const lyricsArr = lyrics.split('\n')
    // console.log('This is the lyrics array', lyricsArr)

    setLine1(lyricsArr[0])
    setLine2(lyricsArr[1])
    setLine3(lyricsArr[2])

    setIsLoading(false)
  }

  function handleClick(e) {
    console.log('clicked', e.target.innerHTML)
    console.log(correctTrack.track.track_name)

    if (e.target.innerHTML === correctTrack.track.track_name) {
      console.log('correct')
      // e.target.innerHTML = e.target.innerHTML + ' ✔'
      // e.target.classList.add(`${styles.correct}`)
      setScore(score => score + (3 - linesRevealed))
      setQuestionOver(true)
    } else {
      console.log('incorrect')
      // e.target.innerHTML = e.target.innerHTML + ' ✘'
      // e.target.classList.add(`${styles.incorrect}`)
      setLives(lives => lives - 1)
      setQuestionOver(true)
    }
  }

  function nextLine() {
    setLinesRevealed(linesRevealed => linesRevealed + 1 )
  }

  function nextQuestion() {
    setLinesRevealed(0)
    setQuestionOver(false)
    setToggleNextAlbum(!toggleNextAlbum)
    setIsLoading(true)
  }

  async function handleSubmit({artistId, score}) {
    const { data } = await axios.post('/api/submit', {
      artistId,
      artistName,
      score
    })
    console.log(data)
    return data
  }

  function endGame() {
    let highScore = localStorage.getItem(`${artistId}`)

    if (highScore === null || highScore === undefined) {
      localStorage.setItem(`${artistId}`, score)
      return (handleSubmit({artistId, score}))
    } else if (score > highScore) {
      localStorage.setItem(`${artistId}`, score)
      return (handleSubmit({artistId, score}))
    } else if (score < highScore) {
      console.log('Your score was not high enough to beat the high score.')
    } else {
      console.log('Your score was the same as your previous high score.')
    }
  }

  if (lives < 1) {
    console.log('Yo yo yo the game is over.')
    endGame()

    return (
      <>
        <h1>Game Over</h1>
        <p>You scored {score} points for {artistName}</p>
      </>
    )
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.topBar}>
          <p>{score} points</p>
          <div className={styles.circleWrapper}>
            {lives === 3 && <div className={styles.circle}></div>}
            {lives >= 2 && <div className={styles.circle}></div>}
            {lives >= 1 && <div className={styles.circle}></div>}
          </div>
        </div>

        {!questionOver && <button className={styles.next} onClick={nextLine}>Reveal line</button>}
        {questionOver && <button className={styles.nextQuestion} onClick={nextQuestion}>Next question ➔</button>}

        { isLoading ? <div className={styles.loader}></div> :
        <>
        <div>
          <ul className={styles.lyrics}>
            {line1 !== '' && <li className={styles.visible}>1: {line1}</li>}
            {line2 !== '' && <li className={linesRevealed >= 1 ? `${styles.visible}` : `${styles.hidden}`}>2: {line2}</li>}
            {line3 !== '' && <li className={linesRevealed >= 2 ? `${styles.visible}` : `${styles.hidden}`}>3: {line3}</li>}
          </ul>
        </div>
        <div className={styles.buttonWrapper}>

          {choice1 !== '' &&
            <Option
              label={choice1.track.track_name}
              onClick={handleClick}
              questionOver={questionOver}
              correctTrack={correctTrack.track.track_name}
            />  
          }
          {choice2 !== '' &&
            <Option
              label={choice2.track.track_name}
              onClick={handleClick}
              questionOver={questionOver}
              correctTrack={correctTrack.track.track_name}

            />  
          }
          {choice3 !== '' &&
            <Option
              label={choice3.track.track_name}
              onClick={handleClick}
              questionOver={questionOver}
              correctTrack={correctTrack.track.track_name}

            />  
          }
          {choice4 !== '' &&
            <Option
              label={choice4.track.track_name}
              onClick={handleClick}
              questionOver={questionOver}
              correctTrack={correctTrack.track.track_name}
            />  
          }
        </div>
        </>}
      </main>
    </>
  )
}