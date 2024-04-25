"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
    const pathname=usePathname();

    const router=useRouter();
    const LogOut=()=>{
      localStorage.removeItem("token");
      router.push(`/login?ReturnUrl=${pathname}`);
    }
    const getPath=()=>{
        return pathname.split('/').join('>');
    }
    useEffect(()=>{

    },[localStorage.getItem("token")]);

  return (
    <div className="flex flex-row h-12 justify-between items-center  w-full shadow">
        <span className=" capitalize">{getPath()}</span>
        {
          localStorage.getItem("token")?<button onClick={LogOut} className="about">LogOut</button>:<Link href="/about" className="about">About</Link>
        }
    </div>
  )
}
