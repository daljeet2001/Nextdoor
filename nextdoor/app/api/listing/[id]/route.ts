

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";



export async function GET(req:Request,context:any){

    const listingId = context.params.id;

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
        include:{
            user:true,
            savedBy:true,
            images:true
        }
    })

    if(!listing){
        return NextResponse.json(
            {message:"Lisitng not found"},
        {status:404}
    )
    }

    return NextResponse.json(listing)
}

export async function PUT(req:Request,context:any){

    try{

        const session = await auth();
        if(!session?.user?.id){
            return NextResponse.json({
                message:"Unauthorized"
            },{
                status:401
            })
        }


        const listingId = context.params.id;

        const { name, description, price, images, location, category } = await  req.json()
        
        if(!listingId){
            return NextResponse.json({
                message:"Listing ID is required"
            },{
                status:404
            })
        }

        const listing = await prisma.listing.findUnique({
            where:{
                id:listingId
            },
            select:{
                userId:true
            }
        })

        if(!listing){
            return NextResponse.json({
                message:"Listing not found"
            },{
                status:404
            })
        }

        //ownership check

        if(session?.user?.id !== listing.userId){
            return NextResponse.json({
                message:"Forbidden"
            },{
                status:403
            })
        }


        const updated = await prisma.listing.update({
            where:{
                id:listingId
            },
            data:{
                name,
                description,
                price,
                category,
                location,
                images:{
                    deleteMany:{},
                    create:images.map((i:any)=>({url:i.url}))
                }
             
                
            }
        })

        return NextResponse.json({success:true},{status:200})

    }catch(e){
        console.log("Error editing listing",e);
        return NextResponse.json({
            message:"Something went wrong"
        },{
            status:500
        })
    }

}

export async function DELETE(req:Request,context:any){


    try{

        const session = await auth();
        if(!session?.user?.id){
            return NextResponse.json({message:"Unauthorized"},{status:403})
        }


        const listingId = context.params.id;
        console.log("listing id in delete route",listingId);


        const listing = await prisma.listing.findUnique({
            where:{
                id:listingId
            },
            select:{
                user:true
            }
        })

        if(!listing){
            return NextResponse.json({message:"Listing not found"},{status:404})
        }

        //ownership check

        if(session?.user?.id !== listing.user.id){
            return NextResponse.json({message:"Forbidden"},{status:403})
        }

        const deletedListing = await prisma.listing.delete({
            where:{
                id:listingId
            }
        })

        return NextResponse.json({success:true})

    }catch(e){
        console.log(e);
        console.log("Error deleting listing",e);
        return NextResponse.json({message:"Something went wrong"})
    }

}