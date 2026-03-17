"use client"
import { useEffect, useState } from "react"
import ListingCard from "@/app/components/ListingCard"
import { useParams } from "next/navigation";

export default  function Listing() {

    const params = useParams();
    const id = params.id as string
    
    const [listing, setListing] = useState(null)


    useEffect(() => {

        async function Getlisting() {

            const res = await fetch(`http://localhost:3000/api/listing/${id}`)

            if (!res.ok) {
                alert("Lisitng not found")
                return
            }


            const listing = await res.json();
            setListing(listing)

        }

        if(id)Getlisting()

    }, [id])

    return (
        <>
            <div className=" max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="md:col-span-3">
                    {listing ? <ListingCard listing={listing} /> : <div>Listing not found</div>}
                </div>

            </div>
        </>
    )

}