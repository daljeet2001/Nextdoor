import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export async function PUT(req:Request){

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },
    {
        status:401
    })
    }


    const {postId} = await req.json()

    const post = await prisma.post.findUnique({
        where:{
            id:postId
        },
        include:{
            user:{
                select:{
                    id:true
                }
            },
            
        }
    })

    console.log("post before toggle commnetsOff",post)

    if(!post){
        return NextResponse.json({
            message:"Post not found"
        },{
            status:404
        })
    }

    //ownership check
    if(post.user.id !== session?.user?.id){
        return NextResponse.json({
            message:'Forbidden'
        },{
            status:403
        })
    }

    const updated = await prisma.post.update({
        where:{
            id:postId
        },
        data:{
            commentsClosed:!post.commentsClosed
        }
    })

    return NextResponse.json(updated)


}