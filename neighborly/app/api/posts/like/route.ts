import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth"



export async function POST(req: Request) {

  const session = await getServerSession(authOptions);
  const { postId } = await req.json();


  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await prisma.$transaction([
 prisma.postLike.create({
        data: {
          postId: postId,
          userId: session.user.id
        },
      }),
     prisma.post.update({
        where: {
          id: postId
        },
        data: {
          likesCount: { increment: 1 }
        }
      }),

    ]);

        const updatedPosts = await prisma.post.findUnique({
      where:{
        id:postId
      },
         
        include:{
          likes:{
            where:{
              userId:session.user.id
            }
          }
        }


    })
    // console.log("updatedpost is ",updatedPosts)
    if (!updatedPosts){
      return NextResponse.json({error:"No post found"}, {status:401})
    }

    return NextResponse.json(updatedPosts);

  } catch (err) {
    console.error("Error liking post", err);
    return NextResponse.json({ error: "Already liked" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { postId } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.$transaction([
      prisma.postLike.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id

          }

        }
      }),
      prisma.post.update({
        where: {
          id: postId
        }
        , data: {
          likesCount: { decrement: 1 }
        }

      })
    ])

    const updatedPosts = await prisma.post.findUnique({
      where:{
        id:postId
      }
    })
    if (!updatedPosts){
      return NextResponse.json({error:"No post found"}, {status:401})
    }

    return NextResponse.json(updatedPosts);
  } catch (err) {
    console.error("Error unliking post", err);
    return NextResponse.json({ error: "Already unliked" }, { status: 400 });
  }
}
