import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || !session?.user?.neighborhoodId) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 })
        }

        const events = await prisma.event.findMany({
            where: {
                userId: session?.user?.id
            },
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                savedEvents:true
            }
        })

        const formated = events.map((event) => ({
            id: event.id,
            name: event.name,
            address: event.location,
            description: event.description,
            image: event.coverImage,
            startTime: event.startDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            endTime: event.endDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            startDate: event.startDateTime.toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
               endDate: event.endDateTime.toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
            savedEvents:event.savedEvents
        }))

        return NextResponse.json(formated)

    } catch (e) {

        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }

}
