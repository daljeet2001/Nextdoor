


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function POST(req:Request,context:any){

    try{
            const  { id:eventId }=   await context.params

    if(!eventId){
        return NextResponse.json({
            message:"Event ID is required"
        },{
            status:404
        })
    }
    const session = await auth()
    if(!session?.user?.id){
        return NextResponse.json({
            error:"Unauthorized"
        },{status:401})
    }

    const saved = await prisma.savedEvents.create({
        data:{
            userId:session?.user?.id,
            eventId
        }
    })

    return NextResponse.json({
        success:true,
        saved
    },{status:201})



    }catch(e:any){
        console.log("Error saving event",e);
        if(e.code === "P2002"){
            return NextResponse.json({
                message:"Event already saved"
            },{status:409})
        }
        return NextResponse.json({message:"Something went wrong"},{status:500})

    }

}
