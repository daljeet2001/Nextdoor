"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { IoIosArrowBack } from "react-icons/io";
import { PiDotsThree } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { ImCancelCircle } from "react-icons/im";

type Type = "members" | "admins";

interface GroupHeaderProps {
  group: any;
  setInvite: (value: boolean) => void
}


export default function GroupHeader({ group, setInvite }: GroupHeaderProps) {

  const { data: session, status } = useSession();




  const isOwner = group.ownerId === session?.user?.id;
  const isMember = group.members.some((m: any) => m.id === session?.user?.id) ?? false




  const leavegroup = async () => {

    try {

      const res = await fetch(`/api/group/${group.id}/leave`, {
        method: "POST"
      })

      if (!res.ok) {
        alert("Failed to leave group")
      }

      alert("Group left")

    } catch (e) {
      console.log("Error while leaving group", e);
      alert("Failed to leave group")
    }


  }





  const [membersOpen, setMembersOpen] = useState(false);
  const router = useRouter();
  const [type, setType] = useState<Type>("members");
  const [menu, setMenu] = useState(false);



  const joinMember = async () => {

    try {

      if (isOwner || isMember) {
        setInvite(true)
        return;
      }

      if (!session?.user?.id) {
        alert("Failed to join group")
        return;
      }

      const res = await fetch(`/api/group/${group.id}/join`, {
        method: "POST",
      })

      if (!res.ok) {
        alert("Failed to join group")
      }

      alert("Group joined")

    } catch (e) {
      console.log("Error while joining group", e);
      alert("Failed to join group");
    }

  }



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

      <div className="md:col-span-3 space-y-4">

        <div className="w-full h-auto flex flex-col rounded-2xl relative p-4">

          <img src={group?.image ? group.image :
            "https://img.freepik.com/free-photo/abstract-geometric-background-shapes-texture_1194-301824.jpg?semt=ais_hybrid&w=740&q=80"} className="object-cover rounded-t-3xl w-full h-[300px]" />
          <button className="p-2 rounded-full rounded-full bg-white border-none absolute top-6 left-6" onClick={() => router.back()}>
            <IoIosArrowBack size={28} />
          </button>
          {
            (isMember || isOwner) && <button className="p-2 rounded-full rounded-full bg-white border-none absolute top-6 right-6" onClick={() => setMenu(!menu)} >
              <PiDotsThree size={28} />
            </button>
          }



          {menu && <div

            className="absolute right-4 top-20 w-72 rounded-2xl bg-[#2F2F2F] shadow-xl border border-neutral-700 overflow-hidden z-50">












            <Menuitem
              icon={<ImCancelCircle size={20} />}
              title="Leave group"
              subtitle=""
              danger

              onClick={() => {
                setMenu(false)
                leavegroup()


              }}
            />






          </div>}

          <div className="flex flex-col p-4 shadow-sm rounded-b-3xl  w-full">

            <div className="text-3xl pt-2 font-[620]">{group?.name}</div>
            {group?.bio && group.bio.trim != "" &&
              <div className="text-lg text-black ">{group?.bio}</div>
            }


            <div className="flex justify-between items-center mt-2">



              <button onClick={joinMember} className="border-none rounded-3xl font-semibold text-black px-4 py-2 bg-[#9BA6B7] ">{(isMember || isOwner) ? "Invite" : "Join"} </button>

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


                      <Link href={`/profile/${member?.id}`} className="flex gap-2 items-center cursor-pointer" key={index}>
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