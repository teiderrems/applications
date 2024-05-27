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
    const HandleClick=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
        const data=new FormData(document.querySelector('form')!);
        try {
          const res=await Axios.put("users/"+user._id,data,{
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
                try {
                  const res=await Axios.post("users/refresh_token",{refresh:localStorage.getItem("refresh")});
                  if (res.status==201 || res.status==200) {
                    localStorage.setItem("token",res.data.token);
                    localStorage.setItem("refresh",res.data.refresh);
                    if (localStorage.getItem("token")) {
                      setReload(true);
                    }
                  }
                } catch (err:any) {
                  localStorage.removeItem("token");
                  localStorage.removeItem("refresh");
                  if (err.response.status == 401) {
                    router.push(`/login?ReturnUrl=${pathname}`);
                  }
                  setReload(false);
                }
              }
        }

    }

    const HandleDelete=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
        try {
            const res=await Axios.delete("users/"+user._id,{
                headers:{
                    "Authorization":window.localStorage?("Bearer "+window.localStorage.getItem("token")):''
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
                  const res=await Axios.post("users/refresh_token",{refresh:localStorage.getItem("refresh")});
                  if (res.status==201 || res.status==200) {
                    localStorage.setItem("token",res.data.token);
                    localStorage.setItem("refresh",res.data.refresh);
                    if (localStorage.getItem("token")) {
                      setReload(true);
                    }
                  }
                } catch (err:any) {
                  localStorage.removeItem("token");
                  localStorage.removeItem("refresh");
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
        <form className="flex flex-col md:w-3/6 w-4/6 h-5/6 px-4 md:h-5/6 justify-between space-y-3 bg-white z-10 opacity-100 rounded-md shadow" encType="multipart/form-data">
            <h1 className=" text-justify px-4 text-gray-400 my-1">Let is updating your personal informations</h1>
            <div className="w-full flex-1 flex space-x-4 px-4 flex-row">
                <div className="flex-1">
                <label htmlFor="Profile" className="text-xl">Username</label>
                <input type="text" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Username:e.target.value})} placeholder="Enter your Username" className="md:w-5/6  flex-1 pl-1 h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="username" value={currentUser.Username} />
                </div>
                <div className="flex-1 flex flex-col">
                    <label htmlFor="Profile" className="text-xl">Profile</label>
                    <input type="file" name="profile" placeholder="choose your profile" className=" hover:cursor-pointer w-full p-2 h-3/4 rounded-md shadow" id="profile" />
                </div>
            </div>
            <div className=" w-full  px-4 flex-1 flex  flex-col">
                <label htmlFor="Profile" className="text-xl">Email</label>
                <input name="Email" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Email:e.target.value})} type="email"  className="w-full flex-1 h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="email" value={currentUser.Email}></input>
            </div>
            <div className=" w-full  px-4 flex-1 flex  flex-col">
                <label htmlFor="Profile" className="text-xl">Firstname</label>
                <input name="Firstname" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Firstname:e.target.value})}  className="w-full flex-1 h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="firstname" placeholder="Enter your Firstname" value={currentUser.Firstname}></input>
            </div>
            <div className="w-full  px-4 flex-1 flex  flex-col">
                <label htmlFor="Profile" className="text-xl">Lastname</label>
                <input name="Lastname" disabled={canEdit} onChange={(e)=>setCurrentUser({...currentUser,Lastname:e.target.value})} placeholder="Enter your Lastname" className="w-full flex-1 h-5/6 px-2 md:h-4/6 shadow shadow-blue-200 border-2 rounded-md" id="lastname" value={currentUser.Lastname}></input>
            </div>
            <div className="flex w-full  px-4 flex-1 md:space-x-36 md:flex-row flex-col justify-between">
                <button onClick={(e)=>HandleClick(e)} type="submit" className=" bg-blue-500 md:w-1/12 flex-1 md:h-2/3  w-full text-xl hover:text-white mb-2 md:mb-0 rounded-md shadow">Save</button>
                <button onClick={HandleDelete} type="submit" className=" bg-red-400 md:w-1/12 flex-1 md:h-2/3  w-full text-xl hover:text-white rounded-md shadow" >Delete</button>
            </div>
        </form>
   </div>
  )
}
