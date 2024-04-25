"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function SideBar() {

  const [user,setUser]=useState<any>(null);
  const pathname=usePathname();
  useEffect(()=>{
    if (window.localStorage&&localStorage.getItem("token")) {
      setUser(JSON.parse(atob(localStorage.getItem("token")!.split('.')[1])));
    }
  },[user]);

  return (
    <>
      {
        user?(
        <nav className="flex flex-col flex-1 py-3 space-y-6 text-justify w-full">
            <Link href="/application" className={`px-2 text-2xl ${pathname=="/application"&&'active'}`}>Application</Link>
            <Link href="/user" className={`px-2 text-2xl ${pathname=="/user"?'active':''}`}>{user?.Email}</Link>
        </nav>
        ):(
          <nav className="flex flex-col flex-1 py-3 space-y-6 text-justify w-full">
              <Link href="/register" className={`px-2 text-2xl ${pathname=="/register"&&'active'}`}>Regiter</Link>
              <Link href="/login" className={`px-2 text-2xl ${pathname=="/login"?'active':''}`}>Login</Link>
          </nav>
        )
      }
    </>
  )
}
