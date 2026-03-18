import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"


export async function GET(req: Request,context:any) {

  const session = await auth()

  if(!session?.user?.id){
    return NextResponse.json({
      error:"Unauthorized"
    },{status:401})
  }
const { id:userId } = await context.params




  const posts = await prisma.post.findMany({
    where: {
       userId:userId 
    },
    orderBy: { createdAt: 'desc' },
    include: { user: true ,
      photos:true,
      likes:{
      where:{
        userId
      },
      select:{
        id:true
      }
    },
    bookmarks:{
      where:{
        userId:session?.user?.id
      }
    }
  },
  });
  return NextResponse.json(posts);
}