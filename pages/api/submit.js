import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'POST':
        const { artistId, artistName, score } = req.body
        console.log(artistId)
        console.log("Here is the score", score)

        let artistIdInt = parseInt(artistId)

        if (!artistIdInt) {
          return res.status(400).json({ message: 'Missing artistIdInt parameter' })
        }

        const existingArtist = await prisma.artist.findUnique({
          where: {
            musixMatchId: artistIdInt,
          },
        });

        if (existingArtist) {
          // If the entry exists, update the highscore
          const updatedArtist = await prisma.artist.update({
            where: {
              musixMatchId: artistIdInt,
            },
            data: {
              highScore: score,
            },
          });
          res.status(201).json(updatedArtist);
        } else {
          // If the entry doesn't exist, create a new Artist entry with the given ID and highscore
          const newArtist = await prisma.artist.create({
            data: {
              musixMatchId: artistIdInt,
              name: artistName,
              highScore: score,
            },
          });
          res.status(201).json(newArtist);
        }
        break
      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}