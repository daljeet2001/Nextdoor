-- CreateTable
CREATE TABLE "public"."MutedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mutedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MutedUser_userId_mutedId_key" ON "public"."MutedUser"("userId", "mutedId");

-- AddForeignKey
ALTER TABLE "public"."MutedUser" ADD CONSTRAINT "MutedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MutedUser" ADD CONSTRAINT "MutedUser_mutedId_fkey" FOREIGN KEY ("mutedId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
