
"use client"
import EventCard from "../components/EventCard";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { GrLocationPin } from "react-icons/gr";
import { FaChevronDown } from "react-icons/fa6";

import { IoImage } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
type Type = "host" | "going" | "saved";
export default function Events() {

    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [hostedEvents, setHostedEvents] = useState<any[]>([])
        const [goingEvents, setGoingEvents] = useState<any[]>([])
        const [savedEvents, setSavedEvents] = useState<any[]>([])
    const [ refetchEvents,setRefetchEvents ] = useState(false)
   const { data:session,status } = useSession()

    const [eventLoading, setEventLoading] = useState(false);
    const [type, setType] = useState<Type>("host")


    const [createEvent, setCreateEvent] = useState(false);
    const evevntRef = useRef<HTMLInputElement>(null);
    const [ eventSaved, setEventSaved ] = useState(false);
    const [ eventsButtonDropdown, setEventsButtonDropdown ] = useState<string | null>(null);
        const [ refetchEvents2,setRefetchEvents2 ] = useState(false)


    const [eventName, setEventName] = useState("");
    const [eventCover, setEventCover] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

      async function saveEvent(id: string) {
    try {
      const res = await fetch(`/api/event/save/${id}`, {
        method: "POST"
      }
      )

      if (!res.ok) {
        alert("Failed to save event")
        return
      }
      alert("Event saved successfully")
      setEventSaved(true)
      setRefetchEvents(true)

    } catch (e) {
      console.log(e);
      alert("Something went wrong")
    }
  }

    async function toggleDropdownEvent(id:string){
    setEventsButtonDropdown((prev)=>prev === id? null : id)
  }


   async function unsaveEvent(id: string) {
    try {
      const res = await fetch(`/api/event/unsave/${id}`, {
        method: "POST"
      }
      )

      if (!res.ok) {
        alert("Failed to unsave event")
        return
      }
      alert("Event unsaved successfully")
      setRefetchEvents2(true)
      toggleDropdownEvent(id)

    } catch (e) {
      console.log(e);
      alert("Something went wrong")
    }
  }

     async function goingToEvent(id: string) {
    try {
      const res = await fetch(`/api/event/going/${id}`, {
        method: "POST"
      }
      )

      if (!res.ok) {
        alert("Going failed")
        return
      }
      alert("Going successfully")
      toggleDropdownEvent(id)

    } catch (e) {
      console.log(e);
      alert("Something went wrong")
    }
  }

useEffect(()=>{

       async function gethostEvents(){
        const res = await fetch("/api/event/host");
        if(!res.ok){
            alert("Failed to fetch host events")
        }
        const hostedEvents = await res.json();
        setHostedEvents(hostedEvents)
    }

    async function getGoingEvents(){
      const res = await fetch("/api/event/going");
      if(!res.ok){
        alert("Failed to fetch going events")
      }
      const goingEvents = await res.json();
      setGoingEvents(goingEvents)

    }

    async function getsavedEvents(){
        const res = await fetch("/api/event/saved");
        if(!res.ok){
            alert("Failed to fetch saved events")
        }
        const data = await res.json()
        console.log("saved events in events page",data)
        setSavedEvents(data.savedEvents)
    }

    gethostEvents()
    getsavedEvents()
    getGoingEvents()

    
},[refetchEvents,refetchEvents2])
    const handleRemovePosts = (eventId: string) => {
        setEvents((prev) => prev.filter(e => e.id !== eventId))
    }

    async function handelEventImageUpload(file?: File) {

        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(`/api/upload`, {
            method: "POST",
            body: formData
        })

        const data = await res.json();
        console.log("event image after upload api", data)

        setEventCover(data.url)

    }

 

   async function postEvent(){
    try{
      setEventLoading(true);

      const res = await fetch("/api/event",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          eventName,
          eventCover,
          description,
          location,
          startDate,
          endDate,
          startTime,
          endTime
        })
      })
      const data  = await res.json()

      if(!res.ok){
        alert(data.error || "Failed to create post");
        return
      }

      alert("Event created successfully")
      setEventLoading(false)
      setCreateEvent(false)

    }catch(e){
      console.log("Error creating event",e)
      alert("Something went wrong")

    }finally{
      setEventLoading(false);
    }
  

  }



    return (
        <>

            <div className="flex flex-col items-start gap-4 h-[800px] ">
                <div className="flex  justify-between  gap-2 px-4 py-3 ">

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full" onClick={() => router.back()}>
                            <IoIosArrowBack size={28} />
                        </button>
                        <h1 className="text-lg font-semibold">Your events</h1>
                    </div>

                    {/* <button onClick={() => setCreateEvent(true)} className="rounded-3xl py-2 px-4 border-none font-semibold text-black bg-[#9BA6B7]">Create an event</button> */}




                </div>

                <div className="flex items-center  gap-2">
                    <button onClick={() => setType("host")} className={`px-4 py-2  ${type === "host" ? "border-b-2 border-black" : ""}  text-black`}>Host</button>
                    <button onClick={() => setType("going")} className={`px-4 py-2  ${type === "going" ? "border-b-2 border-black" : ""}  text-black`}>Going</button>
                    <button onClick={() => setType("saved")} className={`px-4 py-2  ${type === "saved" ? "border-b-2 border-black" : ""}  text-black`}>Saved</button>
                </div>
                
                {type === "host" && 
                // <div className="h-[800px] overflow-y-auto pr-2 space-y-1  rounded-lg p-3 flex flex-wrap gap-4">
                            <div className="flex justify-start items-start gap-4 flex-wrap max-h-[800px] overflow-y-auto w-full">


                    {hostedEvents.length > 0 ?
                        hostedEvents.map((event: any,index) => {
    const isSaved = event?.savedEvents?.filter((s:any)=>s.userId === session?.user?.id)
                const isSavedbyOwner = isSaved.length > 0

                            return(
                                  //  <div  key={index} className="w-[262px] h-[362px] flex flex-col gap-2 items-start justify-start p-2 border border-[#ABB7CC] rounded-2xl relative">

                                        <div key={index} className=" relative w-[262px] h-[362px] flex flex-col gap-2 items-start justify-start p-2 border border-[#ABB7CC] rounded-2xl relative">

                          <img onClick={()=>router.push(`/event/${event.id}`)} className=" cursor-pointer w-[244px] h-[244px] rounded-2xl object-cover " src={event.image} alt="event_image"/>
                          <div className="bg-white text-black px-3 py-1 rounded-xl absolute bottom-28 left-4 flex flex-col  items-center ">
                            <p className="text-3xl font-bold">{event.startDate.slice(0,2)}</p>
                             <p>{event.startDate.slice(3)}</p>
                  
                             </div>

                          <div className="text-sm font-semibold">{event.name}</div>
                          <div className="text-xs w-full truncate text-[#ABB7CC] font-normal">{event.startTime} . <span className="">{event.address}</span></div>

                    { !isSavedbyOwner?       <button  onClick={()=> saveEvent(event.id)}  className=" cursor-pointer flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2"><FaBookmark size={18}/>Save</button>
                         :
                         <button onClick ={()=> toggleDropdownEvent(event.id)} className=" flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2">Saved <FaChevronDown size={12} /></button>}

                                 {eventsButtonDropdown === event.id && <div className="   w-full flex flex-col gap-2 absolute top-90 p-4  items-start rounded-2xl bg-[#2F2F2F] shadow-xl z-50"> 
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>goingToEvent(event.id)}>
              Going
            </button>
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>unsaveEvent(event.id)}>
              Not interested
            </button>
            </div>
            }

                        </div>
                            )

}) :
                        <div className="w-full flex items-center justify-center">No host events</div>
                    }
                </div>}
                {type === "going" &&
                //  <div className="h-[800px] overflow-y-auto pr-2 space-y-1 rounded-lg p-3 flex flex-wrap gap-4">
                          <div className="flex justify-start items-start gap-4  flex-wrap max-h-[800px] overflow-y-auto w-full">


                        {goingEvents.length > 0 ?
                        goingEvents?.map((e: any,index) => {
                            const event = e.event;
                            const formatedEvent = {
                                   id: event.id,
            name: event.name,
            address: event.location,
            description: event.description,
            image: event.coverImage,
            startTime: new Date(event.startDateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            endTime: new Date(event.endDateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            startDate: new Date(event.startDateTime).toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
               endDate: new Date(event.endDateTime).toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
            savedEvents:event.savedEvents
                            }

                            console.log("formated event in saved evetns",formatedEvent)
                            // console.log("event in savedEvent object",event)
    const isSaved = formatedEvent?.savedEvents?.filter((s:any)=>s.userId === session?.user?.id)
                const isSavedbyOwner = isSaved?.length > 0

                            return(
                                  //  <div  key={index} className="w-[262px] h-[362px] flex flex-col gap-2 items-start justify-start p-2 border border-[#ABB7CC] rounded-2xl relative">
                                                                      

                                        <div key={index} className=" relative w-[262px] h-[362px] flex flex-col gap-2 items-start justify-start p-2 border border-[#ABB7CC] rounded-2xl relative">

                          <img onClick={()=>router.push(`/event/${formatedEvent.id}`)} className=" cursor-pointer w-[244px] h-[244px] rounded-2xl object-cover " src={formatedEvent.image} alt="event_image"/>
                          <div className="bg-white text-black px-3 py-1 rounded-xl absolute bottom-28 left-4 flex flex-col  items-center ">
                            <p className="text-3xl font-bold">{formatedEvent.startDate.slice(0,2)}</p>
                             <p>{formatedEvent.startDate.slice(3)}</p>
                  
                             </div>

                          <div className="text-sm font-semibold">{formatedEvent.name}</div>
                          <div className="text-xs w-full truncate text-[#ABB7CC] font-normal">{formatedEvent.startTime} . <span className="">{formatedEvent.address}</span></div>

                    { !isSavedbyOwner?       <button  onClick={()=> saveEvent(formatedEvent.id)}  className=" cursor-pointer flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2"><FaBookmark size={18}/>Save</button>
                         :
                         <button onClick ={()=>toggleDropdownEvent(event.id)} className=" flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2">Saved <FaChevronDown size={12} /></button>}
                                                          {eventsButtonDropdown === event.id && <div className="   w-full flex flex-col gap-2 absolute top-90 p-4  items-start rounded-2xl bg-[#2F2F2F] shadow-xl z-50"> 
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>goingToEvent(event.id)}>
              Going
            </button>
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>unsaveEvent(event.id)}>
              Not interested
            </button>
            </div>
            }

                        </div>
                            )

}) :
                        <div className="w-full flex items-center justify-center">No saved events</div>
                    }
                </div>}
                {type === "saved" && 
                // <div className="h-[800px] overflow-y-auto pr-2 space-y-1 rounded-lg p-3 flex flex-wrap gap-4">
                          <div className="flex justify-start items-start gap-4 flex-wrap max-h-[800px] overflow-y-auto w-full">


                       {savedEvents.length > 0 ?
                        savedEvents?.map((e: any,index) => {
                            const event = e.event;
                            const formatedEvent = {
                                   id: event.id,
            name: event.name,
            address: event.location,
            description: event.description,
            image: event.coverImage,
            startTime: new Date(event.startDateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            endTime: new Date(event.endDateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            startDate: new Date(event.startDateTime).toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
               endDate: new Date(event.endDateTime).toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
            }),
            savedEvents:event.savedEvents
                            }

                            console.log("formated event in saved evetns",formatedEvent)
                            // console.log("event in savedEvent object",event)
    const isSaved = formatedEvent?.savedEvents?.filter((s:any)=>s.userId === session?.user?.id)
                const isSavedbyOwner = isSaved?.length > 0

                            return(
                                  //  <div  key={index} className="w-[262px] h-[362px] flex flex-col gap-2 items-start justify-start p-2 border border-[#ABB7CC] rounded-2xl relative">
                                        <div key={index} className=" relative w-[262px] h-[362px] flex flex-col gap-2 items-start justify-start p-2 border border-[#ABB7CC] rounded-2xl relative">

                          <img onClick={()=>router.push(`/event/${formatedEvent.id}`)} className=" cursor-pointer w-[244px] h-[244px] rounded-2xl object-cover " src={formatedEvent.image} alt="event_image"/>
                          <div className="bg-white text-black px-3 py-1 rounded-xl absolute bottom-28 left-4 flex flex-col  items-center ">
                            <p className="text-3xl font-bold">{formatedEvent.startDate.slice(0,2)}</p>
                             <p>{formatedEvent.startDate.slice(3)}</p>
                  
                             </div>

                          <div className="text-sm font-semibold">{formatedEvent.name}</div>
                          <div className="text-xs w-full truncate text-[#ABB7CC] font-normal">{formatedEvent.startTime} . <span className="">{formatedEvent.address}</span></div>

                    { !isSavedbyOwner?       <button  onClick={()=> saveEvent(formatedEvent.id)}  className=" cursor-pointer flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2"><FaBookmark size={18}/>Save</button>
                         :
                         <button onClick ={()=>toggleDropdownEvent(event.id)} className=" flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2">Saved <FaChevronDown size={12} /></button>}
                                                          {eventsButtonDropdown === event.id && <div className="   w-full flex flex-col gap-2 absolute top-90 p-4  items-start rounded-2xl bg-[#2F2F2F] shadow-xl z-999999"> 
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>goingToEvent(event.id)}>
              Going
            </button>
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>unsaveEvent(event.id)}>
              Not interested
            </button>
            </div>
            }

                        </div>
                            )

}) :
                        <div className="w-full flex items-center justify-center">No saved events</div>
                    }
                </div>}

                {createEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative flex flex-col gap-2 h-[600px] overflow-y-auto">

                            <div className="flex items-center justify-between w-full">
                                <button
                                    onClick={() => setCreateEvent(false)}
                                    className="text-gray-500 hover:text-gray-700 block"
                                >
                                    ✕
                                </button>

                                {/* <h2 className="font-semibold text-2xl">New event</h2> */}

                                <button
                                    type="submit"
                                    disabled={eventLoading}
                                    className=" font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full block"
                                    onClick={postEvent}
                                >
                                    {eventLoading ? "Posting..." : "Post"}
                                </button>



                            </div>

                            <div className=" relative h-[400px] ">

                                <img src={eventCover ? eventCover :
                                    "https://i.pinimg.com/1200x/84/75/41/8475416f00fee293ac70c5e49145d53e.jpg"} className="object-cover  w-full h-full rounded-xl" />

                                <button onClick={() => evevntRef.current?.click()} className="absolute inset-x-0 top-1/2 mx-auto flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium w-fit">
                                    <IoImage size={24} />
                                    Cover photo
                                </button>

                                <input
                                    type="file"
                                    hidden
                                    accept="/*image"
                                    ref={evevntRef}
                                    onChange={(e) => handelEventImageUpload(e.target.files?.[0])}
                                />

                            </div>

                            <input className="w-full px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event name"></input>

                            <div className="flex justify-between items-center gap-4 w-[60%]">
                                <h3 className="font-semibold text-lg ">Start</h3>

                                <div className="flex gap-2">
                                    <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Date"></input>
                                    <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Time"></input>
                                </div>
                            </div>


                            <div className="flex justify-between items-center gap-4 w-[60%]">
                                <h3 className="font-semibold text-lg ">End</h3>

                                <div className="flex gap-2">
                                    <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" placeholder="Date"></input>
                                    <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="Time"></input>
                                </div>
                            </div>

                            <div className="relative">
                                <FaLocationDot size={20} className="absolute top-[50%] translate-y-[-50%] left-1 flex  items-center text-gray-400" />
                                <input className="w-full px-7 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"></input>

                            </div>


                            <label className="font-semibold text-2xl">Add more details (optional)</label>
                            <textarea className="resize-none w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description " />

                        </div>
                    </div>
                )}
            </div>


        </>
    )
}
