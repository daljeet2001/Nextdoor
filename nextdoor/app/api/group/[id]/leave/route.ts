
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"

export async function POST(req: Request,context:any) {

    try {

        const groupId = context.params.id;

        if (!groupId) {
            return NextResponse.json({ message: "Group ID is required" }, { status: 400 })
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const memberId = session?.user?.id




        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            include: {
                members: true
            }
        })

        if (!group) {
            return NextResponse.json({ message: "Group not found" }, { status: 404 })
        }


        const isMember = group.members.some((m:any)=>m.id === memberId);

        if(!isMember){
            return NextResponse.json({message:"Not a member"},{status:400})
        }


        const updated = await prisma.group.update({
            where:{
                id:groupId
            },
            data:{
                members:{
                    disconnect:{
                        id:memberId
                    }
                }
            },
            include:{
                members:true
            }
        })


        return NextResponse.json(updated,{status:200})



    } catch (e) {
        console.log("Error leaving group", e);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }

}