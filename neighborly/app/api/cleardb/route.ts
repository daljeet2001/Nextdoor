import { NextResponse} from "next/server"
import { prisma } from "@/lib/prisma"


export async function POST(req:Request){
  const Posts =  await prisma.post.deleteMany({})

  const Messages = await prisma.message.deleteMany({})




   const Users =  await prisma.user.deleteMany({})


    const Neighbors = await prisma.neighborhood.deleteMany()

return NextResponse.json({message:"Database cleared"},{status:200})
}