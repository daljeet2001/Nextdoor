import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth";



export async function GET(req:Request){

    const session = await getServerSession(authOptions)

    if(!session?.user?.id){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }


    const bookmarks = await prisma.bookmarks.findMany({
        where:{
            userId:session?.user?.id
        },
        include:{
            post:{

    include: { user: true ,
      likes:{
      where:{
        userId:session?.user?.id
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
            }                       
        }
    })

    const posts = bookmarks.map((b)=>b.post)
    return NextResponse.json(posts)
}
export async function POST(req:Request){

    const session = await getServerSession(authOptions)

    if(!session?.user?.id){
        return NextResponse.json({
            message:"Unauthorized"
        },
        {
            status:401
        }
        )
}

const { postId }= await req.json()

const bookmark = await prisma.bookmarks.findUnique({
    where:{
        userId_postId:{
            userId:session?.user?.id,
            postId:postId
        }
    }
})

if(bookmark){
    await prisma.bookmarks.delete({
     where:{
        userId_postId:{
            userId:session.user.id,
            postId:postId
        }
     }
    })
    return NextResponse.json({
       bookmark:false
    })
}

await prisma.bookmarks.create({
    data:{
        userId:session.user.id,
        postId
    }
})

return NextResponse.json({
    bookmark:true
})
}