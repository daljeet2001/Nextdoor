

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export async function POST(req:Request,{params}:{params:{id:string}}){
    try{
            const eventId = params.id;
            if(!eventId){
                return NextResponse.json({
                    message:"Event ID is required"
                },{status:404})
            }

            const session = await getServerSession(authOptions);
            if(!session?.user?.id){
                return NextResponse.json({
                    error:"Unauthorized"
                },{
                    status:401
                })
            }

            const unsaved = await prisma.savedEvents.delete({
                where:{
                    userId_eventId:{
                    userId:session?.user?.id,
                    eventId:eventId,
                }
            }
            })
            const ungoing = await prisma.going.delete({
                where:{
                    userId_eventId:{
                        userId:session?.user?.id,
                        eventId
                    }
                }
            })
  
            return NextResponse.json({
                success:true,
                unsaved
            },{status:200})

    }catch(e:any){
console.log("Error",e)
        if(e.code === "P2002"){
            return NextResponse.json({
                message:"Event already unsaved"
            },{status:209})
        }
        return NextResponse.json({
            message:"Something went wrong"
        },{status:500})


    }


}

