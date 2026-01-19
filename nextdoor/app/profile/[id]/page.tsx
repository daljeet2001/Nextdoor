

import ProfileHeader from "../../components/ProfileHeader"
import ProfilePosts from "../../components/ProfilePosts"
import Dashboard from "../../components/Dashboard"
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions} from "@/lib/auth"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session =  await getServerSession(authOptions)

  console.log("userId is ", id)
  console.log("session id",session?.user?.id)

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {/* profile card */}
        <ProfileHeader userId={id}/>
        { session?.user?.id === id   &&        <Dashboard userId={id}/>}
 
      
        <ProfilePosts userId={id}/>



        {/* posts cards */}

      </div>

    </div>

  )
}

