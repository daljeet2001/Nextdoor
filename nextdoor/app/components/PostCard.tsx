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
import { IoCloseOutline } from "react-icons/io5";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { timeAgo } from "@/lib/timeAgo";

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
  const [EditImages, setEditImages] = useState<any[]>(post?.photos?.map((p:any)=>p.url) || [])
  const [Uploading,setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const EditIRef = useRef<HTMLInputElement>(null)
  const [bookmark,setBookmark] = useState<boolean>(false)
  const [canComment,setCanComment] = useState<boolean>(true)


  // console.log("post inside post card", post)

  const isOwner = session?.user?.id === post?.user?.id
  const isReported = post?.report?.length !==0


  const [ currentImage, setCurrentImage ] = useState(0);


  useEffect(()=>{
setCurrentImage(0)
  },[post])

  const nextImage = ()=>{
    setCurrentImage((prev)=>prev === post.photos.length-1 ? 0: prev+1)
  }

  const prevImage = ()=>{
    setCurrentImage((prev)=>prev === 0? post.photos.length-1 : prev-1)
  }


// useEffect(()=>{
//   function handleClickOutside(e:MouseEvent){
//     if(menuRef.current && !menuRef.current?.contains(e.target as Node)){
//       setMenu(false)
//     }
//   }
//   document.addEventListener("mousedown",handleClickOutside)
//   return ()=>document.removeEventListener("mousedown",handleClickOutside)
// },[])


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


  const getUrl = async(file:any, index:number)=>{
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
    console.log("result",result)
    console.log("EditImages",EditImages)
const aarr = EditImages.map((imgf,i)=>i === index ? ({...imgf, url : result.url}):(imgf))
console.log("aarr",aarr)
setEditImages(aarr);



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
      photos:EditImages
    })
  })

  if(!res.ok){
    throw new Error("Failed to update post")
  }

  //optimistic update
  post.body = EditBody
  post.photos = EditImages

setEditMenu(false);
setCurrentImage(0)

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
            <Link href={`/profile/${post?.user?.id}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
              {/* {post.user?.name?.[0] ?? "U"} */}

              {post.user?.image && post.user.image.trim() != "" ? (<img src={post.user.image} alt="profile_img" className="w-full h-full rounded-full" />) : (<div className="">{post.user?.name?.[0].toUpperCase() ?? "U"}</div>
              )}

            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                {post.user?.name ?? post.user?.email}
              </div>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                {post?.user?.city} · {timeAgo(post.createdAt)} ago
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
                      setEditImages(post.photos)
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
        {
          post?.photos?.length>0 &&       
           <div className="relative w-full mt-2">

            {
              post?.photos?.length>1 &&    <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 w-8 h-8 rounded-full flex items-center justify-center" onClick={prevImage}><GrPrevious size={20}/></button>
            }

         
  
                  <img src={post?.photos[currentImage]?.url} alt="post image" className="w-full h-[400px] object-cover" />

        {
              post?.photos?.length>1 &&    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 w-8 h-8 rounded-full flex items-center justify-center" onClick={nextImage}><GrNext size={20}/></button>
            }


            {post?.photos?.length>1&& <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {post.photos.map((_:any,index:number)=>

            <div key={index} className={`w-4 h-2 rounded-xl ${index === currentImage? "bg-white":"bg-white/40"} `}></div>
            )}
              </div>}
        

         
        </div>
        }
<div className="text-gray-800 text-sm leading-relaxed mt-2"></div>
         {post.body}
 

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
                      <IoCloseOutline size={24}/>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center ">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setEditMenu(false)}>
            </div>

            {/* Modal */}
            <div className="relative z-10 w-[400px] max-w-full rounded-2xl bg-white shadow-xl text-black p-6  ">
              <div className="flex items-center justify-between mb-4 ">
                <button onClick={()=>setEditMenu(false)}>         <IoCloseOutline size={24} className="text-gray-500 hover:text-gray-700"/></button>
                <button className={`px-4 py-2 rounded-full font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85]`} onClick={handleEditPost} disabled={saving}> {Uploading? "Uploading":saving? "Saving":"Save"}</button>
              </div>



              <div className="flex flex-col gap-4">
                {/* Image preview */}
                {EditImages?.length>0 && (
                  <div className="flex w-full flex-wrap gap-2">
               {           EditImages?.map((editImage:any,index:number)=>(
                          <div key={index} className="relative w-30 shrink-0">
                  <img src={editImage.url} className="rounded-xl w-28 h-28 object-cover"/>
                              <button onClick={
                          ()=>
                               setEditImages(EditImages.filter((imag,i)=>i!==index))
                                } className="absolute right-2 top-0 rounded-full">
                <IoCloseOutline size={24} color={"white"} />
              
              </button>

  
        
                  </div>

                  ))}
                  </div>
            
            
                )}

                <textarea 
                value={EditBody}
                onChange={(e)=>setEditBody(e.target.value)}
                placeholder="Write a caption"
                className="flex-1 resize-none rounded-lg  p-3 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#5E6B84] bg-[#FAF9F6]"
                rows={6}
                
                />
              </div>

            </div>
          </div>
        )
      }


      {shareOpen &&
        <div className="fixed inset-0 bg-white/40  flex items-center justify-center z-50 ">
          <div className="relative bg-white rounded-xl shadow-lg  w-full lg:w-[500px] ">
            {/* Close button */}
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
                  <IoCloseOutline size={24} color={"white"} />
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



