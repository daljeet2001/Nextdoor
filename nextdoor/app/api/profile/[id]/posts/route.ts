import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"


export async function GET(req: Request,{params}:{params:{id:string}}) {

//   const session = await getServerSession(authOptions)

//   if(!session?.user?.id){
//     return NextResponse.json({
//       error:"Unauthorized"
//     },{status:401})
//   }
const userId = params.id




  const posts = await prisma.post.findMany({
    where: {
       userId:userId 
    },
    orderBy: { createdAt: 'desc' },
    include: { user: true ,
      likes:{
      where:{
        userId
      },
      select:{
        id:true
      }
    }},
  });
  return NextResponse.json(posts);
}