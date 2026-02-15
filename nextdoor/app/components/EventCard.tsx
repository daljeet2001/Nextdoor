"use client"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoIosArrowBack } from "react-icons/io";
import { PiDotsThree } from "react-icons/pi";
import { FaCalendarAlt } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi2";
import { GrLocationPin } from "react-icons/gr";
import { FaBookmark } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { IoImage } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, BellOff, Bookmark, Pencil, Trash2, Lock, X, MessageSquare, BookmarkX, MessageSquareOff, Flag, FlagOff, VolumeOff, Volume } from "lucide-react";
import { IoIosSearch } from "react-icons/io";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";






export default function EventCard({ event }: { event: any }) {

  console.log("event inside EvenetCard", event);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname()

  const router = useRouter();
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(false);
  const [eventsButtonDropdown, setEventsButtonDropdown] = useState<string | null>(null);
  const isSaved = event?.savedEvents?.filter((s: any) => s.userId === session?.user?.id);
  const isSavedbyOwner = isSaved?.length > 0;
  const [eventSaved, setEventSaved] = useState(false);
  const isOwner = session?.user?.id === event.user.id;
  const menuButton = useRef<HTMLButtonElement>(null);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [editMenu, setEditMenu] = useState(false);
    const [searchLocation, setSearchLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([])


  const [eventName, setEventName] = useState(event.name);
  const [eventCover, setEventCover] = useState(event.image);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.address);
  const [startDate, setStartDate] = useState(convertToISODate(event.startDate));



  const [startTime, setStartTime] = useState(convertTo24Time(event.startTime));
  const [endDate, setEndDate] = useState(convertToISODate(event.endDate));
  const [endTime, setEndTime] = useState(convertTo24Time(event.endTime));
  const [eventLoading, setEventLoading] = useState(false);
  const evevntRef = useRef<HTMLInputElement>(null);




  // useEffect(() => {
  //   function handleClickOutside(e: MouseEvent) {
  //     if (menuRef.current && !menuRef.current?.contains(e.target as Node)) {
  //       setMenu(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside)
  //   return () => document.removeEventListener("mousedown", handleClickOutside)

  // }, [])

         useEffect(()=>{

    const fetchLocation = async()=>{

        try{

          if(locationQuery.length<3){
            setLocationResults([]);
            return
          }

    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${locationQuery}&countrycodes=in&format=json&addressdetails=1&limit=5`
      );
          const data = await res.json();
          const formatedData = data.map((item:any)=>item.display_name);
          setLocationResults(formatedData)

      

    }catch(e){
      console.log("Error fetching location",e)
    }

    }

    const timer = setTimeout(fetchLocation,500);
    return ()=>clearTimeout(timer)


  

  },[locationQuery])

  const editEvent = async()=>{
    setEventLoading(true)
    const res = await fetch(`/api/event/${event.id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        eventName,
        eventCover,
        description,
        location,
        startDate,
        startTime,
        endDate,
        endTime 
      })
    })

    if(!res.ok){
      alert("Failed to edit event")
      setEventLoading(false);
      return;
    }
    alert("Event edited successfully")
    setEditMenu(false)
    setEventLoading(false)

  }

  function convertToISODate(dateStr: string) {
  return new Date(dateStr).toISOString().split("T")[0];
}

function convertTo24Time(timeStr: string) {
  const d = new Date(`1970-01-01 ${timeStr}`);
  return d.toTimeString().slice(0,5);
}


  const handleEventImageUpload = async(file?:File)=>{

    if(!file){
      return
    }

    const formData = new FormData();
    formData.append("file",file);

    const res = await fetch("/api/upload",{
      method:"POST",
      body:formData
    })

    if(!res.ok){
      alert("Faied to upload event image")
    }

    const data = await res.json()
    setEventCover(data.url)
  }

  const handleDeletePost = async () => {

    try {
      const res = await fetch(`/api/event/${event.id}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        throw new Error("Failed to delete event")
      } else {
        alert("Event deleted successfully")
      }

    } catch (e) {
      console.log(e);
      alert("Failed to delete event")
    }
  }

  const handleHideEvent = async () => {
    try {

      const res = await fetch(`/api/event/hide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id })
      })

      if (!res.ok) {
        throw new Error("Failed to hide post")
      } else {
        alert("Post hidden successfully")

      }

    } catch (e) {
      console.log(e)
      alert("Failed to hide post")
    }
  }

  const handleMute = async () => {

    const res = await fetch("/api/user/mute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mutedId: event.user.id })
    })

    if (res.ok) {
      alert(`You won't see posts from ${event.user.name} anymore`)
    }
  }

  const handleReport = async () => {
    const res = await fetch("/api/event/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: event.id })
    })
    if (res.ok) {
      alert("Post reported. Thanks for helping keep the community safe.")
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
      setEventSaved(true)


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
      // setRefetchEvents2(true)
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

  async function toggleDropdownEvent(id: string) {
    setEventsButtonDropdown((prev) => prev === id ? null : id)
  }

  return (
    <>
      <div className="flex flex-col rounded-3xl border-1 border-[#ABB7CC] relative p-4 ">
        <img className="object-cover rounded-t-3xl w-full h-[400px]" src={event.image} alt="event-image" />
        <button className="p-2 rounded-full rounded-full bg-white border-none absolute top-6 left-6" onClick={() => router.back()}>
          <IoIosArrowBack size={28} />
        </button>
        <button ref={menuButton} className="p-2 rounded-full rounded-full bg-white border-none absolute top-6 right-6" onClick={() => setMenu(!menu)}>
          <PiDotsThree size={28} />
        </button>
        {menu && <div
          ref={menuRef}
          className="absolute right-0 top-20 w-72 rounded-2xl bg-[#2F2F2F] shadow-xl border border-neutral-700 overflow-hidden z-50">




          {!isOwner && (
            <>
              <Menuitem
                icon={<Flag size={20} />}
                title="Report"
                subtitle="Flag for review"
                onClick={() => {
                  setMenu(false);
                  handleReport()
                }}
              />

              <Menuitem
                icon={<VolumeOff size={20} />}
                title={`Mute ${event.user.name}`}
                subtitle="Hide all posts from this neighborhood"
                onClick={() => {
                  setMenu(false);
                  handleMute()
                }}
              />
              <Menuitem
                icon={<X size={20} />}
                title="Hide"
                subtitle="Remove post from your feed"
                onClick={() => {
                  setMenu(false)
                  handleHideEvent()
                }}
              />
            </>

          )}

          {isOwner && (
            <>


              <Menuitem
                icon={<Pencil size={20} />}
                title="Edit"
                subtitle="Upadte the content of your post"
                onClick={() => {
                  setMenu(false);
                  
                  setEditMenu(true)

                }}
              />
              <Menuitem
                icon={<Trash2 size={20} />}
                title="Delete"
                subtitle="Permanently remove post"
                danger

                onClick={() => {
                  setMenu(false)
                  setDeleteMenu(true)

                }}
              />
            </>

          )}

        </div>}

        {
          deleteMenu && (
            <div className="fixed inset-0 flex justify-center items-center z-[60]">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteMenu(false)}>
              </div>
              {/* Model */}
              <div className="relative z-10 w-[320px]  rounded-2xl bg-[#2F2F2F] p-4 shadow-xl ">
                <h3 className="text-lg font-semibold text-white ">
                  Delete Post?
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Your post will be permanently removed.
                </p>
                <div className="mt-4 flex justify-end gap-3">

                  <button onClick={() => setDeleteMenu(false)} className={`px-4 py-2 rounded-full text-sm text-neutral-300 hover:bg-neutral-700 transition`}>Cancel</button>

                  <button
                    onClick={() => {
                      setDeleteMenu(false)
                      //delete api
                      handleDeletePost()
                    }
                    }
                    className="px-4 py-2 rounded-full bg-red-500 font-semibold text-white hover:bg-red-600 transition"
                  >Delete</button>



                </div>
              </div>

            </div>
          )
        }

        {
          editMenu && (
            <div className="fixed inset-0 flex justify-center items-center z-[60] ">
              {/* Backdrop */}
              <div className="absolute inset-0  bg-black/40" onClick={() => setEditMenu(false)}>
              </div>
              {/* Model */}
              <div className="relative z-10 rounded-2xl w-[800px] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative flex flex-col gap-2 h-[600px] overflow-y-auto">

                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => setEditMenu(false)}
                      className="text-gray-500 hover:text-gray-700 block"
                    >
                      ✕
                    </button>

                    {/* <h2 className="font-semibold text-2xl">New event</h2> */}

                    <button
                      type="submit"
                      disabled={eventLoading}
                      className=" font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full block"
                      onClick={editEvent}
                    >
                      {eventLoading ? "Saving..." : "Save"}
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
                      onChange={(e) => handleEventImageUpload(e.target.files?.[0])}
                    />

                  </div>

                  <input className="w-full px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event name"></input>

                  <div className="flex justify-between items-center gap-4 w-[60%]">
                    <h3 className="font-semibold text-lg ">Start</h3>

                    {/* default */}

                    {/* <div className="flex gap-2">
                      <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Date"></input>
                      <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Time"></input>
                    </div> */}


                    {/* mui library */}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>

  <DatePicker
    label="Start Date"
    value={dayjs(startDate)}
    onChange={(newValue) => setStartDate(newValue?.format("YYYY-MM-DD") || "")}
  />

  <TimePicker
    label="Start Time"
    value={dayjs(`2024-01-01T${startTime}`)}
    onChange={(newValue) => setStartTime(newValue?.format("HH:mm") || "")}
  />

</LocalizationProvider>





                  </div>


                  <div className="flex justify-between items-center gap-4 w-[60%]">
                    <h3 className="font-semibold text-lg ">End</h3>

                    {/* default */}

                    {/* <div className="flex gap-2">
                      <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" placeholder="Date"></input>
                      <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="Time"></input>
                    </div> */}


                    {/* mui library */}


                    <LocalizationProvider dateAdapter={AdapterDayjs}>

  <DatePicker
    label="End Date"
    value={dayjs(endDate)}
    onChange={(newValue) => setEndDate(newValue?.format("YYYY-MM-DD") || "")}
  />

  <TimePicker
    label="End Time"
    value={dayjs(`2024-01-01T${endTime}`)}
    onChange={(newValue) => setEndTime(newValue?.format("HH:mm") || "")}
  />

</LocalizationProvider>

                  </div>

                  <div className="relative" onClick={()=>setSearchLocation(true)}>
                    <FaLocationDot size={20} className="absolute top-[50%] translate-y-[-50%] left-1 flex  items-center text-gray-400" />
                    <input className="w-full px-7 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"></input>

                  </div>
                     {searchLocation &&
                                <div className="fixed inset-0 top-50 z-100 flex items-center justify-center" >
                                  <div className="  bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 relative flex flex-col items-center gap-2 h-[300px]">
                                             <div className="flex justify-between w-full">
                                                    <h1 className="text-2xl font-bold" >Search location</h1>
                                        <button
                                  onClick={() => setSearchLocation(false)}
                                  className="text-gray-500 hover:text-gray-700 block"
                                >
                                  ✕
                                </button>
                  
                                    </div>
                      
                                    <div className="relative w-full" >
                                      <IoIosSearch size={22} className="absolute top-[50%] inset-y-0 translate-y-[-50%] left-1 flex  items-center text-gray-400" />
                  
                                      <input value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} className="w-full pl-6.5 px-1.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] ]" />
                  
                                    </div>
                                    <div className="flex flex-col gap-2 w-full overflow-auto ">
                                      {locationResults.map((location, index) => (
                                        <div className="w-full cursor-pointer hover:bg-[#FAF9F6] rounded-xl px-4 py-2" onClick={() => { setLocation(location), setSearchLocation(false) }} key={index}>{location}</div>
                                      ))}
                  
                                    </div>
                  
                  
                  
                  
                                  </div>
                                </div>}


                  <label className="font-semibold text-2xl">Add more details (optional)</label>
                  <textarea className="resize-none w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description " />

                </div>
              </div>


            </div>
          )
        }
        <div className="flex flex-col  bg-white shadow-sm rounded-b-3xl px-4  py-2 relative">
          <p className="text-2xl font-semibold ">{event.name}</p>
          <p className="text-sm justify-start  flex items-center gap-1"><HiOutlineCalendar size={24} />{event.startDate}, {event.startTime} - {event.endDate}, {event.endTime}</p>
          <p className="text-sm justify-start flex items-start gap-1 text-[#ABB7CC]"><GrLocationPin size={24} />{event.address}</p>
          {!isSavedbyOwner && !eventSaved ? <button onClick={() => saveEvent(event.id)} className="my-2 flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2"><FaBookmark size={18} />Save</button>
            :
            <button onClick={() => toggleDropdownEvent(event.id)} className=" flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2">Saved <FaChevronDown size={12} /></button>
          }
          {eventsButtonDropdown === event.id && <div className="  w-[526px] flex flex-col gap-2 mt-4  p-4 items-start rounded-2xl bg-[#2F2F2F] shadow-xl z-50">
            <button className="border-none background-none text-white cursor-pointer" onClick={() => goingToEvent(event.id)}>
              Going
            </button>
            <button className="border-none background-none text-white cursor-pointer" onClick={() => unsaveEvent(event.id)}>
              Not interested
            </button>
          </div>
          }
          <p className="text-[#ABB7CC] text-sm ">{event.savedEvents.length} intersted . {event.going?.length} going</p>
          <p className="text-sm">{event.description}</p>

          <div className="flex items-start gap-3 mt-2">
            <Link href={`/profile/${event?.user?.id}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
              {/* {post.user?.name?.[0] ?? "U"} */}

              {event.user?.image && event.user.image.trim() != "" ? (<img src={event.user.image} alt="profile_img" className="w-full h-full rounded-full" />) : (<div className="">{event.user?.name?.[0].toUpperCase() ?? "U"}</div>
              )}

            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                {event.user?.name ?? event.user?.email}
              </div>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                {event?.user?.city} · {timeAgo(event.createdAt)} ago
              </div>
            </div>
          </div>


          {/* <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 justify-center">
            <button
          
              className={`flex items-center gap-1 text-sm font-medium ${liked ? "text-gray-600" : "text-gray-600 hover:text-[#0D1164]"
                }`}
            >
              {liked ? (
                <img src="/like-social-heart.png" className="w-6 h-6" alt="liked" />
              ) : (
                <img src="/heart.png" className="w-6 h-6" alt="like" />
              )}
         
            </button>

        <button   className="flex items-center gap-1 text-gray-600 hover-text-[#0D1164]">
              <img src="/comment.png" className="w-6 h-6" alt="comment"></img>
         
            </button> 
                  <button  className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]">
              <img src="/share.png" className="w-6 h-6" alt="share" />
            </button>
      






          </div>

        </div> */}

        </div>






      </div>
    </>
  )
}


function Menuitem({
  icon,
  title,
  subtitle,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;

}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex gap-3 px-4 py-3 text-left hover:bg-neutral-700 transition ${danger ? "text-red-400" : "text-white"}`}
    >
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold leading-tight">{title}</p>
        <p className="text-sm text-neutral-400">{subtitle}</p>
      </div>
    </button>
  )
}

export function timeAgo(dateString: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );

  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mon`;

  const years = Math.floor(days / 365);
  return `${years}y`;
}