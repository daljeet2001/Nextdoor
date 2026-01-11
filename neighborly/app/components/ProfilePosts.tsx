"use client"

import PostCard from "../components/PostCard";
import { useState, useEffect } from "react"


export default function ProfilePosts({ userId }: { userId: string }) {
    const [posts, setPosts] = useState<any>(null)

    useEffect(() => {

        if (!userId) {
            return
        }



        const fetchUserPosts = async () => {

            const res = await fetch(`/api/profile/${userId}/posts`)
            if (res) {
                const data = await res.json()
                console.log("user posts are",data)
                setPosts(data)
            }

        }

        fetchUserPosts()

    }, [userId])

      const handleRemovePosts = (postId:string)=>{
    setPosts((prev:any)=>prev.filter((p:any)=>p.id !== postId))
  }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

            <div className="md:col-span-3 space-y-4">
  <h3 className="text-3xl" >Posts</h3>
             {posts?.map((post:any)=><PostCard key={post.id} post={post} onClose={handleRemovePosts}/>)}

             {posts?.length ===0 && <p>No posts yet</p> }
            </div>
        </div>

    )
}

