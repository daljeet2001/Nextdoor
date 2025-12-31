"use client"

import { NextResponse } from "next/server"
import { useState, useEffect } from "react"


export default function Comment({ postId, setCommentsCount}: {postId: string , setCommentsCount:(count:number)=>void}) {
    const [comments, setComments] = useState<any[]>([])
    const [text, setText] = useState("")
    const [loading,setLoading] = useState(false)


    useEffect(() => {

        const fetchComments = async () => {

            const res = await fetch(`/api/posts/comment/${postId}`)

            if (!res.ok) {
                return
            }

            const comments = await res.json();
            // console.log("Commments are ", comments)
            setCommentsCount(comments.length)
            setComments(comments);
        }
        fetchComments()


    }, [postId])


    const SubmitComment = async () => {

        if (!text.trim()) {
            return
        }
        setLoading(true)
        const res = await fetch(`/api/posts/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, content: text })
        })
        if (!res.ok) {
            return
        }

        const NewComment = await res.json();
        setComments((prev) => [NewComment,...prev])
        setText("")
        setLoading(false)
    }

    return (
        <div className="w-[400px] p-4">
            <h2 className="font-semibold mb-3">Comments</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {comments.map((c) => (
                    <div key={c.id} className="text-sm flex flex-col
                 items-start">

                        <div className="flex  items-center gap-1">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 font-semibold">
                                {c.user?.name?.[0] ?? "U"}
                            </div>
                            <p className="font-semibold">{c.user?.name}<span className="ml-1 text-xs text-gray-500">{timeAgo(c.createdAt)}</span></p>

                        </div>
                        <p className="ml-7">{c.content}</p>

                    </div>



                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." className="flex-1 border rounded-lg px-3 py-1 text-sm" />
                <button onClick={SubmitComment} className=" text-sm font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-3 rounded-full">{loading? "Posting":"Post"}</button>

            </div>

            <div className=""></div>
        </div>
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

