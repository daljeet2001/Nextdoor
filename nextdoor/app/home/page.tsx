"use client";

type View = "home" | "events" | "sale" | "groups";
type Type = "all" | "your" | "saved"

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
import { TiUpload } from "react-icons/ti";
import { FaBookmark } from "react-icons/fa";
// const NeighborhoodMap = dynamic(() => import("../components/NeighborhoodMap"), { ssr: false });
import Link from "next/link";
import { MdCurrencyRupee } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { useFormStatus } from "react-dom";
import Switch from '@mui/material/Switch';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FaSearch } from "react-icons/fa";
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { RiArrowDropDownLine } from "react-icons/ri";
const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];


const saleStock = [
  {
    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-right-side-view-10.jpeg?isig=0",
    name: "Bullet 350 standard",
    price: "50,000",
    createdAt: "2h ago",
    location: "Sunny enclave,Kharar",
    description: "This is the bullet stadard 350 which my dad bought me on my 21st birthday.",
  },
  {
    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-right-side-view-10.jpeg?isig=0",
    name: "Bullet 350 standard",
    price: "50,000",
    createdAt: "2h ago",
    location: "Sunny enclave,Kharar",
    description: "This is the bullet stadard 350 which my dad bought me on my 21st birthday.",
  },
  {
    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-right-side-view-10.jpeg?isig=0",
    name: "Bullet 350 standard",
    price: "50,000",
    createdAt: "2h ago",
    location: "Sunny enclave,Kharar, Punjab, 140507",
    description: "This is the bullet stadard 350 which my dad bought me on my 21st birthday.",
  },
]

import { LuWashingMachine } from "react-icons/lu";
import { FaTools } from "react-icons/fa";
import { TbMoodKid } from "react-icons/tb";
import { FaCar } from "react-icons/fa";
import { FaBicycle } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { IoIosSearch } from "react-icons/io";


import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";







