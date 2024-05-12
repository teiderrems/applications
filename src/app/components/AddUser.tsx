"use client"

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useState } from "react"
import { CustomType } from "../components/ApplicationDetail";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const UserRole=['admin','user','guest'];

export default function AddUser({setHandleAdd,setIsAdd}:{setHandleAdd:React.Dispatch<SetStateAction<boolean>>,setIsAdd:React.Dispatch<SetStateAction<boolean>>}) {

    const [user,setUser]=useState<{
        Username:string
        Password:string
        Email:string
        ConfirmPassword:string
        Role:string
    }>({
        Username:"",
        Password:"",
        Email:"",
        ConfirmPassword:"",
        Role:'user'
    });
    const router=useRouter();
    
    const [response,setResponse]=useState<CustomType>();

    const [show,setShow]=useState(false);
    const [showC,setShowC]=useState(false);
    const [reload,setReload]=useState(false);
    const pathname=usePathname();
    const HandleSubmit=async(e: React.FormEvent)=>{
        e.preventDefault();
        setResponse({...response,status:0,data:null,isLoading:true,isError:false,error:"",isSuccess:false})
        try {
            const res=await Axios.post("users",{Username:user.Username,Password:user.Password,Email:user.Email,Role:user.Role});
            if (res.status==201 || res.status==200) {
                setHandleAdd(state=>!state);
                setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
                setIsAdd(state=>!state);
            }
        } catch (error:any) {
            setResponse({...response,error:error.message,isError:true,isLoading:false});
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

    },[response,reload]);

  return (
    <div className="wrap-form fixed inset-0 w-full h-full  opacity-100 z-10">
        <div onClick={()=>setHandleAdd(state=>!state)} className="absolute inset-1 bg-blue-50 z-0"></div>
        <form action="" onSubmit={HandleSubmit} className="md:w-3/5 w-5/6 h-4/5 space-y-3  z-10 flex px-2 bg-white rounded-md shadow flex-col justify-center">
        <h1 className="text-gray-400 text-justify">Add User</h1>
            <div className=" flex md:flex-row flex-col h-20 justify-between">
                <label htmlFor="Username" className="text-xl flex-1  md:translate-y-1">Username</label>
                <div className='flex justify-between md:w-5/6 md:h-3/5 h-full rounded-md'>
                  <input onChange={(e)=>setUser({...user,Username:e.target.value})} placeholder="enter your username"  pattern="[a-zA-Z0-9]+" className='w-4/6 mr-1 shadow pl-1 rounded-md' type="text" required minLength={4} />
                    <div className='flex space-x-2'>
                      <label htmlFor="role" className='flex-1 md:translate-y-2'>Role</label>
                      <select name="role" defaultValue={user.Role} id="role" onChange={(e)=>setUser({...user,Role:e.target.value})} className='rounded-md shadow'>
                          {
                            UserRole.map(r=>(<option value={r} key={r} className=' uppercase'>{r}</option>))
                          }
                        </select>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="Email" className="text-xl">Email</label>
                <input type="email" id="Email" placeholder="example@gmail.com" required onChange={(e)=>{setUser({...user,Email:e.target.value})}} className="form-input" />
            </div>
            <div className="form-group">
                <label htmlFor="Password" className="text-xl">Password</label>
                <div className="flex w-full shadow  form-input">
                    <input type={show?"text":"password"} id="Password" required min={8} pattern="[a-zA-Z0-9;?,@]{8,15}" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="flex-1 pl-2 rounded-s-md" />
                    {show?(<button onClick={()=>setShow(!show)} className="w-1/12 h-full border-l"><EyeOutlined/></button>): (<button onClick={()=>setShow(!show)}  className="w-1/12 h-full  border-l"><EyeInvisibleOutlined /></button>)}
                </div>
            </div>
            {
                user.Password!=""&&(!user.Password.match("[a-zA-Z0-9;?,@]{8,15}"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers</p>
            }
            <div className="form-group">
                <label htmlFor="ConfirmPw" className="text-xl">ConfirmPw</label>
                <div className="flex w-full shadow form-input">
                    <input type={showC?"text":"password"} id="ConfirmPw" required onChange={(e)=>{setUser({...user,ConfirmPassword:e.target.value})}} className="flex-1 pl-2 rounded-s-md" />
                    {showC?(<button onClick={()=>setShowC(!showC)} className="w-1/12 h-full border-l"><EyeOutlined/></button>): (<button onClick={()=>setShowC(!showC)}  className="w-1/12  border-l"><EyeInvisibleOutlined /></button>)}
                </div>
            </div>
            {
                user.Password!=""&&user.ConfirmPassword!=""&&user.ConfirmPassword!=user.Password&&<p className="text-red-400">ConfirmPassword must be equal to Password</p>
            }
            <div className="w-full md:justify-start flex  md:h-14 h-28 md:flex-row flex-col items-center">
                <button className="btn-submit" type="submit">Submit</button>
            </div>
        </form>
    </div>
  )
} 
