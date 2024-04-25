"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {

  const pathname=usePathname();
  return (
    <nav className="flex flex-col flex-1 text-justify w-full m-2">
        <Link href="/application" className={`${pathname==='user'&&'active'}`}>Application</Link>
        <Link href="/user" className={`${pathname==='user'&&'active'}`}>User</Link>
    </nav>
  )
}
