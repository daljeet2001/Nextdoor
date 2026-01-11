import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(req: Request,{ params}: { params:{ id: string } }) {

    try {

        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where:{id:params.id},
            select:{
                id:true,
                name:true,
                image:true,
                city:true,
                bio:true,
                backgroundImage:true,
                neighborhoodId:true,
            }
        })

        if(!user){
            return NextResponse.json({message:"user not found"},{status:404})
        }

        return NextResponse.json(
            {
                id:user.id,
                name:user.name,
                image:user.image,
                backgroundImage:user.backgroundImage,
                city:user.city,
                bio:user.bio
            }
        )



    } catch (error) {

        console.log(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })

    }



}





