"use client"
import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useState } from "react";
import { UserType } from "./UserItem";
import { CustomType } from "./ApplicationDetail";


export default function UserDetail({user,setShowDetail,setIsAdd,canEdit}:{canEdit:boolean,user:UserType,setIsAdd:React.Dispatch<SetStateAction<boolean>>,setShowDetail:React.Dispatch<SetStateAction<boolean>>}) {

    const [response,setResponse]=useState<CustomType>({ isLoading: false, status: 0, data: undefined,error:undefined, isSuccess: false });
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
            if (res.status==204) {
                router.push('/register');
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
    },[currentUser,response,reload,canEdit]);
  return (
   <div className="fixed inset-0  flex justify-center items-center flex-col">
        <div onClick={()=>setShowDetail(state=>!state)} className="absolute inset-0 bg-blue-50 z-0"></div>
        <div className="flex flex-col w-4/6 h-4/6  md:h-5/6 md:p-5 p-4 justify-center space-y-4 items-center bg-white z-10 opacity-100 rounded-md shadow">
            <div className="w-full h-32 md:h-32 flex md:mt-4 md:space-x-10  md:space-y-0 space-y-4 md:flex-row flex-col">
                <input type="text" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Username:e.target.value})} placeholder="Enter your Username" className="md:w-5/6 w-full flex-1 pl-1 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="username" value={currentUser.Username} />
                <input type="text" value={currentUser.Role} disabled={(!canEdit)} onChange={(e)=>setCurrentUser({...currentUser,Role:e.target.value})} className="flex-1 md:h-4/6 shadow pl-1 shadow-blue-200 border-2 rounded-md"/>
            </div>
            <div className=" w-full h-16 flex  flex-col">
                <input name="Email" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Email:e.target.value})} type="email"  className="w-full flex-1 h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="email" value={currentUser.Email}></input>
            </div>
            <div className=" w-full h-16 flex  flex-col">
                <input name="Firstname" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Firstname:e.target.value})}  className="w-full flex-1 h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="firstname" placeholder="Enter your Firstname" value={currentUser.Firstname}></input>
            </div>
            <div className="w-full h-16 md:h-20 flex  flex-col">
                <input name="Lastname" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Lastname:e.target.value})} placeholder="Enter your Lastname" className="w-full flex-1 h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="lastname" value={currentUser.Lastname}></input>
            </div>
            <div className="flex w-full h-32 md:space-x-36 md:flex-row flex-col justify-between">
                <button onClick={HandleClick} className=" bg-blue-500 md:w-1/12 flex-1 md:h-2/3  w-full text-xl hover:text-white mb-2 md:mb-0 rounded-md shadow">Save</button>
                <button onClick={HandleDelete} className=" bg-red-400 md:w-1/12 flex-1 md:h-2/3  w-full text-xl hover:text-white rounded-md shadow" >Delete</button>
            </div>
        </div>
   </div>
  )
}
