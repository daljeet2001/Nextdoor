import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"



export  async function GET(req:Request, {params}:{params:{postId:string}}){

    const postId = params.postId;

    const comments = await prisma.comment.findMany({
        where:{
            postId
        },
        include:{
            user:{select:{name:true}}
        },
        orderBy:{createdAt:"desc"}
    })

    return NextResponse.json(comments)

}