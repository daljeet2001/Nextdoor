

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";



export async function POST(req:Request, context:any){


    try{

        const groupId = context.params.id
        const session = await auth();
        if(!session?.user?.id){
            return NextResponse.json({message:"Unauthorized"},{status:401})
        }

        if(!groupId){
     return NextResponse.json({message:"ID is required"},{status:400})
        }

        const { image } = await req.json();

        if(!image){
            return NextResponse.json({message:"Image is missing"},{status:400})
        }


        const group = await prisma.group.update({
            where:{
                id:groupId,
                ownerId:session?.user?.id
            },
            data:{
                image
            },
        })

        if(!group){
            return NextResponse.json({message:"Not authorized to update this group"},{status:403})
        }

        return NextResponse.json(group, {status:200})

    }catch(e){
        console.log("Error saving image",e);
        return NextResponse.json({message:"Something went wrong"},{status:500})
        
    }
}