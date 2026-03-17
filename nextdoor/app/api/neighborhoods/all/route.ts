

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";



export async function GET(req:Request){


    try{
        const neighborhoods = await prisma.neighborhood.findMany()
        return NextResponse.json(neighborhoods)
    }catch(e){
        console.log("error in /neighborhood/all",e)
        return NextResponse.json({message:"Something went wrong"},{status:500})
    }

}