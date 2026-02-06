"use client";

type View = "home" | "events" | "sale" | "groups";


import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaLocationDot } from "react-icons/fa6";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import CreateServiceForm from "../components/CreateServiceForm";
import Sidebar from "../components/Sidebar"
import { FaChevronDown } from "react-icons/fa6";
import { IoImage } from "react-icons/io5";
import { Plus } from "lucide-react";
import { FaBookmark } from "react-icons/fa";
// const NeighborhoodMap = dynamic(() => import("../components/NeighborhoodMap"), { ssr: false });
import Link from "next/link"
import { useFormStatus } from "react-dom";



export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const neighborhoodId = session?.user?.neighborhoodId;
  const [eventLoading, setEventLoading] = useState(false)

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [createEvent, setCreateEvent] = useState(false);
  const [isEventSaved,setIsEventSaved] = useState(false);
  const evevntRef = useRef<HTMLInputElement>(null);
  const [eventsData, setEventsData] = useState<any[]>([])

  const [eventName, setEventName] = useState("");
  const [eventCover, setEventCover] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [ refetchEvents,setRefetchEvents ] = useState(false)
    const [ refetchEvents2,setRefetchEvents2 ] = useState(false)
  const [ eventsButtonDropdown, setEventsButtonDropdown ] = useState<string | null>(null)



  const [view, setView] = useState<View>("home")

  const handleRemovePosts = (postId: string) => {
    setPosts((prev) => prev.filter(p => p.id !== postId))
  }



  useEffect(() => {
    console.log("events Data", eventsData)
  }, [eventsData])

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (neighborhoodId) {
      async function load() {
        try {
          const [pRes, sRes, eRes] = await Promise.all([
            fetch("/api/posts?neighborhoodId=" + neighborhoodId),
            fetch("/api/services?neighborhoodId=" + neighborhoodId),
            fetch("/api/event")
          ]);
          const [pData, sData, eData] = await Promise.all([pRes.json(), sRes.json(), eRes.json()]);
          setPosts(pData);
          setServices(sData);
          setEventsData(eData);
          console.log("event in home page",eData)
        } catch (err) {
          console.error("Failed to load posts/services", err);
        }
      }
      load();

    }
  }, [status, neighborhoodId, router,refetchEvents,refetchEvents2]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  async function toggleDropdownEvent(id:string){
    setEventsButtonDropdown((prev)=>prev === id? null : id)
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

  async function postEvent() {
    try {
      setEventLoading(true);

      const data = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
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
      const res = await data.json()

      if (!res.ok) {
        alert(res.error || "Failed to create post");
        return
      }

      alert("Event created successfully")
      setEventLoading(false)
      setCreateEvent(false)

    } catch (e) {
      console.log("Error creating event", e)
      alert("Something went wrong")

    } finally {
      setEventLoading(false);
    }


  }

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
      setRefetchEvents(true)

    } catch (e) {
      console.log(e);
      alert("Something went wrong")
    }
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

  



  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <aside className="md:col-span-1">
        <Sidebar view={view} setView={setView} />

      </aside>

      {view === "home" && <div className="md:col-span-2 space-y-4">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">

        </div>

        {/* Create button */}

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full"
        >
          <Plus size={18} /> Post
        </button>


        {/* Modal for creating post */}
        {open && (
          <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-100">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create Post</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <CreatePostForm
                neighborhoodid={neighborhoodId ?? ""}
                onCreated={(p) => {
                  setPosts((s: any) => [p, ...s]);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Modal for creating service */}
        {open2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
              <button
                onClick={() => setOpen2(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <CreateServiceForm
                neighborhoodid={neighborhoodId ?? ""}
                onCreated={(s) => setServices((x) => [s, ...x])}
                setOpen2={setOpen2}
              />
            </div>
          </div>
        )}

        {/* Scrollable content */}
        <div className="h-[800px] overflow-y-auto pr-2 space-y-3  rounded-lg p-3">

          {posts.map((post: any) => <PostCard key={post.id} post={post} onClose={handleRemovePosts} />)}


          {posts?.length === 0 && <p>No posts yet</p>}
        </div>
      </div>}

      {view === "sale" && <div className="md:col-span-2 space-y-4">Sale & Free tab coming soon</div>}

      {view === "events" && <div className="md:col-span-3 space-y-4 ">

        <h2 className="font-semibold text-2xl ">Events near you</h2>

        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => setCreateEvent(true)} className="rounded-3xl py-2 px-4 border-none font-semibold text-black bg-[#9BA6B7]">Create an event</button>
          <Link href="/events" className="rounded-3xl py-2 px-4 border-none font-semibold text-[#ABB7CC] bg-[#454647]">Your events</Link>
        </div>

        {eventsData.length !== 0 ?
          <div className="flex justify-start gap-2 flex-wrap h-[800px] overflow-y-auto w-full space-y-2">
            {
              eventsData?.map((event, index) => {
                const id = event.id;
                const isSaved = event?.savedEvents?.filter((s:any)=>s.userId === session?.user?.id)
                const isSavedbyOwner = isSaved.length > 0
                return (
                  <div key={index} className=" relative w-[262px] max-h-[362px] flex flex-col gap-2 items-start justify-center p-2 border-1 border-[#ABB7CC] rounded-2xl relative"> 

                    <img className="w-[244px] h-[244px] rounded-2xl object-cover  cursor-pointer
" src={event.image} alt="event_image" onClick={()=>router.push(`/event/${id}`)} />
                    <div className="bg-white text-black px-3 py-1 rounded-xl absolute bottom-28 left-4 flex flex-col  items-center ">
                      <p className="text-3xl font-bold">{event.startDate.slice(0, 2)}</p>
                      <p>{event.startDate.slice(3)}</p>

                    </div>

                    <div className="text-sm font-semibold">{event.name}</div>
                    <div className="text-xs w-full truncate text-[#ABB7CC] font-normal">{event.startTime} . <span className="">{event.address}</span></div>

           { !isSavedbyOwner ?        <button  onClick={()=> saveEvent(id)}  className=" cursor-pointer flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2"><FaBookmark size={18}/>Save</button>
           :
           <button onClick={()=>toggleDropdownEvent(id)} className=" flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2">Saved <FaChevronDown size={12} /></button>}

           {eventsButtonDropdown === id && <div className="   w-full flex flex-col gap-2 absolute top-90 p-4  items-start rounded-2xl bg-[#2F2F2F] shadow-xl z-50"> 
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>goingToEvent(id)}>
              Going
            </button>
            <button className="border-none background-none text-white cursor-pointer" onClick={()=>unsaveEvent(id)}>
              Not interested
            </button>
            </div>
            }


                  </div>

                )
              })
            }



          </div> : <div className="flex items-center gap-2">
            No events</div>}

      </div>}
      {view === "groups" && <div className="md:col-span-2 space-y-4">Groups tab coming soon</div>}

      {/* {view==="home" &&    <aside className="md:col-span-1">
   
        <div onClick={() => setOpen2(true)} className="cursor-pointer max-w-sm rounded-2xl shadow-sm hover:shadow-md transition bg-white overflow-hidden" >
          <img src="/servicebanner.jpg" alt="local business" className="w-full h-40 object-cover" />
           <div className="p-4"> 
           <h3 className="font-semibold text-lg mb-1">Own a local business?</h3>
           <p className="text-gray-600 text-sm"> Create a business page to connect with neighbors, post updates in the feed, and gain new customers. </p>
           </div> 
           <div className="flex items-center justify-between border-t p-4 text-[#0D1164] font-semibold"> Create page 
            <span className="ml-2">➔</span>
            </div> 
        </div>

   
        
      </aside>} */}

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
  );
}
