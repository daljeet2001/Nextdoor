import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function POST(req:Request){

    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const { eventId }=  await req.json()

    await prisma.reportEvent.upsert({
        where:{
            eventId_userId:{
                eventId,
                userId:session?.user?.id

            }
        },
        update:{},
        create:{
            userId:session?.user?.id,
            eventId
        }
    })

    return NextResponse.json({success:true})

}