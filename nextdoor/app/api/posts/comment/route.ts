
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";

export  async function POST(req: Request) {

    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId, content } = await req.json()

    const comment = await prisma.comment.create({
        data: {
            postId,
            content,
            userId: session?.user.id

        },
        include:{
            user:{select:{name:true}},
            likes:true,
            replies:true
        }

    })

    return NextResponse.json(comment)
}