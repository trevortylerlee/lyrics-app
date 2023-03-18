-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "musixMatchId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "highScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);
