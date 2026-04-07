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
import { FaRegBookmark } from "react-icons/fa6";
import { TiUpload } from "react-icons/ti";
import Link from "next/link";
import Chat from "./Chat";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, BellOff, Bookmark, Pencil, Trash2, Lock, X, MessageSquare, BookmarkX, MessageSquareOff, Flag, FlagOff, VolumeOff, Volume } from "lucide-react";
import { IoIosSearch } from "react-icons/io";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { TbMessages } from "react-icons/tb";
import { AiFillMessage } from "react-icons/ai";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuWashingMachine } from "react-icons/lu";
import { FaTools } from "react-icons/fa";
import { TbMoodKid } from "react-icons/tb";
import { FaCar } from "react-icons/fa";
import { FaBicycle } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import Switch from '@mui/material/Switch';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { MdTableRestaurant } from "react-icons/md";
import { BiSolidCarGarage } from "react-icons/bi";
import { TbGardenCartFilled } from "react-icons/tb";
import { MdSell } from "react-icons/md";
import { GiGuitarBassHead } from "react-icons/gi";
import { TbHomeSearch } from "react-icons/tb";
import { MdOutlineSportsMotorsports } from "react-icons/md";
import { IoTicket } from "react-icons/io5";
import { TbTools } from "react-icons/tb";
import { TbHorseToy } from "react-icons/tb";
import { FaTv } from "react-icons/fa";
import { FaBaby } from "react-icons/fa";
import { HiHomeModern } from "react-icons/hi2";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
   import { IoCloseOutline } from "react-icons/io5";
import { timeAgo } from "@/lib/timeAgo";

  const CategoryOptions = [
    { value: "Appliances", label: "Appliances", icon: <LuWashingMachine /> },
    { value: "Automotive", label: "Automotive", icon: <FaCar /> },
    { value: "kids", label: "Baby & Kids", icon: <FaBaby /> },
    { value: "Bicycles", label: "Bicycles", icon: <FaBicycle /> },
    { value: "Clothing", label: "Clothing", icon: <GiClothes /> },
    { value: "Electronics", label: "Electronics", icon: <FaTv /> },

    { value: "Furniture", label: "Furniture", icon: <MdTableRestaurant /> },
    { value: "Garage sales", label: "Garage sales", icon: <BiSolidCarGarage /> },
    { value: "Garden", label: "Garden", icon: <TbGardenCartFilled /> },
    { value: "Home decor", label: "Home decor", icon: <HiHomeModern /> },
    { value: "Home sales", label: "Home sales", icon: <MdSell /> },
    { value: "Musical instruments", label: "Musical instruments", icon: <GiGuitarBassHead /> },
    { value: "Property rentals", label: "Property rentals", icon: <TbHomeSearch /> },
    { value: "Sports & outdoors", label: "Sports and outdoors", icon: <MdOutlineSportsMotorsports /> },
    { value: "Tickets", label: "Tickets", icon: <IoTicket /> },
    { value: "Tools", label: "Tools", icon: <TbTools /> },
    { value: "Toys & games", label: "Toys & games", icon: <TbHorseToy /> },

  ];




