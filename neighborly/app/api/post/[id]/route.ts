import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    //   if(!session?.user?.id){
    //     return NextResponse.json({
    //       error:"Unauthorized"
    //     },{status:401})
    //   }
    const postId = params.id
    if (!postId) {
        return NextResponse.json({ message: "Post ID is required" }, { status: 400 })
    }

    const posts = await prisma.post.findUnique({
        where: {
            id: postId
        },

        include: {
            user: true,
        },
    });
    return NextResponse.json(posts);
}