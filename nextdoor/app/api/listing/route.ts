
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";



export async function GET(req:Request){

    const session = await auth();
    if(!session?.user?.neighborhoodId){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status:401
        })
    }

    const listings = await prisma.listing.findMany({
        where:{
            neighborhoodId:session?.user?.neighborhoodId,
            user:{
                mutedBy:{
                    none:{
                        userId:session?.user?.id
                    }
                }
            },
            hiddenBy:{
                none:{
                    userId:session?.user?.id
                }
            }
        },
        include:{
            user:true,
            images:true
        },
        orderBy:{createdAt:'desc'}
    })

    return NextResponse.json(listings)
}

export async function POST(req:Request){

    const session = await auth();
    if(!session?.user?.id || !session?.user?.neighborhoodId){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status:401
        })
    }

    const { images, name, category, description, price, location} = await req.json();
    

    if(!images || !name || !category || !description || !price || !location){
        return NextResponse.json({
            message:"Missing fields"
        },{
            status:400
        })
    }

    console.log("images on server side",images)

    const listing = await prisma.listing.create({
        data:{
            images:{
                create:images.map((url:string)=>({url}))
            },
            name,
            category,
            description,
            price,
            location,
            userId:session?.user?.id,
            neighborhoodId:session?.user?.neighborhoodId
        },
    })

    return NextResponse.json(listing)

}


