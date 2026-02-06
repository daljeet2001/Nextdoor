-- CreateTable
CREATE TABLE "public"."SavedEvents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "SavedEvents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedEvents_userId_eventId_key" ON "public"."SavedEvents"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "public"."SavedEvents" ADD CONSTRAINT "SavedEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedEvents" ADD CONSTRAINT "SavedEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
