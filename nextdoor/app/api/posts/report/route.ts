import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma'



export async function POST(req:Request){

    const session = await auth()
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status:401
        })
    }

    const { postId } = await req.json()


    await prisma.report.upsert({
        where:{
            postId_userId:{
                  postId:postId,
             userId:session?.user?.id
            }
   
        },
        update:{},
        create:{
            userId:session?.user?.id,
            postId
        }
    })

    return NextResponse.json({success:true})
}