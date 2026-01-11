

import{ NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function POST(req:Request){
    try{
        const session = await getServerSession(authOptions)

        if(!session?.user.id){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }

        const { postId, parentId, content } = await req.json()

        const reply = await prisma.comment.create({
            data:{
                userId:session?.user?.id,
                content,
                postId,
                parentId
            },
            include:{
                user:true,
                likes:true,
            }
        })
        return NextResponse.json(reply)
    }catch(error){
        return NextResponse.json({
            error:"Failed to reply"
        },{
            status:500
        })
    }
}