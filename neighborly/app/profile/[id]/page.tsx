

import ProfileHeader from "../../components/ProfileHeader"
import ProfilePosts from "../../components/ProfilePosts"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {/* profile card */}
        <ProfileHeader userId={id}/>
      
        <ProfilePosts userId={id}/>



        {/* posts cards */}

      </div>

    </div>

  )
}

