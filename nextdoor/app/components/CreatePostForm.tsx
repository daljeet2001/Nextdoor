"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "../socket.context";
import { ImagePlus } from "lucide-react";
import { IoCloseOutline } from "react-icons/io5";

export default function CreatePostForm({
  neighborhoodid,
  onCreated,
  groupId
}: {
  neighborhoodid: string;
  onCreated?: (p: any) => void;
  groupId?:string
}) {

console.log(`groupId in createpostform location ${groupId ? "Group page" : "Home page"}`,groupId)
 
  const { data: session } = useSession();
  const [postbody, setPostBody] = useState("");
  const [photos, setPhotos] = useState<(null | File)[]>([]);
  const [preview, setPreview] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }); 
  }, []);

  const uploadPhoto = async () => {
    if (photos.length === 0) return [];
    if(photos.length>5){
      alert("Max 5 images allowed")
      return;
    }
  
   const uploads = photos.map(async(photo:any,index)=>{
        const formData = new FormData();
            formData.append("file", photo);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Photo upload failed");
    const data = await res.json();
    return data.url;     
      
    })
    return await Promise.all(uploads)
      
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("Please sign in");

    setLoading(true);
    try {
      const photosUrl = await uploadPhoto();



      
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postbody,
          photos: photosUrl,
          neighborhoodId: neighborhoodid,
          lat: location?.lat,
          lng: location?.lng,
          groupId: groupId ? groupId : null
        }),
      });



      if (!res.ok) throw new Error("Failed to create post or please sign in");

      const post = await res.json();
      if (socket) {
        socket.send(JSON.stringify({ type: "new_post", post }));
      }

      setPostBody("");
      setPhotos([]);
      setPreview([]);
      if (onCreated) onCreated(post);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="p-3 flex flex-col md:flex-row gap-8 w-full max-w-4xl"
    >
      <div className="flex-[2] space-y-4">
        <div className="flex items-start gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
              {session?.user?.name?.[0] ?? "U"}
            </div>
          )}

          <div className="flex-1 space-y-3">
                 {/* Upload button with icon */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black"
              >
                <ImagePlus className="w-5 h-5" />
                Upload Photo
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPhotos((prev:any)=>[...prev,file]);
                  setPreview((prev:any)=>[...prev,file ?URL.createObjectURL(file):null])

                }}
                className="hidden"
              />
            </div>
                  {/* Image Preview */}
            {preview && (
              <div className="max-h-[200px] h-auto relative mt-2 flex items-center gap-2 flex-wrap overflow-auto">
                {
                  preview.map((p:any,index)=>(
                    <div  key={index} className="relative">
                                     <img
                       
                  src={p}
                  alt="preview"
                  className="w-40 h-40 rounded-lg object-cover "
                />
                <button type="button" onClick={
                  ()=>{
                  setPreview(preview.filter((_:any,i:number)=>index!==i))
                  setPhotos(photos.filter((_:any,i:number)=>i!==index))
                  }
              
                  } className="absolute right-1 top-1 "><IoCloseOutline size={24} color={"white"}/></button>

                    </div>
         

                  )
                  )
                }
            
              </div>
            )}
            <textarea
              value={postbody}
              onChange={(e) => setPostBody(e.target.value)}
              placeholder="What's on your mind, neighbor?"
              className="w-full resize-none border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-black"
              rows={4}
            />

        

       

      
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="ml-auto font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

