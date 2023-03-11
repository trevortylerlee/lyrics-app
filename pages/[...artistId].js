import styles from '@/styles/Home.module.css'
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function Game() {
  const router = useRouter()
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [trackIds, setTrackIds] = useState([])
  const [toggleNextAlbum, setToggleNextAlbum] = useState(false)

  const [correctTrack, setCorrectTrack] = useState('')
  const [choice1, setChoice1] = useState('')
  const [choice2, setChoice2] = useState('')
  const [choice3, setChoice3] = useState('')
  const [choice4, setChoice4] = useState('')

  const { artistId } = router.query

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

      // for (let i = 0; i < arr.length; i++) {
      //   // eslint-disable-next-line no-console
      //   console.log(songs[arr[i]].track.track_name)
      //   // eslint-disable-next-line no-console
      //   console.log(songs[arr[i]].track.track_id)
      // }
    }
  }, [songs])

  async function getAlbums(artistId, page) {
    const response = await fetch(`/api/getAlbums?artistId=${artistId}&page=${page}`)
    const data = await response.json()
    const albums = data.result.message.body.album_list
    console.log('data:', data)
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

    if (page1.length >= 99) {
      const page2 = await getAlbums(artistId, 2)

      if (page2) {
        for (let i = 0; i < page2.length; i++) {
          const albumRating = page2[i].album.album_rating
          if (albumRating > 90) {
            mainAlbums.push(page2[i])
          }
        }
      }
    }

    console.log(mainAlbums)
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

  function handleClick(e) {
    console.log('clicked', e.target.innerHTML)
    console.log(correctTrack)

    if (e.target.innerHTML === correctTrack.track.track_name) {
      console.log('correct')
    } else {
      console.log('incorrect')
    }
  }

  return (
    <>
      <main className={styles.main}>
        {choice1 !== '' && <button onClick={(e) => {handleClick(e)}}>{choice1.track.track_name}</button>}
        {choice2 !== '' && <button onClick={(e) => {handleClick(e)}}>{choice2.track.track_name}</button>}
        {choice3 !== '' && <button onClick={(e) => {handleClick(e)}}>{choice3.track.track_name}</button>}
        {choice4 !== '' && <button onClick={(e) => {handleClick(e)}}>{choice4.track.track_name}</button>}
      </main>
    </>
  )
}