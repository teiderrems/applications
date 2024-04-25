"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname=usePathname();

    const getPath=()=>{
        return pathname.split('/').join('>');
    }
  return (
    <div className="flex flex-row h-12 justify-between items-center  w-full shadow">
        <span className=" capitalize">{getPath()}</span>
        <Link href="/about" className=" mr-2 hover:rounded-xl hover:animate-pulse hover:bg-blue-400 hover:border p-1 border-gray-300">About</Link>
    </div>
  )
}
