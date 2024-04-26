"use client"

import { usePostUserMutation } from "@/lib/features/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react"

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
    const [postUser,{isError,isLoading,isSuccess,data,error}]=usePostUserMutation();

    const HandleSubmit=async(e: React.FormEvent)=>{
        e.preventDefault();
        await postUser({Username:user.Username,Password:user.Password,Email:user.Email});
        if (isSuccess) {
            router.push('/users/auth');
        }
    }

  return (
    <div className="flex flex-1 flex-col justify-center h-full items-center">
        <form action="" onSubmit={HandleSubmit} className="md:w-3/5 w-4/5 h-4/5 space-y-3 flex px-2 flex-col justify-center">
            {isError&&(<span className="text-red-400 text-center w-full block">{JSON.stringify(error)}</span>)}
            <div className="form-group">
                <label htmlFor="Username" className="text-2xl">Username</label>
                <input type="text" id="Username" placeholder="enter your username" required onChange={(e)=>{setUser({...user,Username:e.target.value})}} className="form-input" />
            </div>
            <div className="form-group">
                <label htmlFor="Email" className="text-2xl">Email</label>
                <input type="email" id="Email" placeholder="example@gmail.com" required onChange={(e)=>{setUser({...user,Email:e.target.value})}} className="form-input" />
            </div>
            <div className="form-group">
                <label htmlFor="Password" className="text-2xl">Password</label>
                <input type="password" id="Password" required min={8} pattern="[A-Za-z0-9]+[A-Za-z]+[0-9]+[;:/!]" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="form-input" />
            </div>
            {
                user.Password!=""&&(!user.Password.match("[a-zA-Z]+[a-zA-Z0-9]+[;?,@]"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers with at least one character among</p>
            }
            <div className="form-group">
                <label htmlFor="ConfirmPw" className="text-2xl">ConfirmPw</label>
                <input type="password" id="ConfirmPw" required onChange={(e)=>{setUser({...user,ConfirmPassword:e.target.value})}} className="form-input" />
            </div>
            {
                user.Password!=""&&user.ConfirmPassword!=""&&user.ConfirmPassword!=user.Password&&<p className="text-red-400">ConfirmPassword must be equal to Password</p>
            }
            <div className="w-full justify-between flex  md:h-14 h-28 md:flex-row flex-col items-center">
                <button className="btn-submit" type="submit">Submit</button>
                <Link href="/login" className="text-blue-400 hover:underline">You have acount <strong>SignIn</strong></Link>
            </div>
        </form>
    </div>
  )
} 
