import CreateGroup from "../components/CreateGroupForm";
import { Suspense }from "react";


export default async function Page(){

  return (
<Suspense fallback={<div>Loading</div>}>
<CreateGroup/>
</Suspense>
  )

}