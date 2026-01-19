-- CreateTable
CREATE TABLE "public"."Bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmarks_userId_postId_key" ON "public"."Bookmarks"("userId", "postId");

-- AddForeignKey
ALTER TABLE "public"."Bookmarks" ADD CONSTRAINT "Bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bookmarks" ADD CONSTRAINT "Bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
