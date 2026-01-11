


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma" 
import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


 export async function POST(req:Request,{params}:{params:{id:string}}){

    const userId = params.id
    const formData = await req.formData();
    const file = formData.get("file") as File

  // Convert file into a buffer
    const arrayBuffer = await file?.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result:any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "neighborly_uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    console.log("result in cover upoad",result)

    const user = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            image:result?.url
        }
    })

    return NextResponse.json({image:user.image})
}