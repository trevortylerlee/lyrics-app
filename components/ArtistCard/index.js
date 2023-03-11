import Link from "next/link"
import styles from '../ArtistCard/ArtistCard.module.css'

export default function ArtistCard({ artist, id }) {
  return (
    <Link href={`/${id}`}>
    <div className={styles.wrapper}>
      <img className={styles.pfp} src="https://placekitten.com/100/100" />
      {artist}
    </div>
    </Link>
  )
}