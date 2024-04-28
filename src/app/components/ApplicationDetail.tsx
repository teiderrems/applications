"use client"
import { useUpdateApplicationMutation } from "@/lib/features/applications";
import { usePathname, useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useState } from "react";

type Props={
    _id?:string;
    Title?:string;
    Description?:string;
    JobDescription?:string;
    Entreprise?:string;
    Adresse?:string;
    Status?:string;
    CreatedAt?:Date;
    UpdatedAt?:Date;
}

export default function ApplicationDetail({application,setShowDetail}:{application:Props,setShowDetail:React.Dispatch<SetStateAction<boolean>>}) {
    
    const status=["success","pending","postponed"];
    const [mutation,{isError,isLoading,isSuccess,data,error}]=useUpdateApplicationMutation();
    const [currentApp,setCurrentApp]=useState(application);
    const pathname=usePathname();
    const router=useRouter();
    const HandleClic=async()=>{
        await mutation({id:application._id,currentApp});
        if (isError && ((error as any).data?.message as string).includes("jwt")) {
            
            router.push(`/login?ReturnUrl=${pathname}`);
            console.log((error as any).data);
        }
    }
    useEffect(()=>{
        
    },[application,isError,isLoading,isSuccess]);
  return (
   <div className="absolute inset-0  flex justify-center items-center opacity-80 flex-col">
        <div onClick={()=>setShowDetail(state=>!state)} className="absolute inset-1 bg-gray-700 opacity-100 z-0"></div>
        <div className="flex flex-col w-4/6 h-5/6 space-y-2 justify-around items-center bg-white z-10 opacity-100 rounded shadow">
            <div className="flex space-x-2 justify-around w-5/6">
                <input type="text" onChange={(e)=>setCurrentApp({...currentApp,Title:e.target.value})} className="text-wrap  shadow shadow-blue-200 border-2 rounded-md" value={currentApp.Title} />
                <select name="status"  onChange={(e)=>setCurrentApp({...currentApp,Status:e.target.value})} className=" shadow shadow-blue-200 border-2 rounded-md" id="status">
                    {
                        status.map(s=>(<option key={s} selected={s==currentApp.Status} value={s} className=" uppercase">{s}</option>))
                    }
                </select>
            </div>
            <div className=" w-5/6">
                <textarea name="description"  onChange={(e)=>setCurrentApp({...currentApp,Description:e.target.value})} className="w-full shadow shadow-blue-200 border-2 rounded-md" id="description" value={currentApp.Description}></textarea>
            </div>
            <div className="w-5/6">
                <textarea name="description"  onChange={(e)=>setCurrentApp({...currentApp,JobDescription:e.target.value})} className="w-full shadow shadow-blue-200 border-2 rounded-md" id="description" value={currentApp.JobDescription}></textarea>
            </div>
            <div className="flex w-5/6 flex-col items-start">
                <button onClick={HandleClic} className=" bg-blue-500 md:w-2/12 w-2/5 text-xl hover:text-white rounded-md shadow">SaveChange</button>
            </div>
        </div>
   </div>
  )
}
