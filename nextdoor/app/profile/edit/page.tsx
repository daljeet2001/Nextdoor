"use client"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation" 


export default function EditProfile() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const [user, setUser] = useState<any>(null)
  const [bio, setBio] = useState("")
  const [city, setCity] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()

  const coverRef = useRef<HTMLInputElement>(null)
  const profileRef = useRef<HTMLInputElement>(null)

  async function handleCoverUpload(file?: File) {

    if (!file || !userId) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`/api/profile/${userId}/cover`, {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    setUser((prev: any) => ({ ...prev, backgroundImage: data.backgroundImage }))

  }


  async function handleProfileUpload(file?: File) {

    if (!file || !userId) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`/api/profile/${userId}/avatar`, {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    setUser((prev: any) => ({ ...prev, image: data.image }))

  }





  async function handleSave() {
    const upadted = await fetch(`/api/profile/${userId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city,
        name,
        bio
      })
    }
    )

    router.back()
  }

  useEffect(() => {

    async function fetchUser() {
      if (!userId) {
        return
      }

      const user = await fetch(`/api/profile/${userId}`)
      if (user) {
        const data = await user.json()
        setUser(data)
        setBio(data.bio)
        setCity(data.city)
        setName(data.name)
      }
    }

    fetchUser()

  }, [userId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

      <div className="md:col-span-3 space-y-4">

        <div className="w-full h-[auto] flex flex-col  rounded-3xl ">

          <div className="flex items-center  gap-2 px-4 py-3 ">

            <button className="p-2 rounded-full" onClick={()=>router.back()}>
              <IoIosArrowBack size={28} />
            </button>
            <h1 className="text-lg font-semibold">Edit Profile</h1>

          </div>

          <div className="relative h-48 ">

            <img src={user?.backgroundImage ? user.backgroundImage :
              "https://i.pinimg.com/1200x/5d/a8/b1/5da8b1e151dea4faea882c9d7cb2242b.jpg"} className="object-cover  w-full h-[200px] rounded-t-3xl" />

            <button onClick={() => coverRef.current?.click()} className="absolute inset-x-0 top-1/2 mx-auto flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium w-fit">
              <IoImage size={24} />
              Upload cover photo
            </button>

            <input
              type="file"
              hidden
              accept="/*image"
              ref={coverRef}
              onChange={(e) => handleCoverUpload(e.target.files?.[0])}
            />

          </div>


          <div className=" flex flex-col gap-3 w-full  p-4 border-t-0 shadow-sm rounded-b-3xl  relative">

            <div className="relative px-4">

              <div className=" -mt-12 w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-4xl font-semibold overflow-hidden rounded-full">
                {
                  user?.image ? (
                    <img src={user.image} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0].toUpperCase() || "U"
                  )
                }
              </div>

              <button className="absolute left-20 top-6 bg-white p-2 rounded-full" onClick={()=>profileRef.current?.click()}>
                <FaCloudUploadAlt size={16} />
              </button>

  
              <input
                type="file"
                onChange={(e) => handleProfileUpload(e.target.files?.[0])}
                accept="/*image"
                ref={profileRef}
                hidden
              />

            </div>

            <div className=" pt-10 flex flex-col gap-4 w-full">
              
              <label className="text-lg font-semibold" htmlFor="name">Name</label>
              <input
                id="name"
                value={name}
                className="w-full  bg-transparent border border-[#5E6B84] rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#5E6B84]"
                onChange={(e) => setName(e.target.value)} />

              <label className="text-lg font-semibold" htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio || ""}

                className="w-full min-h-[120px] bg-transparent border border-[#5E6B84] rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#5E6B84] pt-2"
                onChange={(e) => setBio(e.target.value)} />

              <label className="text-lg font-semibold " htmlFor="city">HomeTown</label>
              <div className="flex items-center ">
{/* 
                <svg data-state="main" data-version="v2" width="24" height="24" fill="none" viewBox="0 0 24 24" data-icon="map" data-block="16" aria-hidden="true" className="Styled_color-sm__zpop7k3 SvgIcon__7lpub83 v2__1a95w150" style={{ "--color-sm__zpop7k0": "var(--nd-color-fgPrimary)", "--nd-icon-height": " 24px", "--nd-icon-width": "24px" } as React.CSSProperties}><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" fillRule="evenodd" d="M7.728 18.01c-.902-1.094-1.823-2.373-2.522-3.722C4.511 12.948 4 11.472 4 10c0-4.452 3.548-8 8-8s8 3.548 8 8c0 1.472-.511 2.948-1.206 4.288-.7 1.35-1.62 2.628-2.522 3.723-1.291 1.567-2.732 2.986-4.272 4.306-1.54-1.32-2.98-2.739-4.272-4.306ZM12 4c-3.348 0-6 2.652-6 6 0 1.028.364 2.177.981 3.368.614 1.182 1.443 2.341 2.29 3.371A32.598 32.598 0 0 0 12 19.65a32.602 32.602 0 0 0 2.728-2.91c.848-1.03 1.677-2.189 2.29-3.371.618-1.191.982-2.34.982-3.368 0-3.348-2.652-6-6-6Z" clipRule="evenodd"></path></svg> */}

                <input
                  id="city"
                  className="w-full  bg-transparent border border-[#5E6B84] rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#5E6B84]"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <button
                onClick={handleSave}
                className="rounded-3xl max-w-3xs py-2 px-4 border-none font-semibold text-[#ABB7CC] bg-[#454647] my-2">Update neighborhood</button>
            </div>
          </div>

        </div>


      </div>

    </div>
    // </div>
  )
}