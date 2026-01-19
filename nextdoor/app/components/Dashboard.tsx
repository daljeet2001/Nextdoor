"use client"
import Link from "next/link"
import PostCard from "./PostCard";
import { useState, useEffect } from "react"
import { Bookmark, CalendarFold } from "lucide-react"

export default function Dashboard({ userId }: { userId: string }) {
    const [posts, setPosts] = useState<any>(null)

 

  
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

            <div className="md:col-span-3 space-y-4">
  <h3 className="text-2xl font-[620]" >Dashbaord</h3>

<div className="flex gap-4">

        <Link  href="/bookmark" className="flex shadow-sm rounded-3xl items-center gap-1 p-4 py-2"><Bookmark size={20}/> Bookmarks</Link>

              <button className="flex shadow-sm rounded-3xl items-center gap-1 p-4 py-2"><CalendarFold size={20}/> Events</button>
    

</div>


   

            </div>
        </div>

    )
}