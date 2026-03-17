



import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function POST(req:Request){


    try{

        const session = await auth();
        if(!session?.user?.id){
            return NextResponse.json({message:"Unauthorized"},{status:401})
        }


        const { listingId } = await req.json();

        if(!listingId){
            return NextResponse.json({
                message:"Listing ID is required"
            },{
                status:400
            })
        }


        const listing = await prisma.listing.findUnique({
            where:{
                id:listingId
            },
            select:{
                id:true
            }
        })


        if(!listing){
            return NextResponse.json({
                message:"Listing not"
            },{
                status:404
            })
        }




        const hide = await prisma.hiddenListing.upsert({
            where:{
                userId_listingId:{
                    userId:session?.user?.id,
                    listingId
                }
            },
            update:{},
            create:{
                userId:session?.user?.id,
                listingId
            }
        })

        return NextResponse.json({message:"Listing hidden successfully"},{status:200})

    }catch(e:any){
        console.log("Error hiding event",e);

        if(e.code === "P2002"){
            return NextResponse.json({message:"Listing already hidden"},{status:200})
        }
        return NextResponse.json({message:"Something went wrong"},{status:500})
    }
}