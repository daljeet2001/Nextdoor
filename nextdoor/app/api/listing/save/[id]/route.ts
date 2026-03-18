import { NextResponse } from 'next/server';
import { auth} from "@/lib/auth";
import { prisma } from "@/lib/prisma";




export async function POST(req:Request ,context:any){

    try{

         const { id:listingId } =  await context.params;

    if(!listingId){
        return NextResponse.json({
            message:"Listing ID is required"
        },{
            status:400
        })
    }

    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status: 401
        })
    }


    const saved = await prisma.savedListing.create({
        data:{
            userId:session?.user?.id,
            listingId
        }
    })

    return NextResponse.json({success:true,saved},{status:201})

    }catch(e:any){

        if(e.code=== "P2002"){
            return NextResponse.json({message:"Listing already saved"},{
                status:409
            })
        }

        return NextResponse.json({message:"Something went wrong"},{status:500})

    }


}