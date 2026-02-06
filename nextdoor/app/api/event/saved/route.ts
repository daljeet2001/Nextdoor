

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";


export async function GET(req:Request){


    try{
        const session = await getServerSession(authOptions);
        if(!session?.user?.id){
            return NextResponse.json({
                error:"Unauthorized"
            },{status:401})
        }

        const savedEvents = await prisma.savedEvents.findMany({
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



        return NextResponse.json({savedEvents})

    }catch(e){
        console.log("Error fetching events",e)
        return NextResponse.json({message:"Something went wrong"},{status:500})
    }
}