

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth} from "@/lib/auth";



export async function POST(req:Request){

    try{

        const session = await auth();
        if(!session?.user?.id){
            return NextResponse.json({
                message:"Unauthorized"
            },{
                status:401
            })
        }

        const { listingId }= await req.json();


        const report = await prisma.reportLising.upsert({
            where:{
                userId_listingId:{
                    userId:session?.user?.id,
                    listingId,
                }
            },
            update:{},
            create:{
                userId:session?.user?.id,
                listingId,
                reason:"abusive"
            }
        })

        return NextResponse.json({success:true})

    }catch(e){
        console.log("Error reporting listing",e);
        return NextResponse.json({
            message:"Something went wrong"
        },{
            status:500
        })
    }
}