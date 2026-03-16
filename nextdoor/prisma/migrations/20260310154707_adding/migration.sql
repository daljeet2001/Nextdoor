/*
  Warnings:

  - You are about to drop the column `photo` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "photo";

-- CreateTable
CREATE TABLE "public"."PostImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PostImage" ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
