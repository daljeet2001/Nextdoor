

import { NextResponse }from "next/server" 
import {prisma} from "@/lib/prisma"


export async function POST(req:Request,{params}:{params:{id:string}}){
try{
      const userId = params.id;
    const body = await req.json()

    const {bio,name,city} = body

    const user = await prisma.user.update({
        where:{id:userId},
        data:{
            bio,
            name,
            city
        }
    })

    return NextResponse.json({message:"profile updated successfully"},{status:200})

}
catch(error){
    console.log(error)
    return NextResponse.json({message:"upadate failed"},{status:500})
}
  
}