"use client"
import EventCard from "@/app/components/EventCard"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"


export default  function Event() {

    const params = useParams()
    const id = params?.id as string
    const [event, setEvent] = useState(null)


    useEffect(() => {

        async function GetEvent() {
            const res = await fetch(`/api/event/${id}`)

            if (!res.ok) {
                alert("Event not found");
                return
            }

            const event = await res.json();
            setEvent(event)

        }
        if (id) GetEvent()
    }, [id])




    return (
        <>
            <div className=" max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="md:col-span-2">
                    {event ? <EventCard event={event} /> : <div>Event not found</div>}

                </div>
            </div>
        </>
    )

}