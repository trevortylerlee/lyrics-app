// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const { albumId } = req.query
  try {
    const result = await fetch(`https://api.musixmatch.com/ws/1.1/album.tracks.get?album_id=${albumId}&page=1&page_size=100&apikey=5eec425df110df586f2bde141ca9c42f`)
      .then(res => res.json())
    res.status(200).send(result)
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
