
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(req:Request){

    const session = await auth()
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status:401
        })
    }

    const listings = await prisma.listing.findMany({
        where:{
            userId:session?.user?.id

        },
        include:{
            user:true,
            images:true
        },
        orderBy:{createdAt:'desc'}
    })

    return NextResponse.json(listings)
}