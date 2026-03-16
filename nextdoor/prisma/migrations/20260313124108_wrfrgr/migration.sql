/*
  Warnings:

  - You are about to drop the column `image` on the `ListingImage` table. All the data in the column will be lost.
  - Added the required column `url` to the `ListingImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ListingImage" DROP COLUMN "image",
ADD COLUMN     "url" TEXT NOT NULL;
