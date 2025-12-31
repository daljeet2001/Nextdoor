"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";



export default function Share({post }: { post:any}) {
  
    const postUrl = typeof window != "undefined" ?  `${window.location.origin}/post/${post.id}`:"";

const handleShare = {
  
  whatsapp: () => {
    const text = `${post.body}\n${postUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  },

  facebook: () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        postUrl
      )}`,
      "_blank"
    );
  },

  twitter: () => {
    const text = post.body;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(postUrl)}`,
      "_blank"
    );
  },

  copy: async () => {
    await navigator.clipboard.writeText(postUrl);
    alert("Link copied!");
  },
};

 




  return (
    <div className="flex flex-col h-[290px] w-[500px]   rounded-xl shadow-md  overflow-hidden ">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 mt-2 ">
     
        <div className="font-semibold text-[22px] text-gray-800">Share this post</div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">

        <div className="border border-gray-600 rounded-xl p-3 mb-5 flex justify-between">
            <div>
                     <p className="text-sm text-gray-800 mb-2 line-clamp-2">
                {post.body}
            </p>
            <div className="flex items-center justify-start gap-2 text-sm text-gray-800">
                <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center text-white"> {post.user?.name?.[0]?? "U"}

                </div>
                   {post.user?.name}
                 
            </div>
      
            </div>
            <img src={post.photo} className="w-[60px] h-[60px] object-cover"></img>
       
         
        </div>

        <div className="flex items-center justify-start gap-4">
            <ShareItem icon = "/fb.png" label="Facebook" onClick={handleShare.facebook}/>
              <ShareItem icon = "/whatsapp.png" label="WhatsApp" onClick={handleShare.whatsapp} />
                <ShareItem icon = "/x.png" label="X" onClick={handleShare.twitter}/>
                  <ShareItem icon = "/lnk.png" label="Copy link" onClick={handleShare.copy}/>
        </div>




    
      </div>

 
    </div>
  );
}


function ShareItem({icon,label,onClick}:{icon:string,label:string,onClick:()=>void}){
    return(
        <button onClick = {onClick}className="flex flex-col items-center gap-2 hover:opacity-80">
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
                <img src={icon} alt={label} className="w-6 h-6"></img>
            </div>
            <span className="text-xs text-gray-800">{label}</span>
        </button>
    )
}




