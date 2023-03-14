import React from "react"
import styles from '@/styles/Home.module.css'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import useSWR from 'swr'

import ArtistCard from "@/components/ArtistCard"

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [artist, setArtist] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [search, setSearch] = useState('')

  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR('/api/staticdata', fetcher);

  // useEffect(() => {

  //   if (search) {
  //     searchArtists(search)
  //   }

  // }, [search])

  async function searchArtists(search) {
    setIsLoading(true)
    const response = await fetch(`/api/searchArtists?q=${search}`)
    const data = await response.json()
    console.log(data.result.message.body.artist_list)
    console.log(data)
    setSearchResults(data.result.message.body.artist_list)
    setIsLoading(false)
  }

  function handleClick(artist_id) {
    router.push(`/${artist_id}`)
  }

  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;

  // console.log('Data', data)

  return (
    <>
      <main className={styles.main}>

        <h1 className={styles.heroCopy}>Find your favorite artist and test your music knowledge!</h1>

        <SearchBar
          search={search}
          setSearch={setSearch}
          searchArtists={searchArtists}
        />

        {isLoading && <div className="loader"></div>}

        <div className={styles.searchResults}>
          {searchResults.map((artist, index) => {
            const { artist_name, artist_id } = artist.artist

            console.log(artist_name, artist_id)
            console.log(artist.artist)

            return (
              <div key={artist_id} style={{'--_delay': index}} className={styles.searchResult}>
                <Link href={`/${artist_id}`} key={artist_id}>{artist_name}</Link>
              </div>
            )
          }
          )}
        </div>

        <hr />

        <h2 className={styles.secondaryCopy}>... or choose from these best-selling artists!</h2>
        
        <div className={styles.bestSellers}>
        {data && data.map((artist, index) => {
          const { name, id } = artist

          return (
            <div key={id} style={{'--_delay': index}} className={styles.artistWrapper}>
              <ArtistCard artist={name} id={id} />
            </div>
          )
        }
        )}
        </div>

      </main>
    </>
  )
}

function SearchBar({search, setSearch, searchArtists}) {
  const [input,setInput] = useState('')

  return (
    <div className={styles.searchbar}>
    <form>
      <input className={styles.input} type="text" required placeholder="Example: Taylor Swift" onChange={e => {
        const nextInput = e.target.value
        setInput(nextInput)
      }}/>
      <div>
      <button type="submit" onClick={e => {
        e.preventDefault()
        const nextSearch = input
        console.log(nextSearch)
        setSearch(nextSearch)
        searchArtists(nextSearch)
      }}>Search</button>
      </div>
      </form>
    </div>
  )
}
