"use client"

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {  useEffect, useRef, useState } from "react"
import { CustomType } from "../components/ApplicationDetail";
import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin, message } from "antd";

export default function Register() {

    const [user,setUser]=useState<{
        Username:string
        Password:string
        Profile?:string
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
    const [show,setShow]=useState(false);
    const [showC,setShowC]=useState(false);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [isSubmit,setIsSubmit]=useState(false);

    const HandleSubmit=async(e: React.FormEvent)=>{
        e.preventDefault();
        setIsSubmit(!isSubmit);
        setResponse({...response,status:0,data:null,isLoading:true,isError:false,error:"",isSuccess:false});
        try {
            const res=await Axios.post("users",new FormData(document.querySelector('form')!));
            if (res.status==201 || res.status==200) {
                success();
                setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
                router.push('/check_email');
            }
        } catch (err:any) {
            error();
            setIsSubmit(state=>!state);
            setResponse({...response,error:"register failed please try again",isError:true,isLoading:false});
        }
    }
    useEffect(()=>{
    },[])
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
          type: 'success',
          content: `Welcome ${user.Username}`,
          duration:2000
        });
      };
    
      const error = () => {
        messageApi.open({
          type: 'error',
          content: `login failed try again`,
        });
      };

  return (
    <div className="min-h-screen flex flex-col mt-4 justify-center  items-center">
        {contextHolder}
        <form action="" onSubmit={HandleSubmit} className="md:w-3/6 w-4/6 md:space-y-3 space-y-10 h-5/6 justify-center items-center flex flex-col" encType="multipart/form-data">
        <h1 className="text-gray-400 self-start mb-2 text-justify">SignIn to continue</h1>
        {response?.isError && (<span className="text-red-400 text-center w-full block">{response?.error}</span>)}
            <div className="h-20 w-full md:my-0 flex space-x-2 flex-row">
                <div className=" w-3/5 md:space-y-2 space-y-4 flex flex-col">
                    <label htmlFor="Username" className="text-xl">Username</label>
                    <input type="text" name="Username" id="Username" placeholder="enter your username" required onChange={(e)=>{setUser({...user,Username:e.target.value})}} className=" h-14 rounded-md px-2 shadow" />
                </div>
                <div className="flex md:space-y-2 space-y-4 h-full w-2/5 flex-col">
                    <label htmlFor="Profile" className="text-xl">Profile</label>
                    <input type="file" ref={inputFileRef} name="profile" placeholder="choose your profile" className=" h-14 text-center p-1 hover:cursor-pointer rounded-md shadow" id="profile" />
                </div>
            </div>
            <div className="h-20 flex md:space-y-2 space-y-4 w-full flex-col">
                <label htmlFor="Email" className="text-xl">Email</label>
                <input type="email" name="Email" id="Email" placeholder="example@gmail.com" required onChange={(e)=>{setUser({...user,Email:e.target.value})}} className=" h-14 px-2 shadow rounded-md" />
            </div>
            <div className="h-20 w-full md:space-y-2 space-y-4 flex flex-col">
                <label htmlFor="Password" className="text-xl">Password</label>
                <div className="flex w-full h-14 shadow rounded-md ">
                    <input type={show?"text":"password"} id="Password" name="Password" required min={8} pattern="[a-zA-Z0-9;?,@]{8,15}" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className=" pl-2 flex-1" />
                    {show?(<button onClick={()=>setShow(!show)} className="w-1/12 h-full"><EyeOutlined/></button>): (<button onClick={()=>setShow(!show)}  className="w-1/12 h-full "><EyeInvisibleOutlined /></button>)}
                </div>
            </div>
            {
                user.Password!=""&&(!user.Password.match("[a-zA-Z0-9;?,@]{8,15}"))&&<p className="text-red-400 w-4/6 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers</p>
            }
            <div className="h-20 w-full md:space-y-2 space-y-4 flex flex-col">
                <label htmlFor="ConfirmPassword" className="text-xl">ConfirmPassword</label>
                <div className="flex w-full h-14 shadow rounded-md ">
                    <input type={showC?"text":"password"} id="ConfirmPassword" required onChange={(e)=>{setUser({...user,ConfirmPassword:e.target.value})}} className="flex-1 pl-2" />
                    {showC?(<button onClick={()=>setShowC(!showC)} className="w-1/12 h-full"><EyeOutlined/></button>): (<button onClick={()=>setShowC(!showC)}  className="w-1/12 h-full"><EyeInvisibleOutlined /></button>)}
                </div>
            </div>
            {
                user.Password!=""&&user.ConfirmPassword!=""&&user.ConfirmPassword!=user.Password&&<span className="text-red-400">ConfirmPassword must be equal to Password</span>
            }
            <div className="w-full md:justify-between justify-around items-center flex h-20 md:flex-row flex-col">
                {
                    isSubmit?<Spin  className='md:text-center' indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />:<button className="btn-submit" type="submit">Submit</button>
                }
                <Link href="/login" className="text-blue-400  font-bold md:self-end md:h-12 self-start hover:underline">You have acount <strong>SignIn</strong></Link>
            </div>
        </form>
    </div>
  )
} 
