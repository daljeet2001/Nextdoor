import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(req:Request){

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status:401
        })
    }

    const listings = await prisma.savedListing.findMany({
        where:{
            userId:session?.user?.id

        },
        include:{
            listing:{
                include:{
                    user:true,
                    savedBy:true,
                    images:true
                }
            }
        },
   
    })

    console.log("listings saved api",listings)

    return NextResponse.json(listings)
}