"use client"
import EditGroupHeader from "../components/EditGroupHeader"
import PostCard from "../components/PostCard";
import { useState, useEffect} from "react";
import CreatePostForm from "../components/CreatePostForm";
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { ImagePlus } from "lucide-react";






export default function CreateGroup(){

  const searchParmas = useSearchParams();
  const groupId = searchParmas.get("groupId");
  const [ group, setGroup ] = useState<any>(null);
  const router = useRouter();
  const [ myGroups,setMyGroups ] = useState<any[]>([])




  useEffect(()=>{

    async function Fetch(){

      try{
      const res = await fetch(`/api/group/${groupId}`);

      if(!res.ok){
        alert("Failed to fetch group")
        return;
      }
      const data = await res.json();
      console.log("group in create group page",data)
      setGroup(data)

      }catch(e){
        console.log("Error fetching group",e);
        alert("Something went wrong")
      }
    }


    async function Fetch2(){
      const res = await fetch("/api/gropup/me");

      if(!res.ok){
        alert("Failed to fetch your groups");
        return
      }

      const data = await res.json();
     const groups = data.filter((g:any)=>g.id !== groupId);
      setMyGroups(groups)

    }

    Fetch();


  },[groupId])


  

   const handleRemovePosts = (postId: string) => {
    setPosts((prev) => prev.filter(p => p.id !== postId))
  }

  const { data:session,status } =  useSession();

    const [posts, setPosts] = useState<any[]>([
    ]);
    const [ open,setOpen ] = useState(false);
    const neighborhoodId = session?.user?.neighborhoodId;




    return (
        <>
          {group? 
          <div className=" grid grid-cols-1 md:grid-cols-4 gap-8 w-full">

            <div className="flex flex-col space-y-2 w-full md:col-span-2">

            <EditGroupHeader group={group}/>

    



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

            <div className="h-[800px] overflow-y-auto space-y-4 pr-2 rounded-lg p-3">

                   <div className="flex gap-2 items-center border-1 p-2 border-[#ABB7CC] rounded-2xl" onClick={()=>setOpen(true)}>

                   {group?.image && group?.image?.trim() !== "" ?    ( <img className="w-[40px] h-[40px] rounded-full object-cover" src={group.image}/>): ( <div className="bg-gray-200 text-gray-600 font-semibold flex items-center justify-center w-[40px] h-[40px] rounded-full ">{group?.name[0] ?? "U"}</div>)}


                   <input disabled={open} className=" cursor-default w-full px-2 py-4 rounded-xl focus:outline-none  bg-[9BA6B7]" placeholder="Share something with the group ..."/>

        </div> 
   

          {posts.map((post: any) => <PostCard key={post.id} post={post} onClose={handleRemovePosts} />)}
          {posts?.length === 0 && <p>No posts yet</p>}
        </div>

            </div>


     <aside className="md:col-span-1">

        <div className="flex flex-col gap-4 items-start justify-center">
          <h2 className="font-semibold text-lg">Your groups</h2>

          <div className="flex flex-col gap-2 items-start justify-start">
            { myGroups.length !== 0 ? myGroups.map((group,index)=>{

              const isOwner = session?.user?.id === group.ownerId

if(isOwner){
  return(
             <div onClick={()=>router.push(`/create_group_form?groupId=${group.id}`)} className="flex items-center gap-2 cursor-pointer" key={index}>
                <img className="w-8 h-8 rounded-full object-cover" src={group.image}/>

                      {group?.image && group?.image?.trim() !== "" ?    ( <img className="w-8 h-8 rounded-full object-cover" src={group.image}/>): ( <div className="bg-gray-200 text-gray-600 font-semibold flex items-center justify-center w-8 h-8 rounded-full ">{group?.name[0] ?? "U"}</div>)}
                <div className="flex flex-col items-start justify-start">
                  <div className="text-sm font-medium">{group.name}</div>
                  <div className="text-xs text-[#ABB7CC] ">{group.members.length +1 } members</div>
                </div>

              </div>

)
}

else{
      <div onClick={()=>router.push(`/group/${group.id}`)} className="flex items-center gap-2 cursor-pointer" key={index}>
                <img className="w-8 h-8 rounded-full object-cover" src={group.image}/>

                      {group?.image && group?.image?.trim() !== "" ?    ( <img className="w-8 h-8 rounded-full object-cover" src={group.image}/>): ( <div className="bg-gray-200 text-gray-600 font-semibold flex items-center justify-center w-8 h-8 rounded-full ">{group?.name[0] ?? "U"}</div>)}
                <div className="flex flex-col items-start justify-start">
                  <div className="text-sm font-medium">{group.name}</div>
                  <div className="text-xs text-[#ABB7CC] ">{group.members.length +1 } members</div>
                </div>

              </div>

}

   
}):<div>No groups found</div>}
          </div>




        </div>

        </aside>

         



          </div>
          :
          <div>
            Group not found
            </div>}
        </>
              
    )}
