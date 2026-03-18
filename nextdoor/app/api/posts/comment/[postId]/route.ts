import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"



export async function GET(req: Request, context:any) {

    const { postId }= await context.params;

    const comments = await prisma.comment.findMany({
        where: {
            postId,
        },
        include: {
            user: { select: { name: true } },
            likes: true,
        },
        orderBy: { createdAt: "asc" }
    });

    //Build tree

    const map = new Map<string,any>();
    const roots:any[] = [];

    comments.forEach((c)=>{
        map.set(c.id,{...c,replies:[]})
    })

    comments.forEach((c)=>{
        if(c.parentId){
            map.get(c.parentId)?.replies.push(map.get(c.id))
        }
        else {
            roots.push(map.get(c.id));
        }
    })

    return NextResponse.json(roots)

}