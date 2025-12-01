/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uniqueId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uniqueId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "uniqueId" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "uniqueId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uniqueId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_uniqueId_key" ON "Message"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_uniqueId_key" ON "Post"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueId_key" ON "User"("uniqueId");
