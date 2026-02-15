
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";


export async function GET(req:Request){

    const session = await getServerSession(authOptions);
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
            user:true
        },
        orderBy:{createdAt:'desc'}
    })

    return NextResponse.json(listings)
}

export async function POST(req:Request){

    const session = await getServerSession(authOptions);
    if(!session?.user?.id || !session?.user?.neighborhoodId){
        return NextResponse.json({
            message:"Unauthorized"
        },{
            status:401
        })
    }

    const { image, name, category, description, price, location} = await req.json();
    

    if(!image || !name || !category || !description || !price || !location){
        return NextResponse.json({
            message:"Missing fields"
        },{
            status:400
        })
    }

    const listing = await prisma.listing.create({
        data:{
            image,
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


