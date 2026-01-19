import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"


export async function POST(req: Request) {


    try {

        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, {
                status: 401
            })
        }


        const{postId} = await req.json()

        if (!postId) {
            return NextResponse.json({
                message: "PostId is required"
            },
                {
                    status: 400
                })
        }


        //find if post exist

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                id: true
            }
        })

        if (!post) {
            return NextResponse.json({
                message: "Post not found"
            }, {
                status: 404
            })
        }

        await prisma.hiddenPosts.create({
            data: {
                userId: session?.user?.id,
                postId: postId

            }

        })

        return NextResponse.json({
            message: "Post hidden successfully"

        }, {
            status: 200
        })

    } catch (e: any) {

        if (e.status === "P2002") {
            return NextResponse.json({
                message: "Post already hidden"
            }, { status: 200 })
        }
        console.log("Hide post error", e)
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500
        })
    }



}