

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req:Request){
    
    try{

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }




    const groups = await prisma.group.findMany({
        where: {

            OR:[
                { ownerId:session?.user?.id},
                {members:{
                    some:{
                        id:session?.user?.id
                    }
                }}

            ]
           
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
