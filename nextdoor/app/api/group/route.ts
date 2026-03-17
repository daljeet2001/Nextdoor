

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req:Request){
    
    try{

    const session = await auth();
    if(!session?.user?.id || !session?.user?.neighborhoodId){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }


    const groups = await prisma.group.findMany({
        where:{
            neighborhoodId:session?.user?.neighborhoodId
        },
        include:{
            members:true
        }
    })


    return NextResponse.json(groups)

    }catch(e){
        return NextResponse.json({message:"Something went wrong"},{status:500})
    }
}

export async function POST(req:Request){


    try{

        const session = await auth();
        if(!session?.user?.id || !session?.user?.neighborhoodId){
            return NextResponse.json({
                message:"Unauthorized"
            },{
                status:401
            })
        }

        const body =  await req.json()

        const { name } = body;

        if(!name){
            return NextResponse.json({
                message:"Missing required fields"
            },{status:400})
        }


        const group = await prisma.group.create({
            data:{
                name:name,
                ownerId:session?.user?.id,
                neighborhoodId:session?.user?.neighborhoodId

            }
        })

        return NextResponse.json({
            success:true,
            group
        },{
            status:201
        })




    }catch(e){
        console.log("Error creating group",e);
        return NextResponse.json({
            message:"Something went wrong"
        },{
            status:500
        })
    }
}