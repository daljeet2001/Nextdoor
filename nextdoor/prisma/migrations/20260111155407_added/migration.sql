-- CreateTable
CREATE TABLE "public"."HiddenPosts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "HiddenPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HiddenPosts_postId_userId_key" ON "public"."HiddenPosts"("postId", "userId");

-- AddForeignKey
ALTER TABLE "public"."HiddenPosts" ADD CONSTRAINT "HiddenPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HiddenPosts" ADD CONSTRAINT "HiddenPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
