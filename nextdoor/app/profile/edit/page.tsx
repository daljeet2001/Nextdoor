import EditProfile from "@/app/components/EditProfile";
import { Suspense } from "react";


export default async function Page(){
  return(
    <Suspense fallback={<div>Loading</div>}>
      <EditProfile/>
    </Suspense>
  )

}