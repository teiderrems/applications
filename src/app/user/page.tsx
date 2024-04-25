"use client"

import { usePostUserMutation } from "@/lib/features/users";
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
    const [postUser,{isError,isLoading,isSuccess,data}]=usePostUserMutation();

    const HandleSubmit=(e: React.FormEvent)=>{
        e.preventDefault();
        postUser({Username:user.Username,Password:user.Password,Email:user.Email});
        if (isSuccess) {
            router.replace('/users/auth');
        }
    }

  return (
    <div className="flex flex-1 flex-col justify-center h-full  items-center">
        <form action="" onSubmit={HandleSubmit} className="w-4/5 h-4/5 flex rounded-md shadow px-2 flex-col justify-center">
            {isError&&(<span className="text-red-400 text-center w-full block">Something wrong {data}</span>)}
            {isSuccess&&(<span className="text-green-400 text-center w-full block">Register success{data}</span>)}

            <div className="w-full h-14 md:justify-between flex md:flex-row flex-col items-center">
                <label htmlFor="Username" className="text-2xl">Username</label>
                <input type="text" id="Username" required onChange={(e)=>{setUser({...user,Username:e.target.value})}} className="rounded-md shadow  h-3/4 w-3/4 focus:shadow-inner shadow-blue-200" />
            </div>
            <div className="w-full flex md:justify-between h-14 md:flex-row flex-col items-center">
                <label htmlFor="Email" className="text-2xl">Email</label>
                <input type="email" id="Email" required onChange={(e)=>{setUser({...user,Email:e.target.value})}} className="rounded-md shadow  h-3/4 w-3/4 focus:shadow-inner shadow-blue-200" />
            </div>
            <div className="w-full md:justify-between flex h-14 md:flex-row flex-col items-center">
                <label htmlFor="Password" className="text-2xl">Password</label>
                <input type="password" id="Password" required min={8} pattern="[A-Za-z0-9]+[A-Za-z]+[0-9]+[;:/!]" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="rounded-md shadow  w-3/4 h-3/4 focus:shadow-inner shadow-blue-200" />
                {/* {
                    user.Password!=""&&(!user.Password.match("[A-Za-z0-9]+[A-Za-z]+[0-9]+[;:/!]"))&&<span className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers with at least one character among</span>
                } */}
            </div>
            <div className="w-full md:justify-between flex h-14 md:flex-row flex-col items-center">
                <label htmlFor="Password" className="text-2xl">ConfirmPw</label>
                <input type="password" id="Password" required onChange={(e)=>{setUser({...user,ConfirmPassword:e.target.value})}} className="rounded-md shadow  w-3/4 h-3/4 focus:shadow-inner shadow-blue-200" />
                {/* {
                    user.Password!=""&&user.ConfirmPassword!=""&&user.ConfirmPassword!=user.Password&&<span className="text-red-400">ConfirmPassword must be equal to Password</span>
                } */}
            </div>
            <div className="w-full md:justify-start flex h-14 md:flex-row flex-col items-center">
                <button className="md:w-1/5 w-full rounded-lg bg-blue-400 h-3/4" type="submit">Submit</button>
            </div>
        </form>
    </div>
  )
} 
