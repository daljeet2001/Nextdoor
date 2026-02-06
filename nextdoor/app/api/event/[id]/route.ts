

import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"


export async function GET(req:Request,{params}:{params:{id:string}}){
    const eventId = params.id

    if(!eventId){
        return NextResponse.json({message:"Event ID is required"},{status:400})
    }

    const event = await prisma.event.findUnique({
        where:{
            id:eventId
        },
        include:{
            user:true,
            savedEvents:true,
            going:true
        }
    })
    if(!event){
        return NextResponse.json({message:"Event not found"},{status:404})
    }
    console.log("event in route /page.:id",event)

    const formatedEvent = {
                 id: event?.id,
            name: event?.name,
            address: event?.location,
            description: event?.description,
            image: event?.coverImage,
            startTime: event?.startDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            endTime: event?.endDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            startDate: event?.startDateTime.toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
               endDate: event?.endDateTime.toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
            user:event.user,
            createdAt:event.createdAt,
            savedEvents:event.savedEvents,
            going:event.going

    }

    return NextResponse.json(formatedEvent)

   
}

export async function DELETE(req:Request,{params}:{params:{id:string}}){

    try{


        const eventId = params.id;
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    if(!eventId){
        return NextResponse.json({
            message:"Event ID is required"
        },{status:404})
    }

    const event = await prisma.event.findUnique({
        where:{
            id:eventId
        },
        select:{
            userId:true
        }
    })

    if(!event){
        return NextResponse.json({
            message:"Event not found"
        },{
            status:404
        })
    }

    //ownership verification

    if(event.userId !== session?.user?.id){
        return NextResponse.json({
            message:"Forbidden"
        },{status:403})
    }


    const deleted = await prisma.event.delete({
        where:{
            id:eventId
        }
    })
    return NextResponse.json({success:true})
    }catch(e){
        console.log("Error deleting event");
        return NextResponse.json(
            {message:"Something went wrong"},
            {
            status:500
        })
    }
}


export async function PUT(req:Request,{params}:{params:{id:string}}){

    try{

         const eventId = params.id;
    const { eventName,eventCover,description,location,startDate,startTime,endDate,endTime} = await req.json() 
       //convert to date object
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`)

    if(!eventId){
        return NextResponse.json({
            message:"Event ID is required"
        },{
            status:404
        })
    }

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"},
            {
                status:401
            })
    }


    const event = await prisma.event.findUnique({
        where:{
            id:eventId
        },
        select:{
            userId:true
        }
    })

    if(!event){
        return NextResponse.json({
            message:"Event not found"
        },{
            status:404
        })
    }

    //ownership check
    if(event.userId !== session?.user?.id){
        return NextResponse.json({
            message:"Forbidden"
        },{
        status:403
        })
    }

    await prisma.event.update({
        where:{
            id:eventId
        },
        data:{
            name:eventName,
            coverImage:eventCover,
            location,
            description,
            startDateTime,
            endDateTime
        }
    })
return NextResponse.json({succes:true})

    }catch(e){
        console.log("Error editing event",e);
        return NextResponse.json({
            message:"Something went wrong"
        },{
            status:500
        })
    }
}