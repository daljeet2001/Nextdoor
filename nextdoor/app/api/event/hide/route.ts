import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";




export async function POST(req:Request){

    try{
         const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status:401
        })
    }


    const {eventId } = await req.json();
    if(!eventId){
        return NextResponse.json({
            message:"Event ID is required"
        },{
            status:400
        })
    }


    const event = await prisma.event.findUnique({
        where:{
            id:eventId
        },
        select:{
            id:true
        }
    })

    if(!event){
        return NextResponse.json({
            message:"Event not found"
        },{
            status:404
        })
    }

    const hidden = await prisma.hiddenEvents.create({
        data:{
            userId:session?.user?.id,
            eventId
        }
    })

    return NextResponse.json({message:"Event hidden successfully"},{status:200})


    }catch(e:any){
        if(e.code === "P2002"){
            return NextResponse.json({message:"Event hidden already"},{status:200})
        }
        console.log("Error while hiding event",e);
        return NextResponse.json({message:"Something went wrong"},{status:500})
    }


}