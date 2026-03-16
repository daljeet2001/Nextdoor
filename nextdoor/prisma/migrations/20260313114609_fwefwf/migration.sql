/*
  Warnings:

  - You are about to drop the column `image` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "public"."ListingImage" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ListingImage" ADD CONSTRAINT "ListingImage_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
