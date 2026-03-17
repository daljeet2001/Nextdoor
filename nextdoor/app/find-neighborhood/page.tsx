"use client"

import { useState, useEffect } from "react"




export default function FindNeighborhood() {


    const [neighborhoods, setNeighborhoods] = useState([])

    useEffect(() => {


        async function fetchNeighborhoodds() {
            const res = await fetch("/api/neighborhoods/all");
            if (res) {
                const data = await res.json();
                console.log("data from neighborhoods/all", data)
                setNeighborhoods(data)
            }
        }

        fetchNeighborhoodds();
    }, [])




    return (
        <div className="flex flex-col w-full h-[800px] ">

            <div className=" h-[311px] bg-[url('/discover.jpeg')] bg-cover bg-center flex items-end justify-start" >

            </div>


            <div className="flex flex-col p-4 gap-2">
                <div className="text-3xl font-bold text-black">Available PIN Codes</div>
{neighborhoods?.length>0 ?   <div className="flex  flex-wrap gap-4 mt-4 text-sm font-semibold">
                    {neighborhoods?.map((n: any, index) => (

         
                            <div key={index}>{n.pincode}</div>
                      

                    ))}
                </div>:<div className="flex mt-4 text-sm font-semibold">
                    No PIN codes available
                    </div>}
              

            </div>



        </div>


    )




}

