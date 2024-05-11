"use client"
import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useState } from "react";
import { UserType } from "./UserItem";
import { CustomType } from "./ApplicationDetail";


export default function UserDetail({user,setShowDetail,setIsAdd}:{user:UserType,setIsAdd:React.Dispatch<SetStateAction<boolean>>,setShowDetail:React.Dispatch<SetStateAction<boolean>>}) {

    const [response,setResponse]=useState<CustomType>();
    const [currentUser,setCurrentUser]=useState(user);
    const pathname=usePathname();
    const [reload,setReload]=useState(false);
    const router=useRouter();
    const HandleClick=async()=>{
        setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
        try {
            const res=await Axios.put("users/"+user._id,currentUser,{
                headers:{
                    "Authorization":window.sessionStorage?("Bearer "+window.sessionStorage.getItem("token")):''
                }
            });
            if (res.status==201 || res.status==200) {
                setShowDetail(state=>!state);
                setResponse({...response,isLoading:false,status:res.status,data:res.data,isSuccess:true})
                setIsAdd(state=>!state);
            }
        } catch (error:any) {
            if (error.response.status==401) {
                try {
                  const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
                  if (res.status==201 || res.status==200) {
                    sessionStorage.setItem("token",res.data.token);
                    sessionStorage.setItem("refresh",res.data.refresh);
                    if (sessionStorage.getItem("token")) {
                      setReload(true);
                    }
                  }
                } catch (err:any) {
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("refresh");
                  if (err.response.status == 401) {
                    router.push(`/login?ReturnUrl=${pathname}`);
                  }
                  setReload(false);
                }
              }
        }

    }

    const HandleDelete=async()=>{
        
        setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
        try {
            const res=await Axios.delete("users/"+user._id,{
                headers:{
                    "Authorization":window.sessionStorage?("Bearer "+window.sessionStorage.getItem("token")):''
                }
            });
            router.push(pathname);
            if (res.status==204) {
                setResponse({...response,isLoading:false,status:res.status,data:res.data,isSuccess:true});
                setShowDetail(state=>!state);
                setIsAdd(state=>!state);
            }
        } catch (error:any) {
            if (error.response.status==401) {
                try {
                  const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
                  if (res.status==201 || res.status==200) {
                    sessionStorage.setItem("token",res.data.token);
                    sessionStorage.setItem("refresh",res.data.refresh);

                    // setIsAdd(state=>!state);
                    if (sessionStorage.getItem("token")) {
                      setReload(true);
                    }
                  }
                } catch (err:any) {
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("refresh");
                  if (err.response.status == 401) {
                    router.push(`/login?ReturnUrl=${pathname}`);
                  }
                  setReload(false);
                }
              }
        }
    }

    useEffect(()=>{
    },[currentUser,response,reload]);
  return (
   <div className="fixed inset-0  flex justify-center items-center flex-col">
        <div onClick={()=>setShowDetail(state=>!state)} className="absolute inset-0 bg-blue-50 z-0"></div>
        <div className="flex flex-col w-4/6 h-5/6 p-2 md:h-4/6 justify-around items-center bg-white z-10 opacity-100 rounded shadow">
            <div className="w-full h-20 flex md:space-x-1  md:space-y-0 space-y-4 md:flex-row flex-col">
                <input type="text" onChange={(e)=>setCurrentUser({...currentUser,Username:e.target.value})} placeholder="Enter your Username" className="md:w-4/6 w-full h-1/2 pl-1 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="username" value={currentUser.Username} />
                <input type="text" value={currentUser.Role} onChange={(e)=>setCurrentUser({...currentUser,Role:e.target.value})} className="flex-1 md:h-4/6 shadow pl-1 shadow-blue-200 border-2 rounded-md"/>
            </div>
            <div className=" form-group px-2">
                <input name="Email" onChange={(e)=>setCurrentUser({...currentUser,Email:e.target.value})} type="email"  className="w-full px-2 md:h-4/6 h-5/6 shadow shadow-blue-200 border-2 rounded-md" id="email" value={currentUser.Email}></input>
            </div>
            <div className=" form-group px-2">
                <input name="Firstname" onChange={(e)=>setCurrentUser({...currentUser,Firstname:e.target.value})}  className="w-full h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="firstname" placeholder="Enter your Firstname" value={currentUser.Firstname}></input>
            </div>
            <div className="form-group px-2">
                <input name="Lastname" onChange={(e)=>setCurrentUser({...currentUser,Lastname:e.target.value})} placeholder="Enter your Lastname" className="w-full h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="lastname" value={currentUser.Lastname}></input>
            </div>
            <div className="flex w-5/6 md:flex-row flex-col justify-between">
                <button onClick={HandleClick} className=" bg-blue-500 md:w-2/12 w-full text-xl hover:text-white mb-2 md:mb-0 rounded-md shadow">Save</button>
                <button onClick={HandleDelete} className=" bg-red-400 md:w-2/12 w-full text-xl hover:text-white rounded-md shadow" >Delete</button>
            </div>
        </div>
   </div>
  )
}
