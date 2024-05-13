"use client"

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {  useRef, useState } from "react"
import { CustomType } from "../components/ApplicationDetail";
import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { PutBlobResult } from "@vercel/blob";
import { Spin } from "antd";

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
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    const [isSubmit,setIsSubmit]=useState(false);

    const HandleSubmit=async(e: React.FormEvent)=>{
        e.preventDefault();
        setIsSubmit(!isSubmit);
        setResponse({...response,status:0,data:null,isLoading:true,isError:false,error:"",isSuccess:false});
        const result= await uploadProfile();
        try {
            if (result.includes('500')) {
                const res=await Axios.post("users",{Username:user.Username,Email:user.Email,Password:user.Password,Profile:null});
                if (res.status==201 || res.status==200) {
                    setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
                    router.push('/login');
                }
            }
            if (blob) {
                const res=await Axios.post("users",{Username:user.Username,Email:user.Email,Password:user.Password,Profile:blob.url});
                if (res.status==201 || res.status==200) {
                    router.push('/login');
                    setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
                }
            }
        } catch (error:any) {
            setIsSubmit(!isSubmit);
            setResponse({...response,error:"register failed please try again",isError:true,isLoading:false});
        }
    }


    const uploadProfile=async()=>{

        if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
        }

        try {
            const file = inputFileRef.current.files[0];
            const res = await fetch(
                `/api/avatar/upload?filename=${file.name}`,
                {
                method: 'POST',
                body: file,
                },
            );
            if (!res.ok) {
                setResponse({...response,status:0,data:null,isLoading:true,isError:true,error:"profile picture upload failed",isSuccess:false});
                setIsSubmit(state=>!state);
                return res.status.toString();
            }
            const newBlob = (await res.json()) as PutBlobResult;
            setBlob(newBlob);
            return res.status.toString();
        } catch (error:any) {
            setResponse({...response,status:0,data:null,isLoading:true,isError:true,error:"profile picture upload failed",isSuccess:false});
            setIsSubmit(state=>!state);
            return error.message;
        }
    }


  return (
    <div className="wrap-form">
        <form action="" onSubmit={HandleSubmit} className="md:w-3/5 w-5/6 h-full flex md:space-y-4 flex-col items-center bg-white justify-center" encType="multipart/form-data">
        <h1 className="text-gray-400 self-start mb-2 text-justify">SignIn to continue</h1>
        {response?.isError && (<span className="text-red-400 text-center w-full block">{response?.error}</span>)}
            <div className="md:h-1/6 my-4 w-full md:my-0 flex space-x-2 flex-row">
                <div className="flex-1 w-3/5 flex flex-col">
                    <label htmlFor="Username" className="text-xl">Username</label>
                    <input type="text" name="Username" id="Username" placeholder="enter your username" required onChange={(e)=>{setUser({...user,Username:e.target.value})}} className=" h-3/4 rounded-md px-2 shadow" />
                </div>
                <div className="flex-1 flex flex-col">
                    <label htmlFor="Profile" className="text-xl">Profile</label>
                    <input type="file" ref={inputFileRef} name="profile" placeholder="choose your profile" className=" hover:cursor-pointer w-full p-2 h-3/4 rounded-md shadow" id="profile" />
                </div>
            </div>
            <div className="h-1/6 flex w-full flex-col">
                <label htmlFor="Email" className="text-xl">Email</label>
                <input type="email" name="Email" id="Email" placeholder="example@gmail.com" required onChange={(e)=>{setUser({...user,Email:e.target.value})}} className="form-input px-2" />
            </div>
            <div className="h-1/6 w-full flex flex-col">
                <label htmlFor="Password" className="text-xl">Password</label>
                <div className="flex w-full shadow  form-input">
                    <input type={show?"text":"password"} id="Password" name="Password" required min={8} pattern="[a-zA-Z0-9;?,@]{8,15}" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="flex-1 pl-2 rounded-s-md" />
                    {show?(<button onClick={()=>setShow(!show)} className="w-1/12 h-full border-l"><EyeOutlined/></button>): (<button onClick={()=>setShow(!show)}  className="w-1/12 h-full  border-l"><EyeInvisibleOutlined /></button>)}
                </div>
            </div>
            {
                user.Password!=""&&(!user.Password.match("[a-zA-Z0-9;?,@]{8,15}"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers</p>
            }
            <div className="h-1/6 w-full flex flex-col">
                <label htmlFor="ConfirmPassword" className="text-xl">ConfirmPassword</label>
                <div className="flex w-full shadow  form-input">
                    <input type={showC?"text":"password"} id="ConfirmPassword" required onChange={(e)=>{setUser({...user,ConfirmPassword:e.target.value})}} className="flex-1 pl-2 rounded-s-md" />
                    {showC?(<button onClick={()=>setShowC(!showC)} className="w-1/12 h-full border-l"><EyeOutlined/></button>): (<button onClick={()=>setShowC(!showC)}  className="w-1/12 h-full  border-l"><EyeInvisibleOutlined /></button>)}
                </div>
            </div>
            {
                user.Password!=""&&user.ConfirmPassword!=""&&user.ConfirmPassword!=user.Password&&<span className="text-red-400">ConfirmPassword must be equal to Password</span>
            }
            <div className="w-full md:justify-between justify-around items-center flex h-1/6 md:flex-row flex-col">
                {
                    isSubmit?<Spin  className='md:text-center' indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />:<button className="btn-submit" type="submit">Submit</button>
                }
                <Link href="/login" className="text-blue-400 md:self-center self-start hover:underline">You have acount <strong>SignIn</strong></Link>
            </div>
        </form>
    </div>
  )
} 
