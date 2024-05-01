"use client"
import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useState } from "react";

export type Props={
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

export type CustomType={
    data?:any,
    isError?:boolean;
    isSuccess?:boolean;
    status?:number;
    isLoading?:boolean;
    error?:string;
}

export default function ApplicationDetail({application,setShowDetail,setIsAdd}:{application:Props,setIsAdd:React.Dispatch<SetStateAction<boolean>>,setShowDetail:React.Dispatch<SetStateAction<boolean>>}) {
    
    const status=["success","pending","postponed"];

    const [response,setResponse]=useState<CustomType>();
    const [currentApp,setCurrentApp]=useState(application);
    const pathname=usePathname();
    const router=useRouter();
    const HandleClick=async()=>{
        setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
        try {
            const res=await Axios.put("applications/"+application._id,currentApp,{
                headers:{
                    "Authorization":window.localStorage?("Bearer "+window.localStorage.getItem("token")):''
                }
            });
            if (res.status==201 || res.status==200) {
                setShowDetail(state=>!state);
                setResponse({...response,isLoading:false,status:res.status,data:res.data,isSuccess:true})
                setIsAdd(state=>!state);
            }
        } catch (error:any) {
            if (error.response.status==401) {
                localStorage.removeItem("token");
                router.push(`/login?ReturnUrl=${pathname}`);
            }
        }

    }

    const HandleDelete=async()=>{
        
        setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
        try {
            const res=await Axios.delete("applications/"+application._id,{
                headers:{
                    "Authorization":window.localStorage?("Bearer "+window.localStorage.getItem("token")):''
                }
            });
            router.push(pathname);
            if (res.status==204) {
                setResponse({...response,isLoading:false,status:res.status,data:res.data,isSuccess:true});
                setShowDetail(state=>!state);
            }
        } catch (error:any) {
            if (error.response.status==401) {
                localStorage.removeItem("token");
                router.push(`/login?ReturnUrl=${pathname}`);
            }
        }
    }

    useEffect(()=>{
    },[currentApp,response]);
  return (
   <div className="fixed inset-0  flex justify-center items-center opacity-80 flex-col">
        <div onClick={()=>setShowDetail(state=>!state)} className="absolute inset-0 min-h-screen bg-gray-700 opacity-100 z-0"></div>
        <div className="flex flex-col w-4/6 h-5/6 p-2 justify-between items-center bg-white z-10 opacity-100 rounded shadow">
            <div className="flex md:flex-row flex-col justify-between w-5/6">
                <input type="text" onChange={(e)=>setCurrentApp({...currentApp,Title:e.target.value})} className="text-wrap mb-2 md:mb-0 shadow shadow-blue-200 border-2 rounded-md md:w-3/4 w-full" value={currentApp.Title} />
                <select name="status"  onChange={(e)=>setCurrentApp({...currentApp,Status:e.target.value})} className=" shadow shadow-blue-200 border-2 rounded-md" id="status">
                    
                    {
                        status.map(s=>(<option key={s} selected={currentApp.Status==s} value={s} className=" uppercase">{s}</option>))
                    }
                </select>
            </div>
            <div className="flex flex-col w-5/6 h-2/3">
                <div className=" w-full h-1/2">
                    <textarea name="description"  onChange={(e)=>setCurrentApp({...currentApp,Description:e.target.value})} className="w-full h-5/6 shadow shadow-blue-200 border-2 rounded-md" id="description" value={currentApp.Description}></textarea>
                </div>
                <div className="w-full h-1/2">
                    <textarea name="description"  onChange={(e)=>setCurrentApp({...currentApp,JobDescription:e.target.value})} className="w-full h-5/6 shadow shadow-blue-200 border-2 rounded-md" id="description" value={currentApp.JobDescription}></textarea>
                </div>
            </div>
            <div className="flex w-5/6 md:flex-row flex-col justify-between">
                <button onClick={HandleClick} className=" bg-blue-500 md:w-2/12 w-full text-xl hover:text-white mb-2 md:mb-0 rounded-md shadow">Save</button>
                <button onClick={HandleDelete} className=" bg-red-400 md:w-2/12 w-full text-xl hover:text-white rounded-md shadow" >Delete</button>
            </div>
        </div>
   </div>
  )
}
