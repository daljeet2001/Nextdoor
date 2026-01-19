
"use client"
import PostCard from "@/app/components/PostCard";
import { useState,useEffect } from "react"
import  { useRouter } from "next/navigation"
import { IoIosArrowBack } from "react-icons/io";
export default  function Bookmark( ) {

    const router = useRouter();
    const [ posts,setPosts ] = useState<any[]>([])

    useEffect(()=>{

      async function fetchPosts(){
        const res = await fetch("/api/posts/bookmark")

          const result = await res.json()
          console.log("result in bookmark",result)
        setPosts(result)
      }

    fetchPosts()

    },[])
  const handleRemovePosts = (postId:string)=>{
    setPosts((prev)=>prev.filter(p=>p.id !== postId))
  }


    
    return (
        <>

        <div className="max-w-2xl">
                <div className="flex  items-center gap-2 px-4 py-3 ">
            
                        <button className="p-2 rounded-full" onClick={()=>router.back()}>
                          <IoIosArrowBack size={28} />
                        </button>
                        <h1 className="text-lg font-semibold">Bookmarks</h1>
            
                      </div>
     <div className="h-[800px] overflow-y-auto pr-2 space-y-3  rounded-lg p-3">
                      {posts.length>0? 
                      posts.map((p:any)=>(<PostCard key={p.id} post={p} onClose={handleRemovePosts}/>)):
                      <div className="w-full flex items-center justify-center">No bookmarks</div>

                     
                      
                         }
                         </div>
        </div>
                   

        </>
    )
}
