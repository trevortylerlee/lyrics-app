// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const { q } = req.query
  try {
    const result = await fetch(`https://api.musixmatch.com/ws/1.1/artist.search?q_artist=${q}&page_size=10&apikey=5eec425df110df586f2bde141ca9c42f`)
      .then(res => res.json())
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
