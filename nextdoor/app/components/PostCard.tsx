"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Globe, BellOff, Bookmark, Pencil, Trash2, Lock, X, MessageSquare,BookmarkX,MessageSquareOff,Flag, FlagOff,VolumeOff,Volume } from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Link from "next/link"
import Chat from "./Chat";
import Comment from "./Comment";
import Share from "./Share"
import { usePathname } from "next/navigation";

export default function PostCard({ post, onClose }: { post: any; onClose?: (id: string) => void }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(post.likesCount || 0);
  // const [liked, setLiked] = useState(post.likes.length>0);
  const [liked, setLiked] = useState(post.likes?.length > 0 || false)
  const [chatOpen, setChatOpen] = useState(false);
  const [CommentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0)
  const [menu, setMenu] = useState(false)
  const [deleteMenu, setDeleteMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const path = usePathname()

  const [editMenu, setEditMenu] = useState(false)
  const [EditBody, setEditBody] = useState(post.body)
  const [EditImage, setEditImage] = useState(post.photo)
  const [Uploading,setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const EditIRef = useRef<HTMLInputElement>(null)
  const [bookmark,setBookmark] = useState<boolean>(false)
  const [canComment,setCanComment] = useState<boolean>(true)


  console.log("post inside post card", post)

  const isOwner = session?.user?.id === post.user.id
  const isReported = post?.report?.length !==0



  useEffect(()=>{

    setBookmark(post?.bookmarks?.length > 0)
    setCanComment(post.commentsClosed)

  },[post])

  const toggleComment = async()=>{
    const res = await fetch("/api/posts/commentsOff",{
      method:"PUT",
      body:JSON.stringify({
        postId:post.id
      })
    })
    const result = await res.json()
    console.log("toggle commnet res",result)
    setCanComment(result.commentsClosed)
    // post.commentsClosed = result.commentsClosed
  }

  const toggleBookmark = async()=>{

    const res = await fetch(`/api/posts/bookmark`,{
      method:"POST",
      body:JSON.stringify({
        postId:post.id
      })
    })

    const result = await res.json()
    console.log("result in togglebookmakr",result)
    setBookmark(result.bookmark)

  }

  const toggleLike = async () => {
    try {
      if (!session?.user.id) {
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
      setLiked(data.likes?.length > 0)
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/post/${post.id}`, {
        method: "DELETE"
      })
      if (!res.ok) {
        throw new Error("Failed to delete post")
      } else {
        alert("Post deleted successfully")
        onClose?.(post.id)
      }

    } catch (e) {
      console.log(e)
      alert("Failed to delete post")
    }

  }


  const getUrl = async(file:any)=>{
try{
setUploading(true)
  const formData = new FormData()
  formData.append("file",file)

  const res = await fetch(`/api/upload`,{
    method:"POST",
    body:formData,
  })

  const result = await res.json()

  if(!res.ok){
    throw new Error("Failed to upadte photo")
  }else{
setEditImage(result.url)
setUploading(false)
   
  }

}catch(e){
  console.log(e)
  alert("Failed to update photo")
}
  }

  const handleEditPost = async()=>{

try{
  setSaving(true)
  const res = await fetch(`/api/post/${post.id}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      caption:EditBody,
      photo:EditImage
    })
  })

  if(!res.ok){
    throw new Error("Failed to update post")
  }

  //optimistic update
  post.body = EditBody
  post.photo = EditImage

setEditMenu(false);

}catch(e){

  console.log(e)
  alert("Failed to update post")
}finally{
  setSaving(false)
  alert("Post updated successfully")
}

  }


  const handleReport = async ()=>{
    const res = await fetch("/api/posts/report",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({postId:post.id})
    })
    if(res.ok){
      alert("Post reported. Thanks for helping keep the community safe.")
    }
  }

  const handleMute = async()=>{

    const res = await fetch("/api/user/mute",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({mutedId:post.user.id})
    })

    if(res.ok){
      alert(`You won't see posts from ${post.user.name} anymore`)
      onClose?.(post.id) //optimistic remove

    }
  }

  const handleHidePost = async () => {
    try {

      const res = await fetch(`/api/posts/hide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id })
      })

      if (!res.ok) {
        throw new Error("Failed to hide post")
      } else {
        alert("Post hidden successfully")
        onClose?.(post.id)
      }

    } catch (e) {
      console.log(e)
      alert("Failed to hide post")
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
            <Link href={`/profile/${post.user.id}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
              {/* {post.user?.name?.[0] ?? "U"} */}

              {post.user?.image && post.user.image.trim() != "" ? (<img src={post.user.image} alt="profile_img" className="w-full h-full rounded-full" />) : (<div className="">{post.user?.name?.[0].toUpperCase() ?? "U"}</div>
              )}

            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                {post.user?.name ?? post.user?.email}
              </div>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                {post.user.city} · {timeAgo(post.createdAt)} ago
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
              onClick={() => setMenu(!menu)}
            >
              <path
                fill="currentColor"
                d="M7.5 12A1.75 1.75 0 1 1 4 12a1.75 1.75 0 0 1 3.5 0Zm4.625 1.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm6.125 0a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
              />
            </svg>
            {menu && <div
              ref={menuRef}
              className="absolute right-0 top-8 w-72 rounded-2xl bg-[#2F2F2F] shadow-xl border border-neutral-700 overflow-hidden z-50">




              {!path.startsWith("/profile") && <Menuitem
                icon={<X size={20} />}
                title="Hide"
                subtitle="Remove post from your feed"
                onClick={() => {
                  setMenu(false)
                  handleHidePost()
                }}
              />}

                 <Menuitem
                    icon={ bookmark ? <BookmarkX size={20}/> :<Bookmark size={20} />}
                    title={bookmark ? "Remove bookmark":"Bookmark"}
                    subtitle={!bookmark?"Save post for later":"Remove from saved posts" }
                    onClick={() => {
                      setMenu(false)
                      toggleBookmark()
                    }}
                  />

                       {!isOwner && (
                <>
                  <Menuitem
                    icon={<Flag size={20} />}
                    title="Report"
                    subtitle="Flag for review"
                    onClick={() => {
                      setMenu(false);
                      handleReport()
                    }}
                  />

                            <Menuitem
                    icon={<VolumeOff size={20} />}
                    title={`Mute ${post.user.name}`}
                    subtitle="Hide all posts from this neighborhood"
                    onClick={() => {
                      setMenu(false);
                      handleMute()
                    }}
                  />
                </>

              )}

              {isOwner && (
                <>


                  <Menuitem
                    icon={<Pencil size={20} />}
                    title="Edit"
                    subtitle="Upadte the content of your post"
                    onClick={() => {
                      setMenu(false);
                      setEditBody(post.body);
                      setEditImage(post.photo)
                      setEditMenu(true)
                      
                    }}
                  />
                  <Menuitem
                    icon={<Trash2 size={20} />}
                    title="Delete"
                    subtitle="Permanently remove post"
                    danger

                    onClick={() => {
                      setMenu(false)
                      setDeleteMenu(true)

                    }}
                  />

                            <Menuitem
                    icon={ canComment ?<MessageSquare size={20} />:<MessageSquareOff size={20}/>}
                    title={canComment ?"Reopen Discussion":"Close Discussion"}
                    subtitle={canComment ? "Allow neighbors to comment":"Don't allow neighbors to comment"}
                    

                    onClick={() => {
                      setMenu(false)
                      toggleComment()

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
              className={`flex items-center gap-1 text-sm font-medium ${liked ? "text-gray-600" : "text-gray-600 hover:text-[#0D1164]"
                }`}
            >
              {liked ? (
                <img src="/like-social-heart.png" className="w-6 h-6" alt="liked" />
              ) : (
                <img src="/heart.png" className="w-6 h-6" alt="like" />
              )}
              {likes}
            </button>

           {!canComment &&  <button  disabled ={canComment} onClick={() => setCommentOpen(!CommentOpen)} className="flex items-center gap-1 text-gray-600 hover-text-[#0D1164]">
              <img src="/comment.png" className="w-6 h-6" alt="comment"></img>
              {commentsCount}
            </button> }
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]"
            >
              <img src="/paper-plane.png" className="w-6 h-6" alt="chat" />
            </button>






          </div>

          <div className="flex items-center justify-center gap-3 " >
            {/* Chat button */}


            <button onClick={() => setShareOpen(true)} className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]">
              <img src="/share.png" className="w-6 h-6" alt="share" />
            </button>


          </div>
        </div>

        {CommentOpen && <Comment postId={post.id} setCommentsCount={setCommentsCount} />}
      </article>

{/* Edit Popup */}



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
            <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteMenu(false)}>
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

                <button onClick={() => setDeleteMenu(false)} className={`px-4 py-2 rounded-full text-sm text-neutral-300 hover:bg-neutral-700 transition`}>Cancel</button>

                <button
                  onClick={() => {
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

      {
        editMenu &&  (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={()=>setEditMenu(false)}>
            </div>

            {/* Modal */}
            <div className="relative z-10 w-[400px] max-w-full rounded-2xl bg-[#1f1f1f] p-6  ">
              <div className="flex items-center justify-between mb-4 text-white">
                <button onClick={()=>setEditMenu(false)}>✖</button>
                <button className={`px-4 py-2 rounded-full text-sm text-neutral-300 hover:bg-neutral-700 transition ${saving || Uploading? "cursor-not-allowed bg-neutral-700 text-neutral-400":"text-neutral-300 hover:bg-neutral-700"}`} onClick={handleEditPost} disabled={saving}> {Uploading? "Uploading":saving? "Saving":"Save"}</button>
              </div>



              <div className="flex gap-4">
                {/* Image preview */}
                {EditImage && (
                  <div className="relative w-40 shrink-0">
                  <img src={EditImage} className="rounded-xl object-cove"/>
                              <button className="absolute right-1 top-1  p-2 rounded-full" onClick={()=>EditIRef.current?.click()}>
                <FaCloudUploadAlt size={24} color={"white"} />
              </button>

  
              <input
                type="file"
                onChange={(e) => getUrl(e.target.files?.[0])}
                accept="/*image"
                ref={EditIRef}
                hidden
              />
                  </div>
                )}

                <textarea 
                value={EditBody}
                onChange={(e)=>setEditBody(e.target.value)}
                placeholder="Write a caption"
                className="flex-1 resize-none rounded-lg  p-3 text-sm text-white outline-none"
                rows={6}
                
                />
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

            <Share post={post} />
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
      className={`w-full flex gap-3 px-4 py-3 text-left hover:bg-neutral-700 transition ${danger ? "text-red-400" : "text-white"}`}
    >
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold leading-tight">{title}</p>
        <p className="text-sm text-neutral-400">{subtitle}</p>
      </div>
    </button>
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