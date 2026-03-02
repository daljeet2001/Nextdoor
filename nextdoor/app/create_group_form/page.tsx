"use client"
import EditGroupHeader from "../components/EditGroupHeader"
import PostCard from "../components/PostCard";
import { useState, useEffect } from "react";
import CreatePostForm from "../components/CreatePostForm";
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaLink } from "react-icons/fa6";

import { ImagePlus } from "lucide-react";



interface EditGroupProps {
  group: any;
  setEditMenu: (value: boolean) => void;
}


export default function CreateGroup() {

  const searchParmas = useSearchParams();

  const groupId = searchParmas.get("groupId");
  const [group, setGroup] = useState<any>(null);
  const router = useRouter();
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [editMenu, setEditMenu] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [refetch, setRefetch] = useState(false);
  const { data: session, status } = useSession();

  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [invite, setInvite] = useState(false);
  const [url, setUrl] = useState("");





  useEffect(() => {


    async function Fetch() {

      try {
        const res = await fetch(`/api/group/${groupId}`);

        if (!res.ok) {
          alert("Failed to fetch group")
          return;
        }
        const data = await res.json();
        console.log("group in create group page", data)
        setGroup(data)
        setGroupName(data.name)
        setGroupDescription(data.bio || "")
        setPosts(data.posts)
        setIsOwner(data.ownerId === session?.user?.id)
        setIsMember(data.members.includes((m: any) => m.id === session?.user?.id))
        setUrl(typeof window != "undefined" ? `${window.location.origin}/group/${data.id}` : "")

      } catch (e) {
        console.log("Error fetching group", e);
        alert("Something went wrong")
      }
    }


    async function Fetch2() {
      const res = await fetch("/api/group/me");

      if (!res.ok) {
        alert("Failed to fetch your groups");
        return
      }

      const data = await res.json();
      console.log("my groups in create group form", data)
      const groups = data.filter((g: any) => g.id !== groupId);
      setMyGroups(groups)

    }

    Fetch();
    Fetch2()


  }, [groupId, refetch, session])


  const copyUrl = async () => {
    navigator.clipboard.writeText(url);
    setInvite(false);
    alert("Link copied")

  }


  const saveDetails = async () => {

    if (groupName.trim() === "" || groupDescription?.trim() === "") {
      alert("Missing fields")
      return
    }

    const res = await fetch(`/api/group/${group.id}/save/name_description`, {
      method: "POST",
      body: JSON.stringify({
        groupName,
        groupDescription
      })
    })

    if (!res.ok) {
      alert("Failed to save name and description")
    }



    alert("Changes saved successfully");
    setRefetch(true);

  }




  const handleRemovePosts = (postId: string) => {
    setPosts((prev) => prev.filter(p => p.id !== postId))
  }



  const [posts, setPosts] = useState<any[]>([
  ]);
  const [open5, setOpen5] = useState(false);
  const neighborhoodId = session?.user?.neighborhoodId;




  return (
    <>
      {group ?
        <div className=" grid grid-cols-1 md:grid-cols-4 gap-8 w-full">

          <div className="flex flex-col space-y-2 w-full md:col-span-2">

            <EditGroupHeader group={group} setEditMenu={setEditMenu} setInvite={setInvite} />

            {invite && <div className="fixed inset-0 justify-center items-center bg-white/40  flex z-100">
              <div className="flex flex-col gap-2 bg-white w-full max-w-2xl rounded-xl p-6">

                <div className="font-bold text-2xl"> Share a invitation link </div>
                <div className="">Invite anyone to view and join this group. Using this link, people can either join or request to join the group, depending on the group's privacy setting.</div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">

                    <div className="rounded-full w-6 h-6 bg-[#FAF9F6] flex items-center jutify-center"><FaLink size={24} color={"black"} /></div>
                    <div className="font-bold">{url}</div>

                  </div>
                  <button className="px-4 py-2 rounded-full text-white bg-[#0D1164] hover:bg-[#1a1e85]" onClick={copyUrl}>Copy</button>



                </div>

              </div>

            </div>}



            {editMenu && <div className="fixed inset-0 flex items-center justify-center z-[60]">

              <div className="absolute inset-0 bg-white/40" onClick={() => setEditMenu(false)}>
              </div>

              <div className="relative z-10 w-[450px] h-auto  rounded-2xl bg-white p-8 shadow-xl flex flex-col gap-2 ">
                <h3 className="text-2xl font-semibold text-black ">
                  Edit group name and description
                </h3>
                <div className="relative w-full px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] ">
                  <label className="absolute top-1 left-4 mt-2">Name</label>

                  <input className=" mt-4 w-full px-2  focus:outline-none bg-none " value={groupName} onChange={(e) => setGroupName(e.target.value)}></input>

                </div>


                <div className="relative w-full px-2 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6] ">
                  <label className="absolute top-1 left-4 mt-2">Description</label>

                  <input className=" mt-4 w-full px-2  focus:outline-none bg-none " value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} placeholder="Add a description"></input>

                </div>

                <div className="mt-4 flex justify-end gap-3">

                  <button onClick={() => setEditMenu(false)} className={`px-4 py-2 rounded-full text-sm text-[#ABB7CC]`}>Cancel</button>

                  <button
                    onClick={() => {
                      setEditMenu(false),
                        saveDetails()

                    }
                    }
                    className="px-4 py-2 rounded-full text-white bg-[#0D1164] hover:bg-[#1a1e85] font-semibold  transition"
                  >Save</button>



                </div>
              </div>

            </div>}





            {open5 && (
              <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-100">
                <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Post</h2>
                    <button
                      onClick={() => setOpen5(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <CreatePostForm
                    neighborhoodid={neighborhoodId ?? ""}
                    onCreated={(p) => {
                      setPosts((s: any) => [p, ...s]);
                      setOpen5(false);
                    }}
                    groupId={group.id}
                  />
                </div>
              </div>
            )}

            <div className="h-[800px] overflow-y-auto space-y-4 pr-2 rounded-lg p-3">

              {
                (isOwner || isMember) && <div className="flex gap-2 items-center border-1 p-2 border-[#ABB7CC] rounded-2xl" onClick={() => setOpen5(true)}>

                  {session?.user?.image && session?.user?.image?.trim() !== "" ? (<img className="w-[40px] h-[40px] rounded-full object-cover" src={session?.user?.image} />) : (<div className="bg-gray-200 text-gray-600 font-semibold flex items-center justify-center w-[40px] h-[40px] rounded-full ">{session?.user?.name ? session?.user?.name[0] : "U"}</div>)}


                  <input disabled={open5} className=" cursor-default w-full px-2 py-4 rounded-xl focus:outline-none  bg-[9BA6B7]" placeholder="Share something with the group ..." />

                </div>
              }




              {posts.map((post: any) => <PostCard key={post.id} post={post} onClose={handleRemovePosts} />)}
              {posts?.length === 0 && <p>No posts yet</p>}
            </div>

          </div>


          <aside className="md:col-span-1">

            <div className="flex flex-col gap-4 items-start justify-center">
              <h2 className="font-semibold text-lg">Your groups</h2>

              <div className="flex flex-col gap-2 items-start justify-start">
                {myGroups.length !== 0 ? myGroups.map((group, index) => {

                  const isOwner = session?.user?.id === group.ownerId

                  if (isOwner) {
                    return (
                      <div onClick={() => router.push(`/create_group_form?groupId=${group.id}`)} className="flex items-center gap-2 cursor-pointer" key={index}>
                        <img className="w-8 h-8 rounded-full object-cover" src={group.image} />

                        {group?.image && group?.image?.trim() !== "" ? (<img className="w-8 h-8 rounded-full object-cover" src={group.image} />) : (<div className="bg-gray-200 text-gray-600 font-semibold flex items-center justify-center w-8 h-8 rounded-full ">{group?.name[0] ?? "U"}</div>)}
                        <div className="flex flex-col items-start justify-start">
                          <div className="text-sm font-medium">{group.name}</div>
                          <div className="text-xs text-[#ABB7CC] ">{group.members.length + 1} members</div>
                        </div>

                      </div>

                    )
                  }

                  else {
                    return (
                      <div onClick={() => router.push(`/group/${group.id}`)} className="flex items-center gap-2 cursor-pointer" key={index}>
                        {/* <img className="w-8 h-8 rounded-full object-cover" src={group.image} /> */}

                        {group?.image && group?.image?.trim() !== "" ? (<img className="w-8 h-8 rounded-full object-cover" src={group.image} />) : (<div className="bg-gray-200 text-gray-600 font-semibold flex items-center justify-center w-8 h-8 rounded-full ">{group?.name[0] ?? "U"}</div>)}
                        <div className="flex flex-col items-start justify-start">
                          <div className="text-sm font-medium">{group.name}</div>
                          <div className="text-xs text-[#ABB7CC] ">{group.members.length + 1} members</div>
                        </div>

                      </div>
                    )
                  }


                }) : <div>No groups found</div>}
              </div>




            </div>

          </aside>





        </div>
        :
        <div>
          Group not found
        </div>}
    </>

  )
}
