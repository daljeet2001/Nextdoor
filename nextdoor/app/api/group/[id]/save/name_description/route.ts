import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";




export async function POST(req: Request, context:any) {

    try {

        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }




        const { id:groupId }=  await context.params;

        if (!groupId) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 })
        }

        const { groupName, groupDescription } = await req.json();

        if (!groupName || !groupDescription) {
            return NextResponse.json({
                message: "Fields are missing"
            }, {
                status: 400
            })
        }

        const group = await prisma.group.update({
            where: {
                id: groupId,
                ownerId: session?.user?.id
            },
            data: {
                name: groupName,
                bio: groupDescription
            }
        })

        if (!group) {
            return NextResponse.json({
                message: "Not authorized to update this group"
            }, {
                status: 403
            })
        }

        return NextResponse.json(group, { status: 200 })

    } catch (e) {
        console.log("Error saving name & description", e);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }

}