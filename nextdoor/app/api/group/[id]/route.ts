

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";



export async function GET(req: Request, context:any) {
    try {

        const session = await getServerSession(authOptions);
        if(!session?.user?.id){
            return NextResponse.json({message:"Unauthorized"},{status:401})
        }


        const groupId = context.params.id;

        if (!groupId) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 })
        }


        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            include: {
                owner: true,
                posts: {
                    where:{
                          hiddenBy:{
        none:{userId:session?.user?.id}
      },
            user:{
        mutedBy:{
          none:{
            userId:session?.user?.id
          }

        }
      }
                    },
                    
                    include:{
                        user:true,
                        photos:true,
                            likes:{
      where:{
        userId:session?.user?.id
      },
      select:{
        id:true
      }
    },
    bookmarks:{
      where:{
        userId:session?.user?.id
      }
    },
    report:{
      where:{
        userId:session?.user?.id
      }
    }
                    }
                },
                members: true
            }
        })

        if (!group) {
            return NextResponse.json({ message: "Group not found" }, { status: 404 })
        }

        return NextResponse.json(group);

    } catch (e) {
        return NextResponse.json({ messsage: "Something went wrong" }, { status: 500 })
    }
}



export async function DELETE(req: Request, context:any) {

    try {


        const groupId = context.params.id;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        if (!groupId) {
            return NextResponse.json({
                message: "Group ID is required"
            }, { status: 404 })
        }

        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: {
                ownerId: true
            }
        })

        if (!group) {
            return NextResponse.json({
                message: "Group not found"
            }, {
                status: 404
            })
        }

        //ownership verification

        if (group.ownerId !== session?.user?.id) {
            return NextResponse.json({
                message: "Forbidden"
            }, { status: 403 })
        }


        const deleted = await prisma.group.delete({
            where: {
                id: groupId
            }
        })
        return NextResponse.json({ success: true })
    } catch (e) {
        console.log("Error deleting group");
        return NextResponse.json(
            { message: "Something went wrong" },
            {
                status: 500
            })
    }
}