
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from '@/lib/auth';



export async function POST(req: Request, { params }: { params: { id: string } }) {

    try {
        const eventId = params.id;
        if (!eventId) {
            return NextResponse.json({
                message: "Event Id is required"
            }, { status: 404 })
        }

        const session = await getServerSession(authOptions);
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