export default function ListingCard({ listing }: { listing: any }) {

  console.log("lisitng inside LisitngCard", listing);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname()

  const router = useRouter();
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(false);
  const [eventsButtonDropdown, setEventsButtonDropdown] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [editMenu, setEditMenu] = useState(false);
  const [seeMore, setSeeMore] = useState(listing.description.length > 100);
  const [allListing, setAllListing] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isOwner = session?.user?.id === listing.user.id;
  const [isListingSaved, setIsListingSaved] = useState(false)
  const [checked, setChecked] = useState(false);
  const [searchLocation, setSearchLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [ largeScreen, setLargeScreen ] = useState(false)


  



  const [eventLoading, setEventLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false)
  const evevntRef = useRef<HTMLInputElement>(null);


  const [price, setPrice] = useState(listing.price);
  const [listingImages, setListingImages] = useState(listing.images);
  const listingRef = useRef<HTMLInputElement>(null);
  const [listingName, setListingName] = useState(listing.name);
  const [listingDescription, setListingDescription] = useState(listing.description);
  const [selectedCategory, setSelectedcategory] = useState<any>(CategoryOptions.filter((category) => listing.category === category.value)[0]);
  const [listingCategory, setListingCategory] = useState(listing.category);
  const [priceDisable, setPriceDisable] = useState(false);
  const [listingLocation, setListingLocation] = useState(listing.location);
  const [allListings, setAllListings] = useState<any[]>([])



  const [categoryOpen, setcategoryOpen] = useState(false);

    const [ currentImage, setCurrentImage ] = useState(0);



    useEffect(()=>{

      setLargeScreen(window.innerWidth>=768)

    },[])
  useEffect(()=>{
setCurrentImage(0)
  },[listing])

  const nextImage = ()=>{
    setCurrentImage((prev)=>prev === listing.images.length-1 ? 0: prev+1)
  }

  const prevImage = ()=>{
    setCurrentImage((prev)=>prev === 0? listing.images.length-1 : prev-1)
  }


  const listingUrl = typeof window != "undefined" ? `${window.location.origin}/listing/${listing.id}` : "";

  const getAllListing = async () => {
    const res = await fetch("/api/listing");
    if (!res.ok) {
      alert("Failed to get listing");
      return
    }

 



    const listings = await res.json();

    const finalListings = listings.filter((li: any) => li.id !== listing.id)
    setAllListing(finalListings);
  }

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

  useEffect(() => {
    getAllListing()

    if (session?.user?.id) {
      setIsLoggedIn(true)
    }

    const newListing = listing.savedBy.filter((li: any) => li.userId === session?.user?.id)

    setIsListingSaved(newListing.length != 0)

  }, [session])

  const handleShare = {

    whatsapp: () => {
      const text = `${listing.body}\n${listingUrl}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    },

    facebook: () => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          listingUrl
        )}`,
        "_blank"
      );
    },

    twitter: () => {
      const text = listing.body;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(listingUrl)}`,
        "_blank"
      );
    },

    copy: async () => {
      await navigator.clipboard.writeText(listingUrl);
      alert("Link copied!");
    },
  };

  // const saleStock = [
  //   {
  //     image:"https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-right-side-view-10.jpeg?isig=0",
  //     name:"Bullet 350 standard",
  //     price:"50,000",
  //     createdAt:"2h ago",
  //     location:"Sunny enclave,Kharar",
  //     description:"This is the bullet stadard 350 which my dad bought me on my 21st birthday.",
  //   },
  //     {
  //     image:"https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-right-side-view-10.jpeg?isig=0",
  //     name:"Bullet 350 standard",
  //     price:"50,000",
  //     createdAt:"2h ago",
  //     location:"Sunny enclave,Kharar",
  //     description:"This is the bullet stadard 350 which my dad bought me on my 21st birthday.",
  //   },
  //     {
  //     image:"https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-right-side-view-10.jpeg?isig=0",
  //     name:"Bullet 350 standard",
  //     price:"50,000",
  //     createdAt:"2h ago",
  //     location:"Sunny enclave,Kharar, Punjab, 140507",
  //     description:"This is the bullet stadard 350 which my dad bought me on my 21st birthday.",
  //   },
  // ]




  // useEffect(() => {
  //   function handleClickOutside(e: MouseEvent) {
  //     if (menuRef.current && !menuRef.current?.contains(e.target as Node)) {
  //       setMenu(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside)
  //   return () => document.removeEventListener("mousedown", handleClickOutside)

  // }, [])



  function convertToISODate(dateStr: string) {
    return new Date(dateStr).toISOString().split("T")[0];
  }

  function convertTo24Time(timeStr: string) {
    const d = new Date(`1970-01-01 ${timeStr}`);
    return d.toTimeString().slice(0, 5);
  }

  async function saveListing(id: string) {
    try {
      const res = await fetch(`/api/listing/save/${id}`, {
        method: "POST"
      }
      )

      if (!res.ok) {
        alert("Failed to save listing")
        return
      }
      alert("Listing saved successfully")
      setIsListingSaved(true);

    } catch (e) {
      console.log(e);
      alert("Something went wrong")
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setPrice("0");
    setPriceDisable(!priceDisable)
  };

  async function unsaveListing(id: string) {
    try {
      const res = await fetch(`/api/listing/unsave/${id}`, {
        method: "POST"
      }
      )

      if (!res.ok) {
        alert("Failed to unsave listing")
        return
      }
      alert("Listing unsaved successfully")
      setIsListingSaved(false)


    } catch (e) {
      console.log(e);
      alert("Something went wrong")
    }
  }



  //   const handleEventImageUpload = async(file?:File)=>{

  //     if(!file){
  //       return
  //     }

  //     const formData = new FormData();
  //     formData.append("file",file);

  //     const res = await fetch("/api/upload",{
  //       method:"POST",
  //       body:formData
  //     })

  //     if(!res.ok){
  //       alert("Faied to upload event image")
  //     }

  //     const data = await res.json()
  //     setEventCover(data.url)
  //   }


  const handleEditListing = async () => {
    setListingLoading(true);

    const res = await fetch(`/api/listing/${listing.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name: listingName,
        description: listingDescription,
        images: listingImages,
        category: listingCategory,
        price,
        location: listingLocation
      })
    });

    if (!res.ok) {
      alert("Failed to edit listing")
      setListingLoading(false)
      return;
    }

    setListingLoading(false);
    setEditMenu(false);
    alert("Listing edited successfully")


  }




  const handleDeletePost = async () => {

    try {
      const res = await fetch(`/api/listing/${listing.id}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        throw new Error("Failed to delete listing")
      } else {
        alert("Listing deleted successfully")
      }

    } catch (e) {
      console.log(e);
      alert("Failed to delete listing")
    }
  }

  const handleHideListing = async () => {
    try {

      const res = await fetch(`/api/listing/hide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id })
      })

      if (!res.ok) {
        throw new Error("Failed to hide listing")
      } else {
        alert("Listing hidden successfully")

      }

    } catch (e) {
      console.log(e)
      alert("Failed to hide listing")
    }
  }

  const handleMute = async () => {

    const res = await fetch("/api/user/mute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mutedId: listing.user.id })
    })

    if (res.ok) {
      alert(`You won't see posts from ${listing.user.name} anymore`)
    }
  }

  const handleReport = async () => {
    const res = await fetch("/api/listing/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: listing.id })
    })
    if (res.ok) {
      alert("Listing reported. Thanks for helping keep the community safe.")
    }
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

    setListingImages(data.url)

  }

  //   async function saveEvent(id: string) {
  //     try {
  //       const res = await fetch(`/api/event/save/${id}`, {
  //         method: "POST"
  //       }
  //       )

  //       if (!res.ok) {
  //         alert("Failed to save event")
  //         return
  //       }
  //       alert("Event saved successfully")
  //       setEventSaved(true)


  //     } catch (e) {
  //       console.log(e);
  //       alert("Something went wrong")
  //     }
  //   }

  //   async function unsaveEvent(id: string) {
  //     try {
  //       const res = await fetch(`/api/event/unsave/${id}`, {
  //         method: "POST"
  //       }
  //       )

  //       if (!res.ok) {
  //         alert("Failed to unsave event")
  //         return
  //       }
  //       alert("Event unsaved successfully")
  //       // setRefetchEvents2(true)
  //       toggleDropdownEvent(id)

  //     } catch (e) {
  //       console.log(e);
  //       alert("Something went wrong")
  //     }
  //   }

  //   async function goingToEvent(id: string) {
  //     try {
  //       const res = await fetch(`/api/event/going/${id}`, {
  //         method: "POST"
  //       }
  //       )

  //       if (!res.ok) {
  //         alert("Going failed")
  //         return
  //       }
  //       alert("Going successfully")
  //       toggleDropdownEvent(id)

  //     } catch (e) {
  //       console.log(e);
  //       alert("Something went wrong")
  //     }
  //   }

  //   async function toggleDropdownEvent(id: string) {
  //     setEventsButtonDropdown((prev) => prev === id ? null : id)
  //   }

  return (
    <>
      <div className="flex items-start gap-4 p-4 lg:flex-nowrap flex-wrap ">
        <div className="flex flex-col w-full  md:w-[60%] items-start h-auto">
          {/* <img className="object-cover rounded-3xl w-full h-[450px]" src={listing.image} alt="event-image" /> */}
              {
                      listing?.images?.length>0 &&       
                       <div className="relative w-full mt-2">
            
                        {
                          listing?.images?.length>1 &&    <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 w-8 h-8 rounded-full flex items-center justify-center" onClick={prevImage}><GrPrevious size={20}/></button>
                        }
            
                     
              
                              <img src={listing?.images[currentImage]?.url} alt="post image" className="w-full h-[450px]  rounded-3xl object-cover" />
            
                    {
                          listing?.images?.length>1 &&    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 w-8 h-8 rounded-full flex items-center justify-center" onClick={nextImage}><GrNext size={20}/></button>
                        }
            
            
                        {listing?.images?.length>1&& <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                        {listing.images.map((_:any,index:number)=>
            
                        <div key={index} className={`w-4 h-2 rounded-xl ${index === currentImage? "bg-white":"bg-white/40"} `}></div>
                        )}
                          </div>}
                    
            
                     
                    </div>
                    }

   {largeScreen && <div className="w-full overflow-y-auto pr-2 p-3 flex flex-wrap gap-2 space-y-1 rounded-lg">
      <div className="font-bold text-3xl">More listings near you</div>
      {allListing.length > 0 ? (allListing.map((listing, index) => {
        const address = listing.location.split(" ");
        console.log("address", address)
        return (
          <Link href={`/listing/${listing.id}`} key={index} className="w-[195px] h-[280px] p-2 flex flex-col items-start justify-center cursor-pointer">
            <img src={listing?.images[0]?.url} alt="listing_image" className="w-[188px] h-[188px] rounded-xl object-cover" />


                


            <div className="text-sm font-semibold mt-1">₹{listing.price}</div>
            <div className="text-sm font-semibold">{listing.name}</div>
            <div className="text-xs font-semibold text-[#ABB7CC] truncate">{timeAgo(listing.createdAt)} . {listing.location.slice(0, 20)}</div>
          </Link>
        )


      }

      )) : (<div>No listings found near you</div>)}

    </div>  } 

        </div>


        <div className="min-h-[450px]  md:w-[40%] w-full rounded-3xl border-1 border-[#ABB7CC] p-4 flex flex-col items-start h-auto ">

          <div className="flex justify-between items-center w-full relative">
            <div className="text-2xl font-bold whitespace-normal">{listing.name}</div>
            <div className="flex items-center gap-2">
              {isListingSaved ?
                <button disabled={!isLoggedIn} className={` ${!isLoggedIn ? "cursor-not-allowed" : ""} border-none`} onClick={() => unsaveListing(listing.id)}>
                  <FaBookmark size={24} />
                </button> :
                <button disabled={!isLoggedIn} className={` ${!isLoggedIn ? "cursor-not-allowed" : ""} border-none`} onClick={() => saveListing(listing.id)}>
                  <FaRegBookmark size={24} />
                </button>}

                <div className="relative">
              <button ref={menuButton} disabled={!isLoggedIn} onClick={() => setMenu(!menu)} className={` ${!isLoggedIn ? "cursor-not-allowed" : ""} border-none`}>
                <PiDotsThree size={28} />
              </button>
              {menu && <div
                ref={menuRef}
                className="absolute right-0 top-10 w-72 rounded-2xl bg-[#2F2F2F] shadow-xl border border-neutral-700 overflow-hidden z-50">

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
                      title={`Mute ${listing.user.name}`}
                      subtitle="Hide all posts from this neighborhood"
                      onClick={() => {
                        setMenu(false);
                        handleMute()
                      }}
                    />

                    <Menuitem
                      icon={<X size={20} />}
                      title="Hide"
                      subtitle="Remove listing from your feed"
                      onClick={() => {
                        setMenu(false)
                        handleHideListing()
                      }}
                    />
                  </>

                )}

                {isOwner && (
                  <>


                    <Menuitem
                      icon={<Pencil size={20} />}
                      title="Edit"
                      subtitle="Upadte the content of your listing"
                      onClick={() => {
                        setMenu(false)
                        setEditMenu(true)

                      }}
                    />
                    <Menuitem
                      icon={<Trash2 size={20} />}
                      title="Delete"
                      subtitle="Permanently remove listing"
                      danger

                      onClick={() => {
                        setMenu(false)
                        setDeleteMenu(true)

                      }}
                    />
                  </>

                )}

              </div>}
              </div>
            </div>
          </div>

          <div className="font-bold text-lg text-[#ABB7CC] flex items-center"><FaIndianRupeeSign />{listing.price}</div>

          <div className="flex items-start gap-3 mt-2">
            <Link href={`/profile/${listing?.user?.id}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
              {/* {post.user?.name?.[0] ?? "U"} */}

              {listing.user?.image && listing.user.image.trim() != "" ? (<img src={listing.user.image} alt="profile_img" className="w-full h-full rounded-full" />) : (<div className="">{listing.user?.name?.[0].toUpperCase() ?? "U"}</div>
              )}

            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                {listing.user?.name ?? listing.user?.email}
              </div>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                {listing?.user?.city} · {timeAgo(listing.createdAt)} ago
              </div>
            </div>
          </div>
          {
            seeMore ?
              <div className="text-sm font-normal  mt-2">{listing.description.slice(0, 100)}<button onClick={() => setSeeMore(false)} className="text-[#ABB7CC]  font-bold">see more</button></div> :
              <div className="text-sm w-full  font-normal mt-2">{listing.description} </div>
          }

             <p className="text-sm justify-start flex items-start gap-1 text-[#ABB7CC]">{listing.location}</p>

          <div className="text-sm font-normal text-[#ABB7CC] mt-2">{timeAgo(listing.createdAt)}</div>

          <button disabled={!isLoggedIn} onClick={() => setChatOpen(true)} className={` ${!isLoggedIn ? "cursor-not-allowed" : "cursor-pointer"} mt-2 w-full border-1  py-4 px-2 flex items-center gap-2 rounded-xl text-sm font-bold`}><TbMessages size={28} />Send {listing?.user?.name} a mesage</button>


          <div className="flex flex-col gap-2 mt-4">
            <div className="text-2xl font-bold">Share lisitng</div>
            <div className="flex items-center justify-start gap-4">
              <ShareItem icon="/fb.png" label="Facebook" onClick={handleShare.facebook} />
              <ShareItem icon="/whatsapp.png" label="WhatsApp" onClick={handleShare.whatsapp} />
              <ShareItem icon="/x.png" label="X" onClick={handleShare.twitter} />
              <ShareItem icon="/lnk.png" label="Copy link" onClick={handleShare.copy} />
            </div>
          </div>

          {/* <div className="px-4 py-2 rounded-3xl bg-[#ABB7CC] mt-4 flex items-center flex items-start"><div><MdLocationOn size={24} /></div>
            <div>{listing.location}</div></div> */}

                   






        </div>

        {/* Chat Popup */}
        {chatOpen && (
          <div className="fixed inset-0 bg-white/40  flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-lg">
              {/* Close button */}
              <button
                onClick={() => setChatOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
       < IoCloseOutline size={24}/>

              </button>

              <Chat userId={listing.user.id} userName={listing.user.name ?? "User"} optimistic={false} />
            </div>
          </div>
        )}

        {
          deleteMenu && (
            <div className="fixed inset-0 flex justify-center items-center z-[60]">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteMenu(false)}>
              </div>
              {/* Model */}
              <div className="relative z-10 w-[320px]  rounded-2xl bg-[#2F2F2F] p-4 shadow-xl ">
                <h3 className="text-lg font-semibold text-white ">
                  Delete Listing?
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Your listing will be permanently removed.
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

        {editMenu && <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="  bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative flex flex-col gap-2 h-[600px] overflow-y-auto">

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
                disabled={listingLoading}
                className=" font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full block"
                onClick={handleEditListing}
              >
                {listingLoading ? "Posting..." : "Post"}
              </button>



            </div>

            <div className=" relative h-[121px] w-full">

           

                  {listingImages?.length>0 && (
                  <div className="flex w-full flex-wrap gap-2">
               {           listingImages?.map((editImage:any,index:number)=>(
                          <div key={index} className="relative w-30 shrink-0">
                  <img src={editImage.url} className="rounded-xl w-28 h-28 object-cover"/>
                              <button onClick={
                          ()=>
                               setListingImages(listingImages.filter((_:any,i:number)=>i!==index))
                                } className="absolute right-2 top-0 rounded-full">
                <IoCloseOutline size={24} color={"white"} />
              
              </button>

  
        
                  </div>

                  ))}
                  </div>
            
            
                )}

          

           

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
            <div className="relative" onClick={() => setSearchLocation(!searchLocation)}>
              <FaLocationDot size={20} className="absolute top-[50%] translate-y-[-50%] left-1 flex  items-center text-gray-400" />
              <input disabled={searchLocation} className="w-full px-7 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] " value={listingLocation} onChange={(e) => setListingLocation(e.target.value)}></input>
            
            </div>
          


    {searchLocation &&
              <div className="fixed inset-0  z-100 flex items-center justify-center" >
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

                    <input value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} className="w-full pl-6.5 px-1.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] ]" />

                  </div>
                  <div className="flex flex-col gap-2 w-full overflow-auto ">
                    {locationResults.map((location, index) => (
                      <div className="w-full cursor-pointer hover:bg-[#FAF9F6] rounded-xl px-4 py-2" onClick={() => { setListingLocation(location), setSearchLocation(false) }} key={index}>{location}</div>
                    ))}

                  </div>




                </div>
              </div>}





          </div>
        </div>}


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




function ShareItem({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 hover:opacity-80">
      <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
        <img src={icon} alt={label} className="w-6 h-6"></img>
      </div>
      <span className="text-xs text-gray-800">{label}</span>
    </button>
  )
}

