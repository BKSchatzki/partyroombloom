/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "PRB_Users" (
    "id" SERIAL NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,

    CONSTRAINT "PRB_Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRB_Sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PRB_Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PRB_Users_googleId_key" ON "PRB_Users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "PRB_Users_email_key" ON "PRB_Users"("email");

-- AddForeignKey
ALTER TABLE "PRB_Sessions" ADD CONSTRAINT "PRB_Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PRB_Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
