import PostCard from "@/app/components/PostCard";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/post/${id}`)
    console.log("res is",res)

    if(!res.ok){
        return (
            <div>Post not found</div>
        )
    }
    const post = await res.json()



    return (
        <>
        {post? 
           <PostCard post={post} />:
           <div>Post not found</div>
    }
        </>
    )
}




// app/post/[id]/page.tsx

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/post/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {};
  }

  const post = await res.json();

  return {
    title: post.body.slice(0, 60),
    description: post.body,
    openGraph: {
      title: post.body.slice(0, 60),
      description: post.body,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${id}`,
      type: "article",
      images: [
        {
          url: post.photo,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
