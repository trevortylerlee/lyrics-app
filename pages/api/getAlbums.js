// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const { artistId, page } = req.query
  console.log(artistId, page)
  try {
    const result = await fetch(`https://api.musixmatch.com/ws/1.1/artist.albums.get?artist_id=${artistId}&s_release_date=asc&page=${page}&album_type=album&g_album_name=1&page_size=100&apikey=5eec425df110df586f2bde141ca9c42f`)
      .then(res => res.json())
    res.status(200).send({ result })
    console.log({result})
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
