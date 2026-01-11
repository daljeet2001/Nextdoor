"use client"


import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CiHeart } from "react-icons/ci";
import { GrLike } from "react-icons/gr";

export default function Comment({ postId, setCommentsCount }: { postId: string, setCommentsCount: (count: number) => void }) {
    const { data: session } = useSession()
    const [comments, setComments] = useState<any[]>([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    // const [ replayingTo,setReplayingTo ] = useState<string | null>(null)
    const [replayingTo,setReplayingTo] = useState<{id:string,username:string} | null>(null)
const [replyText,setReplyText] = useState("")
const [refetch,setRefetch] = useState(false)

const submitReply = async()=>{
    if(!session?.user.id){
        alert("please sign in")
        return 
    }

    if(!replayingTo || !replyText.trim())return
const res = await fetch("/api/posts/comment/reply",{
    method:"POST",
    body:JSON.stringify({postId,parentId:replayingTo.id,content:replyText})
})
if(!res.ok){
    alert("error replying")
    return
}
alert("replied")
setRefetch(!refetch)
setReplyText("")
setReplayingTo(null)
}


    const toggleLike = async (CommentId: string) => {
        if(!session?.user?.id){
            alert("please sign in")
            return
        }

        setComments(prev => prev.map((c=>c.id === CommentId?{
            ...c,
            isLiked:!c.isLiked,
            likesCount:c.isLiked? c.likesCount -1: c.likesCount+1
        }:c)))

        // console.log("comments", comments)
        const res = await fetch(`/api/comments/${CommentId}/like`, {
            method: "POST"
        })

        if (!res.ok) {
            alert("error occured")
                setComments(prev => prev.map((c=>c.id === CommentId?{
            ...c,
            isLiked:!c.isLiked,
            likesCount:c.isLiked? c.likesCount -1: c.likesCount+1
        }:c)))
            return;
        }
        if (res.ok) {
            console.log("res in topggleLike", res.body)
setRefetch(!refetch)
        }
    }


    useEffect(() => {
// if(!session)return
        const fetchComments = async () => {

            const res = await fetch(`/api/posts/comment/${postId}`)

            if (!res.ok) {
                return
            }

            const data = await res.json();
            setCommentsCount(data.length)

            // const normalized = data.map((c: any) => ({
            //     ...c,
            //     isLiked: c.likes.some((l: any) => l.userId === session?.user?.id)
            // }))
            // console.log("normalized comments are", normalized)
            // setComments(normalized)
// setComments(comments);
            const normalized = (comment:any):any=>(
                {
                    ...comment,
                    isLiked:comment.likes.some(
                        (l:any)=>l.userId === session?.user?.id
                    ),
                    replies:comment.replies?.map(normalized) || []
            })
const norm = data.map(normalized);
setComments(norm)

            
        }
        fetchComments()


    }, [postId,session,refetch])


    const SubmitComment = async () => {

        if (!text.trim()) {
            return
        }

        if(!session?.user?.id){
            alert("please sign in")
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
        setComments((prev) => [NewComment, ...prev])
        setText("")
        setLoading(false)
    }

    return (
        <div className="w-full p-4">
            {/* <h2 className="font-semibold mb-3">Comments</h2> */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {comments.map((c) => (
                    <CommentItem 
                    key={c.id}
                    comment={c}
                    toggleLike={toggleLike}
                    onReply ={(id:any,name:any)=>
                        setReplayingTo({id,username:name})
                    }
                    depth={0}
                    replayingTo={replayingTo}
                    setReplayingTo={setReplayingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    submitReply={submitReply}
                    />
                    
        

                ))}
    
            </div>

      

            <div className="flex gap-2 mt-3 w-full">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." className="flex-1 border rounded-2xl px-4 py-2 text-sm" />
                <button onClick={SubmitComment} className=" text-sm font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 rounded-full">{loading ? "Posting" : "Post"}</button>

            </div>


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



function CommentItem({comment,onReply,toggleLike,depth,replayingTo,setReplayingTo,replyText,setReplyText,submitReply}:any){
    const isReplayingHere = comment.id === replayingTo?.id
    return (
            <div style={{marginLeft: depth *16 }} className="mt-2" key={comment.id}>
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                {comment.user?.name?.[0] ?? "U"}
            </div>

            <p className="font-semibold text-sm">
                {comment.user?.name}
            </p>
            <span className="ml-2 text-xs text-gray-500">
                {timeAgo(comment.createdAt)}
            </span>
            <span className="ml-2 text-xs text-gray-500">
                {comment.likesCount} Likes
            </span>
        </div>

        <p className="ml-8 text-xs">{comment.content}</p>

        <div className="ml-8 flex gap-3 text-xs font-semibold">
            <button onClick={()=>toggleLike(comment.id)}>
                {comment.isLiked? "Liked":"Like"}
            </button>

            <button onClick={()=>onReply(comment.id,comment.user?.name)}>Reply</button>
        </div>
                          {isReplayingHere && (
                <div className="mt-3 ml-6 max-w-[300px] flex gap-2">
                    <input 
                    value={replyText}
                    onChange={(e)=>setReplyText(e.target.value)}
                    placeholder ={ `Replaying to ${replayingTo?.username}`}
                    className="flex-1 border rounded-2xl px-3 py-[6px] rounded-full text-xs"
                        />
                        <button 
                        onClick={submitReply}
                        className="bg-[#0D1164] text-white px-3  rounded-full text-xs"
                        >
Post
                        </button>

                </div>
            )}
        

        {
            comment.replies?.map((reply:any)=>(
                <CommentItem 
                key={reply.id}
                 comment={reply}
                  onReply={onReply}
                   toggleLike={toggleLike}
                   replyText={replyText}
                   setReplyText={setReplyText}
                   submitReply={submitReply}
                   replayingTo={replayingTo}
                   setReplayingTo={setReplayingTo}
                    depth ={depth +1}
                    />
            ))
        }
    </div>
    )
}