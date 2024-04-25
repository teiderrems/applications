import Link from "next/link";

export default function SideBar() {
  return (
    <nav className="flex flex-col flex-1 w-full m-2">
        <Link href="/application" className="text-justify">Application</Link>
        <Link href="/" className="text-justify">Profile</Link>
    </nav>
  )
}
