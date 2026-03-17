import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id || !session?.user?.neighborhoodId) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 })
        }

        const events = await prisma.event.findMany({
            where: {
                neighbourhoodId: session?.user?.neighborhoodId,
                hidenBy:{
                    none:{
                        userId:session?.user?.id
                    }
                },
                user:{
                    mutedBy:{
                        none:{
                            userId:session?.user?.id
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                savedEvents:true,

            }
        })

        const formated = events.map((event) => ({
            id: event.id,
            name: event.name,
            address: event.location,
            description: event?.description || "",
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


export async function POST(req: Request) {
    try {
        const session = await auth();
        // console.log("session in create event api",session);
        if (!session?.user?.id || !session?.user?.neighborhoodId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const body = await req.json();

        const {
            eventName,
            eventCover,
            location,
            startTime,
            startDate,
            endTime,
            endDate,
            description,
        } = body
        console.log("body on the api event", body)

        if (!eventName || !eventCover || !location || !startTime || !endTime || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing requied fields" }, { status: 400 })
        }

        //convert to date object
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`)

        const event = await prisma.event.create({
            data: {
                name: eventName,
                coverImage: eventCover,
                startDateTime,
                endDateTime,
                location,
                description:description || "",
                userId: session?.user?.id,
                neighbourhoodId: session?.user?.neighborhoodId
            }
        })

        return NextResponse.json({ success: true, event }, { status: 201 })

    } catch (e) {
        console.log("Create event error", e)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }

}
