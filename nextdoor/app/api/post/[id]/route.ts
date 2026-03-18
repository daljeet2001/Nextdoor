import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";

export async function GET(req: Request, context:any) {
    const session = await auth()

    //   if(!session?.user?.id){
    //     return NextResponse.json({
    //       error:"Unauthorized"
    //     },{status:401})
    //   }
    const { id:postId }=  await context.params
    if (!postId) {
        return NextResponse.json({ message: "Post ID is required" }, { status: 400 })
    }

    const posts = await prisma.post.findUnique({
        where: {
            id: postId
        },

        include: {
            user: true,
        },
    });
    return NextResponse.json(posts);
}

export async function DELETE(req: Request, context:any) {


    try {

    } catch (e) {
        console.log("error while deleting post", e)
        return NextResponse.json({
            error: "Something went wrong"
        }, { status: 500 })
    }

    const session = await auth()

    const { id:postId } = await context.params

    if (!postId) {
        return NextResponse.json({
            error: "Post Id is requied"
        },
            { status: 404 }
        )
    }

    if (!session?.user?.id) {
        return NextResponse.json({
            error: "Unauthorized"
        }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        select: {
            userId: true
        }
    })

    console.log("post in delete route of posts", post)


    if (!post) {
        return NextResponse.json({
            error: "Post notfound"
        }, {
            status: 404
        })
    }

    // ownership verification

    if (post.userId !== session?.user?.id) {
        return NextResponse.json({
            error: "Forbidden"
        }, { status: 403 })

    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })

    return NextResponse.json({ success: true })








}

export async function PUT(req: Request, context:any) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, {
                status: 401
            })
        }


        const { id:postId }= await context.params;
        const { caption, photos } = await req.json();
        console.log("photos in PUT",photos)

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                userId: true
            }
        })

        if (!post) {
            return NextResponse.json({
                message: "Post not found"
            }, {
                status: 404
            })
        }
        //ownership check
        if (post.userId !== session?.user?.id) {
            return NextResponse.json({
                message: "Forbidden"
            }, {
                status: 403
            })
        }


        const updated = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                photos:{
                         deleteMany:{},
                    create:photos.map((p:any)=>({url:p.url}))
                },
                body: caption
            }
        })

        return NextResponse.json(updated)
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500
        })
    }
}