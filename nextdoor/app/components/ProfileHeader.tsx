"use client"
import  Link  from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
export default function ProfileHeader({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null)
  const session = useSession()
  console.log("sessiopn in profileGeader",session)

  const isOwner = session?.data?.user?.id === userId


  useEffect(() => {
    async function fetchUser() {
      if (!userId) {
        return
      }
      const res = await fetch(`/api/profile/${userId}`)
      if (res) {
        const data = await res.json()
console.log("data after migration",data)
        setUser(data)
      }
    }
    fetchUser()
  }, [userId])
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

      <div className="md:col-span-3 space-y-4">

        <div className="w-full h-[414px] flex flex-col rounded-3xl ">

          <img src={user?.backgroundImage ? user.backgroundImage :
            "https://i.pinimg.com/1200x/5d/a8/b1/5da8b1e151dea4faea882c9d7cb2242b.jpg"} className="object-cover rounded-t-3xl w-full h-[200px]" />




          <div className=" flex flex-col gap-2 w-full  p-4 border-t-0 shadow-sm rounded-b-3xl  relative">

            <div className=" absolute -top-16  left-4 w-[120px] h-[120px] rounded-full  flex items-center justify-center text-gray-600 bg-gray-200 ">
              {user?.image && user.image.trim()!=""  ? (<img src={user.image} alt="profile_img" className="w-full h-full rounded-full"/>):    (<div className=" text-5xl font-semibold">{user?.name?.[0].toUpperCase() ?? "U"}</div>
          )}
            </div>

            

            <div className=" pt-10 flex flex-col  w-full">

              <div className="text-3xl pt-2">{user?.name}</div>
              {user?.bio && user.bio.trim!="" &&
                <div className="text-sm text-black ">{user?.bio}</div>
                }
                
  <div className="text-sm text-black ">{user?.city}</div>
         

 
              
               

              

     {isOwner &&   <div className="flex items-center gap-1 mt-2">
                    <Link href={{
                      pathname:"/profile/edit" ,
                      query:{userId}
                    }}className="rounded-3xl py-2 px-4 border-none font-semibold text-black bg-[#9BA6B7]">Edit Profile</Link>
                    <button className="rounded-3xl py-2 px-4 border-none font-semibold text-[#ABB7CC] bg-[#454647]">Add business page</button>
                  </div>}

                </div>

           



            </div>


          </div>

        </div>
      </div>

 
  )

}