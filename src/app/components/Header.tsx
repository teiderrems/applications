"use client"
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import burgerImg from '../../../public/menu.svg';

export default function Header() {
    const pathname=usePathname();
    const [token,setToken]=useState<string>('');
    const router=useRouter();
    
    const LogOut=()=>{
      localStorage.removeItem("token");
      router.push(`/login?ReturnUrl=${pathname}`);
    }
    const getPath=()=>{
        return pathname.split('/').join('>').substring(1);
    }

    useEffect(()=>{
      setToken(localStorage.getItem("token") as string);
    },[token])

  return (
    <div className="flex flex-row h-12 justify-between items-center  w-full border-b">
      <button
        aria-label="toggle button"
        aria-expanded="false"
        id="menu-btn"
        className="cursor-pointer w-7 md:hidden"
        >
          <Image src={burgerImg} alt=""/>
      </button>
        <span className=" capitalize pl-1">{getPath()}</span>
        {
          token?<button onClick={LogOut} className="about">LogOut</button>:<Link href="/about" className="about">About</Link>
        }
    </div>
  )
}
