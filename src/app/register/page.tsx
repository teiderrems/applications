"use client"

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"
import { CustomType } from "../components/ApplicationDetail";

export default function Register() {

    const [user,setUser]=useState<{
        Username:string
        Password:string
        Email:string
        ConfirmPassword:string
    }>({
        Username:"",
        Password:"",
        Email:"",
        ConfirmPassword:""
    });
    const router=useRouter();
    
    const [response,setResponse]=useState<CustomType>();
    const HandleSubmit=async(e: React.FormEvent)=>{
        e.preventDefault();
        setResponse({...response,status:0,data:null,isLoading:true,isError:false,error:"",isSuccess:false})
        try {
            const res=await Axios.post("users",{Username:user.Username,Password:user.Password,Email:user.Email});
            if (res.status==201 || res.status==200) {
                setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
                router.push('/login');
            }
        } catch (error:any) {
            setResponse({...response,error:error.message,isError:true,isLoading:false});
        }
    }

    useEffect(()=>{

    },[response]);

  return (
    <div className="wrap-form">
        <form action="" onSubmit={HandleSubmit} className="md:w-3/5 w-5/6 h-4/5 space-y-3 flex px-2 bg-white rounded-md shadow flex-col justify-center">
            {response?.isError&&(<p className="text-justify text-red-400">{response?.error}</p>)}
            <div className="form-group">
                <label htmlFor="Username" className="text-2xl">Username</label>
                <input type="text" pattern="[a-zA-Z0-9]*" id="Username" placeholder="enter your username" required onChange={(e)=>{setUser({...user,Username:e.target.value})}} className="form-input" />
            </div>
            <div className="form-group">
                <label htmlFor="Email" className="text-2xl">Email</label>
                <input type="email" id="Email" placeholder="example@gmail.com" required onChange={(e)=>{setUser({...user,Email:e.target.value})}} className="form-input" />
            </div>
            <div className="form-group">
                <label htmlFor="Password" className="text-2xl">Password</label>
                <input type="password" id="Password" required min={8} pattern="[a-zA-Z0-9;?,@]{7,15}[;?,@][a-zA-Z0-9;?,@]*" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="form-input" />
            </div>
            {
                user.Password!=""&&(!user.Password.match("[a-zA-Z0-9;?,@]{7,15}[;?,@][a-zA-Z0-9;?,@]*"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers with at least one character among</p>
            }
            <div className="form-group">
                <label htmlFor="ConfirmPw" className="text-2xl">ConfirmPw</label>
                <input type="password" id="ConfirmPw" required onChange={(e)=>{setUser({...user,ConfirmPassword:e.target.value})}} className="form-input" />
            </div>
            {
                user.Password!=""&&user.ConfirmPassword!=""&&user.ConfirmPassword!=user.Password&&<p className="text-red-400">ConfirmPassword must be equal to Password</p>
            }
            <div className="w-full justify-around flex  md:h-14 h-28 md:flex-row flex-col items-center">
                <button className="btn-submit" type="submit">Submit</button>
                <Link href="/login" className="text-blue-400 hover:underline">You have acount <strong>SignIn</strong></Link>
            </div>
        </form>
    </div>
  )
} 
