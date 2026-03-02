"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { IoIosArrowBack } from "react-icons/io";
import { PiDotsThree } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { TiUpload } from "react-icons/ti";
import { HiCloudUpload } from "react-icons/hi";
import { ImagePlus } from "lucide-react";
import { Globe, BellOff, Bookmark, Pencil, Trash2, Lock, X, MessageSquare, BookmarkX, MessageSquareOff, Flag, FlagOff, VolumeOff, Volume } from "lucide-react";


type Type = "members" | "admins";
interface EditGroupProps {
  group: any;
  setEditMenu: (value: boolean) => void;
  setInvite: (value: boolean) => void;
}



export default function EditGroupHeader({ group, setEditMenu, setInvite }: EditGroupProps) {

  const { data: session, status } = useSession();
  // console.log("sessiopn in profileGeader",session);

  const isOwner = session?.user?.id === group.ownerId

  const [membersOpen, setMembersOpen] = useState(false);
  const router = useRouter();
  const [type, setType] = useState<Type>("members");
  const groupRef = useRef<HTMLInputElement>(null);
  const [groupImage, setGroupImage] = useState(group?.image);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [deleteMenu, setDeleteMenu] = useState(false);


  const handleImageUpload = async (file?: File) => {

    if (!file) {
      return
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    })

    if (!res.ok) {
      alert("Faied to upload group image")
    }

    const data = await res.json()


    const result = await saveImage(data.url)
    // console.log("result in save image",result)
    setGroupImage(result)
  }


  const handleDeleteGroup = async () => {

    try {
      const res = await fetch(`/api/group/${group.id}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        throw new Error("Failed to delete group")
      } else {
        alert("Group deleted successfully")
      }

    } catch (e) {
      console.log(e);
      alert("Failed to delete group")
    }
  }


  const saveImage = async (image: string) => {

    // console.log("image inside saveimage fn",image)

    if (!image) {
      alert("Failed to save image")
      return;
    }

    const res = await fetch(`/api/group/${group.id}/save/image`, {
      method: "POST",
      body: JSON.stringify({
        image
      })
    })


    if (!res.ok) {
      alert("Failed to save image")
    }

    const data: any = await res.json();

    // console.log("data from save image api",data)
    return data.image


  }






  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

      <div className="md:col-span-3 space-y-4">

        <div className="w-full h-auto flex flex-col rounded-2xl relative p-4">

          <div className="relative w-full">
            <img src={groupImage ? groupImage :
              "https://img.freepik.com/free-photo/abstract-geometric-background-shapes-texture_1194-301824.jpg?semt=ais_hybrid&w=740&q=80"} className="object-cover rounded-t-3xl w-full h-[300px]" />
            <button className="rounded-full bg-white border-none absolute bottom-2 right-2 p-2" onClick={() => groupRef?.current?.click()}><ImagePlus size={24} /> </button>

            <input
              type="file"
              ref={groupRef}
              accept="/*image"
              hidden
              onChange={(e) => handleImageUpload(e.target?.files?.[0])}
            />




          </div>


          <button className="p-2 rounded-full rounded-full bg-white border-none absolute top-6 left-6" onClick={() => router.back()}>
            <IoIosArrowBack size={28} />
          </button>
          <button className="p-2 rounded-full rounded-full bg-white border-none absolute top-6 right-6" onClick={() => setMenu(!menu)} >
            <PiDotsThree size={28} />
          </button>

          {menu && <div
            ref={menuRef}
            className="absolute right-4 top-20 w-72 rounded-2xl bg-[#2F2F2F] shadow-xl border border-neutral-700 overflow-hidden z-50">









            {isOwner && (
              <>


                <Menuitem
                  icon={<Pencil size={20} />}
                  title="Edit name and description"
                  subtitle=""
                  onClick={() => {
                    setMenu(false);
                    setEditMenu(true);


                  }}
                />
                <Menuitem
                  icon={<Trash2 size={20} />}
                  title="Delete group"
                  subtitle=""
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
                    Delete Group?
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    Your group will be permanently removed.
                  </p>
                  <div className="mt-4 flex justify-end gap-3">

                    <button onClick={() => setDeleteMenu(false)} className={`px-4 py-2 rounded-full text-sm text-neutral-300 hover:bg-neutral-700 transition`}>Cancel</button>

                    <button
                      onClick={() => {
                        setDeleteMenu(false)
                        //delete api
                        handleDeleteGroup()
                      }
                      }
                      className="px-4 py-2 rounded-full bg-red-500 font-semibold text-white hover:bg-red-600 transition"
                    >Delete</button>



                  </div>
                </div>

              </div>
            )
          }


          <div className="flex flex-col p-4 shadow-sm rounded-b-3xl  w-full">

            <div className="text-3xl pt-2 font-[620]">{group?.name}</div>
            {group?.bio && group.bio.trim != "" &&
              <div className="text-lg text-black ">{group?.bio}</div>
            }


            <div className="flex justify-between items-center mt-2">

              <button className="border-none rounded-3xl font-semibold text-black px-4 py-2 bg-[#9BA6B7]" onClick={() => setInvite(true)}>Invite</button>

              <div className="text-base font-semibold text-[#ABB7CC] cursor-pointer" onClick={() => setMembersOpen(true)}>{group.members.length + 1} members</div>


              {membersOpen && <div className=" fixed inset-0 flex justify-center items-center bg-white/40 z-100  ">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl ">
                  <div className="w-full flex items-center justify-between">
                    <h2 className="font-bold text-2xl">Membership</h2>

                    <button
                      onClick={() => setMembersOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => setType("members")} className={`text-black ${type === "members" ? "border-b border-black" : ""}`}>Members</button>
                    <button onClick={() => setType("admins")} className={`text-black ${type === "admins" ? "border-b border-black" : ""}`}>Admins</button>

                  </div>

                  {type === "members" && <div className="flex flex-col gap-2 overflow-y-auto h-[300px] p-2 mt-1">

                    {group?.members?.map((member: any, index: number) => (


                      <Link href={`/profile/${group?.owner?.id}`} className="flex gap-2 items-center cursor-default" key={index}>
                        {member?.image && member?.image?.trim() !== "" ? (<img className="h-[40px] w-[40px] rounded-full object-cover" src={member.image} alt="Img" />) : (<div className="flex items-center justify-center h-[40px] w-[40px] font-semibold rounded-full bg-gray-200 text-gray-600 ">
                          {member?.name[0].toUpperCase() ?? "U"}
                        </div>)}

                        <div className="flex flex-col items-start">
                          <div className="font-semibold text-base">{member.name}</div>
                          <div className="text-sm">{member?.location}</div>

                        </div>

                      </Link>





                    ))}


                  </div>
                  }

                  {type === "admins" && <div className="flex flex-col gap-2 overflow-y-auto h-[300px] p-2 mt-1">




                    <Link href={`/profile/${group?.owner?.id}`} className="flex gap-2 items-center cursor-pointer">
                      {group?.owner?.image && group?.ower?.image?.trim() !== "" ? (
                        <img className="h-[40px] w-[40px] rounded-full object-cover" src={group?.owner?.image} alt="Img" />) : (<div className="flex items-center justify-center h-[40px] w-[40px] font-semibold rounded-full bg-gray-200 text-gray-600 ">
                          {group?.owner?.name[0].toUpperCase() ?? "U"}
                        </div>)}

                      <div className="flex flex-col items-start">
                        <div className="font-semibold text-base">{group?.owner?.name}</div>
                        <div className="text-sm">{group?.owner?.address}</div>

                      </div>


                    </Link>







                  </div>
                  }
                </div>

              </div>
              }

            </div>


          </div>

        </div>

      </div>

    </div>


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
      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-700 transition ${danger ? "text-red-400" : "text-white"}`}
    >
      <div className="">{icon}</div>
      <div>
        <p className="font-semibold leading-tight">{title}</p>

      </div>
    </button>
  )
}