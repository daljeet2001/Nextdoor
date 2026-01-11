import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function POST( req:Request, {params:{commentId}}: {params:{commentId:string}}){

    try{
        const  CommentId  = commentId
        console.log("commentId in api",CommentId)
        const session = await getServerSession(authOptions)
        // console.log("session in comment like api",session)
        if(!session?.user.id){
            return NextResponse.json({message:"Unauthorized"},{
                status:401
            })
        }
    
//UNLIKE
        const existingLike = await prisma.commentLike.findUnique({
            where:{
                userId_commentId:{
                    userId:session?.user?.id,
                    commentId:CommentId
                }
            }
        })

       

        if(existingLike){
            await prisma.$transaction([
                 prisma.commentLike.delete({
                    where:{
                        userId_commentId:{
                            userId:session?.user?.id,
                            commentId:CommentId
                        }
                    }
                }),

                 prisma.comment.update({
                    where:{
                        id:CommentId
                    },
                    data:{
                        likesCount:{decrement:1}
                    }
                })
            ])
            return NextResponse.json({liked:false})
        }


        //LIKE

    await prisma.$transaction([
         prisma.commentLike.create({
            data:{
                userId:session?.user?.id,
                commentId:CommentId
            }
        }),
         prisma.comment.update({
            where:{
                id:CommentId
            },
            data:{likesCount:{ increment:1}}

        }),
    ]);

    return NextResponse.json({
        liked:true
    })





    }catch(error){
        console.log("error in comments like api",error)
        return NextResponse.json({error:"Failed to toggle like"},{status:500})
    }

}

