import { NextResponse } from 'next/server';
import { authOptions} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';



export async function POST(req:Request ,{params}:{params:Promise<{id:string}>}){

    try{

         const {id:listingId} = await params;

         console.log("id in unsave listing",listingId)

    if(!listingId){
        return NextResponse.json({
            message:"Listing ID is required"
        },{
            status:400
        })
    }

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status: 401
        })
    }



const unsave = await prisma.savedListing.delete({
    where:{
        userId_listingId:{
        userId:session?.user?.id,
        listingId  
    }}
})

    return NextResponse.json({success:true,unsave},{status:200})

    }catch(e:any){

        console.log("error in insave listing",e)

        if(e.code=== "P2002"){
            return NextResponse.json({message:"Listing already unsaved"},{
                status:409
            })
        }

        return NextResponse.json({message:"Something went wrong"},{status:500})

    }
}