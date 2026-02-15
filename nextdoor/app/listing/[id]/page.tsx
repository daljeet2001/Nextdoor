import ListingCard from "@/app/components/ListingCard"

export default async function Listing({ params }: { params: Promise<{ id: string }> }){

  
const {id} = await params;

console.log("id in listing page",id);

    const res = await fetch(`http://localhost:3000/api/listing/${id}`)

    if(!res.ok){
        return(
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                Lisitng not found
            </div>
        )
    }

    const listing = await res.json();
        console.log("listing in event/id",listing)


// const listing =   {
//     image:"https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-right-side-view-10.jpeg?isig=0",
//     name:"Bullet 350 standard",
//     price:"50,000",
//     createdAt:"2h ago",
//     location:"Sunny enclave,Kharar",
//     description:"Price: Royal Enfield Bullet 350 price for its variant - Bullet 350 Base starts at Rs. 1,89,150. The price for the other variants - Bullet 350 Battalion Black, Bullet 350 Mid and Bullet 350 Top are Rs. 1,91,690, Rs. 2,13,882 and Rs. 2,32,907. The mentioned Bullet 350 prices are the on-road price of Chandigarh"
//   }


    return(
        <>
       <div className=" max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          
   
      
              

        <div className="md:col-span-3">
            {listing? <ListingCard listing={listing}/>:<div>Listing not found</div>}

        </div>
        </div>
        </>
    )

}