export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();


  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const neighborhoodId = session?.user?.neighborhoodId;
  const [eventLoading, setEventLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [sellMenuOpen, setSellMenuOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [createEvent, setCreateEvent] = useState(false);
  const [isEventSaved, setIsEventSaved] = useState(false);
  const evevntRef = useRef<HTMLInputElement>(null);
  const [eventsData, setEventsData] = useState<any[]>([])
  const [yourListings, setYourListings] = useState<any[]>([])

  const CategoryOptions = [
    { value: "Appliances", label: "Appliances", icon: <FaTools /> },
    { value: "Automotive", label: "Automotive", icon: <FaCar /> },
    { value: "kids", label: "Baby & Kids", icon: <TbMoodKid /> },
    { value: "Bicycles", label: "Bicycles", icon: <FaBicycle /> },
    { value: "Clothing", label: "Clothing", icon: <GiClothes /> },
    { value: "Electronics", label: "Electronics", icon: <LuWashingMachine /> },
  ];

  const [categoryOpen, setcategoryOpen] = useState(false);


  const [eventName, setEventName] = useState("");
  const [eventCover, setEventCover] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [refetchEvents, setRefetchEvents] = useState(false);
  const [refetchEvents2, setRefetchEvents2] = useState(false);
  const [eventsButtonDropdown, setEventsButtonDropdown] = useState<string | null>(null);
  const [sellType, setSellType] = useState<Type>("all");
  const [checked, setChecked] = useState(false);
  const [searchLocation, setSearchLocation] = useState(false);
  const [ locationQuery,setLocationQuery ] = useState("");
  const [locationResults, setLocationResults] = useState([])



  const [price, setPrice] = useState("");
  const [listingImage, setListingImage] = useState("");
  const listingRef = useRef<HTMLInputElement>(null);
  const [listingName, setListingName] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [selectedCategory, setSelectedcategory] = useState<any>(null);
  const [listingCategory, setListingCategory] = useState("");
  const [priceDisable, setPriceDisable] = useState(false);
  const [listingLocation, setListingLocation] = useState("");
  const [allListings, setAllListings] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);










  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight: personName.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }


  const [personName, setPersonName] = useState<string[]>([]);
  const theme = useTheme();

  const handleChange3 = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };



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
          const [pRes, sRes, eRes, lRes, yRes, savedRes] = await Promise.all([
            fetch("/api/posts?neighborhoodId=" + neighborhoodId),
            fetch("/api/services?neighborhoodId=" + neighborhoodId),
            fetch("/api/event"),
            fetch("/api/listing"),
            fetch("/api/listing/you"),
            fetch("/api/listing/saved")
          ]);
          const [pData, sData, eData, lData, yData, savedData] = await Promise.all([pRes.json(), sRes.json(), eRes.json(), lRes.json(), yRes.json(), savedRes.json()]);
          setPosts(pData);
          setServices(sData);
          setEventsData(eData);
          setAllListings(lData);
          setYourListings(yData);
          setSavedListings(savedData);

          console.log("event in home page", eData)
        } catch (err) {
          console.error("Failed to load posts/services", err);
        }
      }
      load();

    }
  }, [status, neighborhoodId, router, refetchEvents, refetchEvents2]);


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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  async function toggleDropdownEvent(id: string) {
    setEventsButtonDropdown((prev) => prev === id ? null : id)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setPrice("0");
    setPriceDisable(!priceDisable)
  };

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

  async function handleListingImageUpload(file?: File) {

    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: formData
    })

    const data = await res.json();
    console.log("listing image after upload api", data)

    setListingImage(data.url)

  }

  async function postEvent() {
    try {
      setEventLoading(true);

      const res = await fetch("/api/event", {
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
    

      if (!res.ok) {
        alert("Failed to create event");
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

  const saveListing = async () => {

    try {
      setListingLoading(true);
      const res = await fetch("/api/listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: listingImage,
          name: listingName,
          category: listingCategory,
          price,
          description: listingDescription,
          location: listingLocation
        })
      })

      if (!res.ok) {
        alert("Failed to create lisiting");
        setListingLoading(false);
        return
      } else {
        alert("Listing created successfully");
        setListingLoading(false);
        setSellMenuOpen(false);
      }

    } catch (e) {
      console.log("Error creating listing", e)
      alert("Something went wrong")
    }
    finally {
      setListingLoading(false)
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

      {view === "sale" && <div className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <button onClick={() => setSellType("all")} className={`background-none px-4 py-2 ${sellType === "all" ? "border-b-2 border-black" : ""} text-black`}>All listings</button>
            <button onClick={() => setSellType("your")} className={`background-none px-4 py-2 ${sellType === "your" ? "border-b-2 border-black" : ""} text-black`}>Your listings</button>
            <button onClick={() => setSellType("saved")} className={`background-none px-4 py-2 ${sellType === "saved" ? "border-b-2 border-black" : ""} text-black`}>Saved listings</button>
          </div>

          <button className="rounded-3xl py-2 px-4 border-none font-semibold text-black bg-[#9BA6B7]" onClick={() => setSellMenuOpen(true)}>Create a listing</button>

        </div>


        {sellType === "all" && <div className="h-[800px] overflow-y-auto pr-2 p-3 flex flex-wrap gap-2 space-y-3 rounded-lg">
          {allListings.length !== 0 ? (allListings.map((listing, index) => {
            const address = listing.location.split(" ");

            console.log("address", address)
            return (
              <Link href={`/listing/${listing.id}`} key={index} className="w-[195px] h-[300px] p-2 flex flex-col items-start cursor-pointer">
                <img src={listing.image} alt="listing_image" className="w-[188px] h-[188px] rounded-xl object-cover" />
                <div className="text-sm font-semibold mt-1">₹{listing.price}</div>
                <div className="text-sm font-semibold">{listing.name}</div>
                <div className="text-xs font-semibold text-[#ABB7CC] truncate">{timeAgo(listing.createdAt)}. {listing.location.slice(0, 20)}</div>
              </Link>
            )


          }

          )) : (<div>No listings found</div>)}
        </div>}
        {sellType === "your" && <div className="h-[800px] overflow-y-auto pr-2 p-3 flex flex-wrap gap-2 space-y-3 rounded-lg">
          {yourListings.length !== 0 ? (yourListings.map((listing, index) => {
            const address = listing.location.split(" ");

            console.log("address", address)
            return (
              <Link href={`/listing/${listing.id}`} key={index} className="w-[195px] h-[300px] p-2 flex flex-col items-start cursor-pointer">
                <img src={listing.image} alt="listing_image" className="w-[188px] h-[188px] rounded-xl object-cover" />
                <div className="text-sm font-semibold mt-1">₹{listing.price}</div>
                <div className="text-sm font-semibold">{listing.name}</div>
                <div className="text-xs font-semibold text-[#ABB7CC] truncate">{timeAgo(listing.createdAt)}. {listing.location.slice(0, 20)}</div>
              </Link>
            )


          }

          )) : (<div>No listings found</div>)}
        </div>}
        {sellType === "saved" && <div className="h-[800px] overflow-y-auto pr-2 p-3 flex flex-wrap gap-2 space-y-3 rounded-lg">
          {savedListings.length !== 0 ? (savedListings.map((listing, index) => {
            const address = listing.listing.location.split(" ");

            console.log("address", address)
            return (
              <Link href={`/listing/${listing.listing.id}`} key={index} className="w-[195px] h-[300px] p-2 flex flex-col items-start cursor-pointer">
                <img src={listing.listing.image} alt="listing_image" className="w-[188px] h-[188px] rounded-xl object-cover" />
                <div className="text-sm font-semibold mt-1">₹{listing.listing.price}</div>
                <div className="text-sm font-semibold">{listing.listing.name}</div>
                <div className="text-xs font-semibold text-[#ABB7CC] truncate">{timeAgo(listing.listing.createdAt)}. {listing.listing.location.slice(0, 20)}</div>
              </Link>
            )


          }

          )) : (<div>No listings found</div>)}
        </div>}

        {sellMenuOpen &&
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative flex flex-col gap-2 h-[600px] overflow-y-auto">

              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => setSellMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 block"
                >
                  ✕
                </button>

                {/* <h2 className="font-semibold text-2xl">New event</h2> */}

                <button
                  type="submit"
                  disabled={listingLoading}
                  className=" font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full block"
                  onClick={saveListing}
                >
                  {listingLoading ? "Posting..." : "Post"}
                </button>



              </div>

              <div className=" relative h-[121px] w-[200px]">

                <img src={listingImage ? listingImage :
                  "https://img.freepik.com/free-photo/abstract-geometric-background-shapes-texture_1194-301824.jpg?semt=ais_hybrid&w=740&q=80"} className="object-cover  w-full h-full rounded-xl" />

                <button onClick={() => listingRef.current?.click()} className="absolute left-1/2 top-1/2 trsnaform -translate-x-1/2 -translate-y-1/2 mx-auto flex items-center gap-2  text-white text-sm font-medium w-fit">
                  <TiUpload size={24} color="white" />
                  Add photo
                </button>

                <input
                  type="file"
                  hidden
                  accept="/*image"
                  ref={listingRef}
                  onChange={(e) => handleListingImageUpload(e.target.files?.[0])}
                />

              </div>
              <h2 className="text-2xl font-bold">What are you selling</h2>

              <input className="w-full px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]" value={listingName} onChange={(e) => setListingName(e.target.value)} placeholder="Title"></input>

              <textarea className="resize-none w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] min-h-[120px]" value={listingDescription} onChange={(e) => setListingDescription(e.target.value)} placeholder="Describe your item " />

              {/* <div className="relative">
                          <RiArrowDropDownLine size={20} className="absolute top-[50%] translate-y-[-50%] right-1 flex  items-center text-gray-400" />

                      <select  className=" px-2 py-4 w-full rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]" style={{ WebkitAppearance: "none" }}>
  <option value="" className=""> Select a category</option>
  <option value="Appliances"><FaTools size={20}/>Applicanes</option>
  <option value="Automotive"><FaCar size={20}/>Automotive</option>
  <option value="kids"><TbMoodKid size={20}/>Baby & kids</option>
  <option value="Bicycles"><FaBicycle size={20}/>Bicycles</option>
    <option value="Clothing"><GiClothes size={20}/>Clothing</option>
        <option value="Electronics"><LuWashingMachine size={20}/>Electronics</option>
</select>

                    </div> */}

              <div className="relative">
                <button onClick={() => setcategoryOpen(!categoryOpen)} className="w-full px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] flex items-center justify-between text-gray-800" >
                  {selectedCategory ? (
                    <div className="flex items-center gap-3 text-gray-800">
                      {selectedCategory.icon}
                      <span>{selectedCategory.value}</span>
                    </div>

                  ) : (<div className="text-gray-800">Select a category</div>)}
                  <RiArrowDropDownLine size={20} className={` transition-transform ${categoryOpen ? "rotate-180" : ""}`} />

                </button>

                {categoryOpen && <div className=" h-[300px] absolute mt-2 w-full rounded-xl bg-white z-50 overflow-auto flex flex-col gap-2">

                  {CategoryOptions.map((category) => (
                    <div key={category.value} onClick={() => { setSelectedcategory(category), setcategoryOpen(false), setListingCategory(category.value) }} className="flex items-center gap-3 text-gray-600 w-full px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]">
                      {category.icon}
                      <span>{category.label}</span>
                    </div>
                  ))}

                </div>}

              </div>









              <div className=" w-1/2 flex items-center justify-between gap-4">
                <div className={` relative`} >
                  <FaRupeeSign size={20} className=" absolute top-[50%] translate-y-[-50%] left-1 flex items-center text-gray-400" />

                  <input disabled={priceDisable} className={` ${priceDisable ? "cursor-not-allowed" : "cursor-text"} w-fit px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] pl-6`} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price"></input>

                </div>






                <div className="flex items-center justify-center gap-2">
                  <label className="font-bold text-base">Free</label>
                  <Switch
                    checked={checked}
                    onChange={handleChange}
                    slotProps={{ input: { 'aria-label': 'controlled' } }}
                  />

                </div>

              </div>





              <label className="text-xl font-bold">Pickup location</label>
              <div className="relative" onClick={()=>setSearchLocation(true)}>
                <FaLocationDot size={20} className="absolute top-[50%] translate-y-[-50%] left-1 flex  items-center text-gray-400" />
                <input className="w-full px-7 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] " value={listingLocation} onChange={(e) => setListingLocation(e.target.value)}></input>

              </div>
                          {searchLocation && 
      <div className="fixed inset-0 z-100 flex items-center justify-center">
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
          <div className="relative w-full">
                      <IoIosSearch size={22} className="absolute top-[50%] inset-y-0 translate-y-[-50%] left-1 flex  items-center text-gray-400" />

          <input value={locationQuery} onChange={(e)=>setLocationQuery(e.target.value)} className="w-full pl-6.5 px-1.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] ]"/>

          </div>
          <div className="flex flex-col gap-2 w-full overflow-auto ">
                 {locationResults.map((location,index)=>(
            <div className="w-full cursor-pointer hover:bg-[#FAF9F6] rounded-xl px-4 py-2" onClick={()=>{setListingLocation(location),setSearchLocation(false)}} key={index}>{location}</div>
          ))}

          </div>

     
    

        </div>
        </div>}









            </div>
          </div>
        }
      </div>}

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
                const isSaved = event?.savedEvents?.filter((s: any) => s.userId === session?.user?.id)
                const isSavedbyOwner = isSaved.length > 0
                return (
                  <div key={index} className=" relative w-[262px] max-h-[362px] flex flex-col gap-2 items-start justify-center p-2 border-1 border-[#ABB7CC] rounded-2xl relative">

                    <img className="w-[244px] h-[244px] rounded-2xl object-cover  cursor-pointer
" src={event.image} alt="event_image" onClick={() => router.push(`/event/${id}`)} />
                    <div className="bg-white text-black px-3 py-1 rounded-xl absolute bottom-28 left-4 flex flex-col  items-center ">
                      <p className="text-3xl font-bold">{event.startDate.slice(0, 2)}</p>
                      <p>{event.startDate.slice(3)}</p>

                    </div>

                    <div className="text-sm font-semibold">{event.name}</div>
                    <div className="text-xs w-full truncate text-[#ABB7CC] font-normal">{event.startTime} . <span className="">{event.address}</span></div>

                    {!isSavedbyOwner ? <button onClick={() => saveEvent(id)} className=" cursor-pointer flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2"><FaBookmark size={18} />Save</button>
                      :
                      <button onClick={() => toggleDropdownEvent(id)} className=" flex items-center justify-center  gap-1 border-none w-full rounded-3xl bg-[#ABB7CC] px-4 py-2">Saved <FaChevronDown size={12} /></button>}

                    {eventsButtonDropdown === id && <div className="   w-full flex flex-col gap-2 absolute top-90 p-4  items-start rounded-2xl bg-[#2F2F2F] shadow-xl z-50">
                      <button className="border-none background-none text-white cursor-pointer" onClick={() => goingToEvent(id)}>
                        Going
                      </button>
                      <button className="border-none background-none text-white cursor-pointer" onClick={() => unsaveEvent(id)}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" >
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative flex flex-col gap-2 h-[600px] overflow-y-auto relative">

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
                "https://img.freepik.com/free-photo/abstract-geometric-background-shapes-texture_1194-301824.jpg?semt=ais_hybrid&w=740&q=80"} className="object-cover  w-full h-full rounded-xl" />

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


{/* default  */}
              {/* <div className="flex gap-2">
                <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Date"></input>
                <input className="px-2 py-4 focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] rounded-xl focus:outline-none" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Time"></input>
              </div> */}

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

            <div className="relative" onClick={() => setSearchLocation(!searchLocation)}>
              <FaLocationDot size={20} className="absolute top-[50%] translate-y-[-50%] left-1 flex  items-center text-gray-400" />
              <input className="w-full px-7 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"></input>

            </div>
            {searchLocation && 
      <div className="absolute inset-0 top-[500px] z-100 flex items-center justify-center" >
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

          <div className="relative w-full">
                      <IoIosSearch size={22} className="absolute top-[50%] inset-y-0 translate-y-[-50%] left-1 flex  items-center text-gray-400" />

          <input value={locationQuery} onChange={(e)=>setLocationQuery(e.target.value)} className="w-full pl-6.5 px-1.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] ]"/>

          </div>
          <div className="flex flex-col gap-2 w-full overflow-auto ">
                 {locationResults.map((location,index)=>(
            <div className="w-full cursor-pointer hover:bg-[#FAF9F6] rounded-xl px-4 py-2" onClick={()=>{setLocation(location),setSearchLocation(false)}} key={index}>{location}</div>
          ))}

          </div>

     
    

        </div>
        </div>}



            <label className="font-semibold text-2xl">Add more details (optional)</label>
            <textarea className="resize-none w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description " />

          </div>
        </div>
      )}


     
 

    </div>
  );
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

