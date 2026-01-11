"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Globe, BellOff, Bookmark, Pencil, Trash2, Lock, X } from "lucide-react";
import  Link  from "next/link"
import Chat from "./Chat";
import Comment from "./Comment";
import Share from "./Share"


export default function PostCard({ post, onClose }: { post: any; onClose?: (id: string) => void }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(post.likesCount || 0);
  // const [liked, setLiked] = useState(post.likes.length>0);
  const [liked,setLiked] = useState(post.likes?.length>0 || false)
  const [chatOpen, setChatOpen] = useState(false); 
  const [CommentOpen,setCommentOpen] = useState(false);
  const [shareOpen,setShareOpen] = useState(false);
  const [commentsCount,setCommentsCount] = useState(0)
  const [ menu,setMenu ] = useState(false)
  const [deleteMenu, setDeleteMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // console.log("post inside post card",post)

  const isOwner = session?.user?.id === post.user.id

  const toggleLike = async () => {
    try {
      if(!session?.user.id){
        alert("please sign in")
        return

      }
      const res = await fetch("/api/posts/like", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!res.ok) throw new Error("Failed to update like");

      const data = await res.json();
      setLikes(data.likesCount);
      setLiked(data.likes?.length>0)
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async()=>{
try{
      const res = await fetch(`/api/post/${post.id}`,{
      method:"DELETE"
    })
    if(!res.ok){
     throw new Error("Failed to delete post")
    }else{
      alert("Post deleted successfully")
      onClose?.(post.id)
    }

}catch(e){
  console.log(e)
  alert("Failed to delete post")
}

  }


      useEffect(() => {
  
          const fetchComments = async () => {
  
              const res = await fetch(`/api/posts/comment/${post.id}`)
  
              if (!res.ok) {
                  return
              }
  
              const comments = await res.json();
              // console.log("Commments are ", comments)
              setCommentsCount(comments.length)
             
          }
          fetchComments()
  
  
      }, [post])

  return (
    <>
      <article className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 relative">
        {/* Top Section */}

        <div className="flex items-center  justify-between">

              <div className="flex items-start gap-3">
          <Link href= {`/profile/${post.user.id}`}className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
            {/* {post.user?.name?.[0] ?? "U"} */}

                {post.user?.image && post.user.image.trim()!=""  ? (<img src={post.user.image} alt="profile_img" className="w-full h-full rounded-full"/>):    (<div className="">{post.user?.name?.[0].toUpperCase() ?? "U"}</div>
          )}

          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
              {post.user?.name ?? post.user?.email}
            </div>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              {new Date(post.createdAt).toLocaleDateString()} · <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>

<div className="relative" >
<svg
width={24}
height={24}
viewBox="0 0 24 24"
fill="none"
aria-hidden="true"
className="text-gray-600 block"
onClick={()=>setMenu(!menu)}
>
<path
fill="currentColor"
d="M7.5 12A1.75 1.75 0 1 1 4 12a1.75 1.75 0 0 1 3.5 0Zm4.625 1.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm6.125 0a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
/>
</svg>
{menu && <div 
ref={menuRef}
className="absolute right-0 top-8 w-72 rounded-2xl bg-[#2F2F2F] shadow-xl border border-neutral-700 overflow-hidden z-50">




    <Menuitem
  icon ={<X size={20}/>}
  title="Hide"
  subtitle="Remove post from your feed"
  onClick={()=>{
    setMenu(false)
  }}
  />

  {isOwner && (
    <>
  

    <Menuitem
    icon = {<Pencil size={20}/>}
    title="Edit"
    subtitle="Upadte the content of your post"
    onClick={()=>{
      setMenu(false)
    }}
    />
        <Menuitem
    icon = {<Trash2 size={20}/>}
    title="Delete"
    subtitle="Permanently remove post"
    danger

    onClick={()=>{
      setMenu(false)
      setDeleteMenu(true)

    }}
    />
    
    </>

  )}

</div>}
</div>



        </div>
   

        {/* Post Content */}
        <div className="mt-3 text-gray-800 text-sm leading-relaxed">
          {post.photo && (
            <img src={post.photo} alt="post image" className="w-full h-[400px] mb-2 object-cover" />
          )}
          {post.body}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 text-sm font-medium ${
                liked ? "text-gray-600" : "text-gray-600 hover:text-[#0D1164]"
              }`}
            >
              {liked ? (
                <img src="/like-social-heart.png" className="w-6 h-6" alt="liked" />
              ) : (
                <img src="/heart.png" className="w-6 h-6" alt="like" />
              )}
              {likes}
            </button>

              <button onClick={()=> setCommentOpen(!CommentOpen)} className="flex items-center gap-1 text-gray-600 hover-text-[#0D1164]">
              <img src="/comment.png" className="w-6 h-6" alt="comment"></img>
              {commentsCount}
            </button>
                 <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]"
            >
              <img src="/paper-plane.png" className="w-6 h-6" alt="chat" />
            </button>

 

      

          
          </div>

          <div className="flex items-center justify-center gap-3 " >
                            {/* Chat button */}
       

            <button onClick={()=>setShareOpen(true)} className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]">
                     <img src="/share.png" className="w-6 h-6" alt="share"/> 
            </button>
      

          </div>
        </div>

           { CommentOpen &&  <Comment postId={post.id} setCommentsCount={setCommentsCount}/>}
      </article>

      {/* Chat Popup */}
      {chatOpen && (
        <div className="fixed inset-0 bg-white/40  flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setChatOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <Chat userId={post.user.id} userName={post.user.name ?? "User"} optimistic={false} />
          </div>
        </div>
      )}


      {
        deleteMenu && (
          <div className="fixed inset-0 flex justify-center items-center z-[60]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={()=>setDeleteMenu(false)}>
            </div>
            {/* Model */}
            <div className="relative z-10 w-[320px]  rounded-2xl bg-[#2F2F2F] p-4 shadow-xl ">
          <h3 className="text-lg font-semibold text-white ">
            Delete Post?
          </h3>
          <p className="mt-1 text-sm text-neutral-400">
            Your post will be permanently removed.
          </p>
          <div className="mt-4 flex justify-end gap-3">

            <button onClick={()=>setDeleteMenu(false)} className="px-4 py-2 rounded-full text-sm text-neutral-300 hover:bg-neutral-700 transition">Cancel</button>

            <button 
            onClick={()=>{
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


      {shareOpen && 
       <div className="fixed inset-0 bg-white/40  flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <Share post = {post} />
          </div>
        </div>
        }

        {/* {CommentOpen && (
          <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50 ">
            <div className="relative bg-white rounded-xl shadow-lg">
          <button
              onClick={() => setCommentOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <Comment postId={post.id} setCommentsCount={setCommentsCount}/>
            </div>
          </div>
        )} */}
    </>
  );
}



function Menuitem({
  icon,
  title,
  subtitle,
  onClick,
  danger=false,
}:{
  icon:React.ReactNode;
  title:string;
  subtitle:string;
  onClick: ()=>void;
  danger?:boolean;

}){
  return (
    <button 
    onClick={onClick}
    className={`w-full flex gap-3 px-4 py-3 text-left hover:bg-neutral-700 transition ${danger? "text-red-400":"text-white"}`}
    >
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold leading-tight">{title}</p>
        <p className="text-sm text-neutral-400">{subtitle}</p>
      </div>
    </button>
  )
}

