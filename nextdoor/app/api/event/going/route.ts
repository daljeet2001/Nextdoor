import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET(req:Request){

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({
            error:"Unauthorized"
        },{
            status:401
        })
    }

    const goingEvents = await prisma.going.findMany({
        where:{
            userId:session?.user?.id
        },
        include:{
            event:{
                include:{
                                        savedEvents:true

                }
            }
        }
    })
    // console.log("Going events in the GET going api",goingEvents);

    return NextResponse.json(goingEvents)
}