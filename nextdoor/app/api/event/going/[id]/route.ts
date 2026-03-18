
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from '@/lib/auth';



export async function POST(req: Request, context:any) {

    try {
        const { id:eventId }= await context.params;
        if (!eventId) {
            return NextResponse.json({
                message: "Event Id is required"
            }, { status: 404 })
        }

        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 })
        }

        const Going = await prisma.going.create({
            data:{
                userId:session?.user?.id,
                eventId
            }
        })



        const updatedEvent = await prisma.event.findUnique({
            where: {
                id: eventId
            },
            include:{
                going:true
            }
      
        })
        // console.log("updated event in the going api",updatedEvent)

        return NextResponse.json({ success: true, going: updatedEvent?.going })

    } catch (e) {
        console.log(e);
        return NextResponse.json({
            mesaage: "Something went wrong"
        }, { status: 500 })
    }
}
