

import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";


export async function GET(req:Request){


    try{
        const neighborhoods = await prisma.neighborhood.findMany()
        return NextResponse.json(neighborhoods)
    }catch(e){
        console.log("error in /neighborhood/all",e)
        return NextResponse.json({message:"Something went wrong"},{status:500})
    }

}