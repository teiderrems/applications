"use client"
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import boutonX from '../../public/cross.svg';
import { usePathname, useRouter } from "next/navigation";
import  profileImg  from '../../public/defaul.jpeg';
import Link from "next/link";
import Image from "next/image";
import burgerImg from '../../public/menu.svg';
import  Head  from "next/head";
import { EditOutlined, HomeOutlined, LogoutOutlined, ProfileOutlined, SmileOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Space } from "antd";


const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [togel,setTogel]=useState(false)
  const [token,setToken]=useState<string>('');
  const [image,setImage]=useState(burgerImg);
  const [show,setShow]=useState(true)
  const [user,setUser]=useState<any>(null);
  const router=useRouter();
    
    const LogOut=()=>{
      localStorage.removeItem("token");
      setToken('');
      setUser('');
      router.push(`/login?ReturnUrl=${pathname}`);
    }

    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <button onClick={LogOut} className="">LogOut</button>
        ),
        icon:<LogoutOutlined />
      },
      {
        key: '2',
        label: (
          <Link href={`/user/${user?._id}`} className="">Profile</Link>
        ),
        icon: <EditOutlined />,
        disabled: false,
      },
      {
        key: '3',
        label: (
          <Link href="/about" className="">About</Link>
        ),
        icon: <ProfileOutlined />,
        disabled: false,
      }
    ];
    
    const getPath=()=>{
        return pathname.split('/').join('>').substring(1);
    }
 
 function toggleNav(){
   setImage((!togel)?boutonX:burgerImg);
   setTogel(!togel);
 }

 
  const pathname=usePathname();
  useEffect(()=>{
    if (!(localStorage.getItem("token"))) {
      router.push('/login');
    }
    setToken(localStorage.getItem("token") as string);
    if (window.localStorage&&localStorage.getItem("token") !=undefined && localStorage.getItem("token") !='undefined') {
      setUser(JSON.parse(atob(localStorage.getItem("token")!.split('.')[1])));
    }
    return()=>{
      setUser('');
    }
  },[image,togel,token]);

  return (
      <html lang="en">
        <Head><title>Home Page</title></Head>
        <body className="flex min-h-screen " onClick={()=>{
          if (togel) {
            setTogel(false);
            setImage(burgerImg);
          }
        }}>
          <div id="toggled-menu"
              className={`w-full absolute top-0 bottom-0 left-0 -translate-x-full bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50  ${togel?'translate-x-0 z-20 opacity-100 w-1/5 translate-y-8':''} text-gray-800 border-b border-gray-200 flex flex-col items-center md:static md:w-1/5 md:transform-none md:border-none`}>
            <h1 className="text-xl font-bold p-1 w-full h-12 border-b">Applications</h1>
            <div className="flex-1 flex w-full flex-col"> 
            
            {
              user?(
              <nav className="flex flex-col flex-1 py-3 space-y-6 text-justify w-full">
                  <Link href="/" className={`px-2 capitalize text-xl ${pathname=="/"?'active':''}`}><HomeOutlined /> Home</Link>
                  <Link href="/application" className={`px-2 text-xl ${pathname=="/application"&&'active'}`}><UnorderedListOutlined /> Application</Link>
                  {
                    user?.role=='admin'&&<Link href="/user" className={`px-2 capitalize text-xl ${pathname=="/user"?'active':''}`}><UnorderedListOutlined /> Users</Link>
                  }
              </nav>
              ):(
                <nav className="flex flex-col flex-1 py-3 space-y-6 text-justify w-full">
                    <Link href="/register" className={`px-2 text-xl ${pathname=="/register"&&'active'}`}>Regiter</Link>
                    <Link href="/login" className={`px-2 text-2xl ${pathname=="/login"?'active':''}`}>Login</Link>
                </nav>
              )
            }
            </div>
            <Footer/>
            </div>
          <div className="flex-1 flex flex-col h-screen">
            <div className="flex flex-row h-12 sticky top-0 bg-gradient-to-bl from-gray-50 via-slate-50 to-blue-50  justify-between items-center  w-full border-b">
              <button
                aria-label="toggle button"
                aria-expanded="false"
                id="menu-btn"
                className="cursor-pointer w-8 h-8 md:hidden"
                onClick={toggleNav}
                >
                  <Image src={image} alt="button"/>
              </button>
                <span className=" capitalize pl-1 invisible md:visible md:w-1/3">{getPath()}</span>
                {
                  token?<button className="px-1">
                    <Dropdown menu={{ items }}>
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                        <Avatar icon={<Image width={45} height={45} src={(!user.profile.includes('null'))?user.profile:profileImg} alt="profile"/>} /> 
                        </Space>
                      </a>
                    </Dropdown>
                  </button>:<Link href="/about" className="about">About</Link>
                }
            </div>
            <div className="flex-1">
              {children}
            </div>
          </div>
        </body>
      </html>
  );
}
