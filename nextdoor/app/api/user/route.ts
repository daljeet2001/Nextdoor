// /api/users/route.ts
import { prisma } from "@/lib/prisma";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {


  const session = await auth();

if( !session?.user?.id || !session?.user?.neighborhoodId){
  return NextResponse.json({message:"Unauthorized"},{status:401})

}
  const users = await prisma.user.findMany({
    where:{
      neighborhoodId:session?.user?.neighborhoodId
    },
    select: { id: true, name: true, email: true },
  });
  return Response.json(users);
}
