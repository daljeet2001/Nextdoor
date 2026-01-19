 "use client"

 type Props = {
    view:string;
    setView:(v:any)=>void;
 };

 import {
    Home,
    ShoppingBag,
    CalendarCheck
 } from "lucide-react";

 import { RiHome2Fill } from "react-icons/ri";
 import { FaShoppingCart } from "react-icons/fa";
 import { IoPeopleSharp } from "react-icons/io5";
import { FaCalendarCheck } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

 export default function Sidebar({view,setView}:Props){
    const items =[
        {id:"home", label:"Home", icon:FaHome},
        {id:"sale", label:"For Sale & Free", icon:FaShoppingCart},
        {id:"events", label:"Events", icon:FaCalendarAlt},
          {id:"groups", label:"Groups", icon:IoPeopleSharp}
    ]

    return (
        <aside className=" h-full  p-4 space-y-2">
            {items.map(({id,label,icon:Icon})=>{
                const active = view === id;

                return(
                    <button key={id}
                    onClick={()=>setView(id)}
                    className={`w-full flex  items-center  gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? "text-black":"hover:text-gray-400"}`}>  
                    <Icon size={24}/>
                    {label}

                    </button>

                )
            })}

        </aside>
    )
 }