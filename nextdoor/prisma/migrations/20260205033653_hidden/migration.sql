-- CreateTable
CREATE TABLE "public"."HiddenEvents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HiddenEvents_eventId_userId_key" ON "public"."HiddenEvents"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "public"."HiddenEvents" ADD CONSTRAINT "HiddenEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HiddenEvents" ADD CONSTRAINT "HiddenEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
