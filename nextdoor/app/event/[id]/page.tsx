import EventCard from "@/app/components/EventCard"

export default async function Event({ params }: { params: Promise<{ id: string }> }){

  
const {id} = await params;

console.log("id in event page",id);

    const res = await fetch(`http://localhost:3000/api/event/${id}`)

    if(!res.ok){
        return(
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                Event not found
            </div>
        )
    }

    const event = await res.json();
        console.log("event in event/id",event)
//     const event =   {
//     name:"Alley yard sale",
//     startDate:"23 Jan",
//     endDate:"24 Jan",
//     startTime:"10:30PM",
//     endTime:"11:00PM",
//     image:"https://us1-photo.nextdoor.com/post_photos/cd/ea/cdeaaefeebb5751fc4759369c6f5d027.jpeg?request_version=v2&sizing=linear&resize_type=resize&output_type=webp",
//     address:"44960 11th Street West, New York, America ",
//     description:"Come to the back of the house. Alley entrance gate will be half way open. Signs will be out. Make sure to message us will continue to host yard sales every other week. This event is happening this Friday, Saturday and Sunday. January 23rd, 24th and 25th.",
//     user:{
//         name:"Daljeet Mahal",
//         city:"Chandigarh"
//     }
//   }

    return(
        <>
       <div className=" max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          
   
      
              

        <div className="md:col-span-2">
            {event? <EventCard event={event}/>:<div>Event not found</div>}

        </div>
        </div>
        </>
    )

}