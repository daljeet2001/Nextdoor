

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";



export async function GET(req:Request, {params}:{params:{id:string}}){
    try{

        // const session = await getServerSession(authOptions);
        // if(!session?.user?.id){
        //     return NextResponse.json({message:"Unauthorized"},{status:401})
        // }


        const groupId = params.id;

        if(!groupId){
            return NextResponse.json({message:"ID is required"},{status:400})
        }


        const group = await prisma.group.findUnique({
            where:{
                id:groupId
            },
            include:{
                owner:true,
                posts:true,
                members:true
            }
        })

        if(!group){
            return NextResponse.json({message:"Group not found"},{status:404})
        }

        return NextResponse.json(group);

    }catch(e){
        return NextResponse.json({messsage:"Something went wrong"},{status:500})
    }
}