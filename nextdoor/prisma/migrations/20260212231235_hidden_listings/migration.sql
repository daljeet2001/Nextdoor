-- CreateTable
CREATE TABLE "public"."HiddenListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "HiddenListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HiddenListing_userId_listingId_key" ON "public"."HiddenListing"("userId", "listingId");

-- AddForeignKey
ALTER TABLE "public"."HiddenListing" ADD CONSTRAINT "HiddenListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HiddenListing" ADD CONSTRAINT "HiddenListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
