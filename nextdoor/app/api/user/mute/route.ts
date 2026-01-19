import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server" 


export async function POST(req:Request){


    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    const {mutedId} = await req.json()


    const muted = await prisma.mutedUser.upsert({
        where:{
            userId_mutedId:{
                userId:session?.user?.id,
                mutedId
            }
        },
        update:{},
        create:{
            userId:session?.user?.id,
            mutedId
        }
    })

    return NextResponse.json({muted:true})
}