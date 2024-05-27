"use client"

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import { EyeInvisibleOutlined, EyeOutlined, FacebookOutlined, GoogleOutlined, LoadingOutlined, TwitterOutlined } from "@ant-design/icons";
import { Divider, Spin } from "antd";

function Login() {
  const [user, setUser] = useState<{
    Username: string
    Password: string
  }>({
    Username: "",
    Password: ""
  });

  const query=useSearchParams();

  const router=useRouter();
  const [response,setResponse]=useState<CustomType>();
  const [isSubmit,setIsSubmit]=useState(false);


  const HandleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmit(state=>!state);
        setResponse({...response,status:0,data:null,isLoading:true,isError:false,error:"",isSuccess:false})
        try {
            const res=await Axios.post("users/auth",{Username:user.Username,Password:user.Password});
            if (res.status==201 || res.status==200) {
              localStorage.setItem("token",res.data.token);
              localStorage.setItem("refresh",res.data.refresh);
              if (query.get("ReturnUrl")!=null) {
                router.push(query.get("ReturnUrl") as string);
              }
              else{
                const user=JSON.parse(atob(localStorage.getItem("token")!.split('.')[1]));
                localStorage.setItem('userId',user?._id);
                router.push('/application');
              }
              setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
          }
        } catch (error:any) {
            setIsSubmit(state=>!state);
            setResponse({...response,error:error.message,isError:true,isLoading:false});
        }
  }
  const [show,setShow]=useState(false);
  useEffect(()=>{
    localStorage.removeItem('token');
  },[query,isSubmit]);

  return (
    <div className=" min-h-screen flex flex-col space-y-12 md:space-y-0 md:flex-row">
      <form action="" onSubmit={HandleSubmit} className=" h-3/5 md:w-4/6  space-y-8 m-4 flex flex-col justify-center items-center md:h-full">
        <h1 className="text-gray-400 w-5/6 h-16 mb-4 text-justify">Login to continue</h1>
        {response?.isError && (<span className="text-red-400 text-center w-full block">Something wrong username or password isn&rsquo;t valid please try again</span>)}
        <div className="flex w-5/6 flex-col space-y-4">
          <label htmlFor="Username" className="text-xl">Username</label>
          <input type="text"  id="Username" required onChange={(e) => { setUser({ ...user, Username: e.target.value }) }} className="px-2 w-full h-14 shadow rounded-md" />
        </div>
        <div className="flex w-5/6 flex-col space-y-4">
          <label htmlFor="Password" className="text-xl">Password</label>
          <div className="flex w-full rounded-md h-14 shadow ">
            <input type={show?"text":"password"} id="Password" required min={8} pattern="[a-zA-Z0-9;?,@]{8,15}" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="flex-1 pl-2" />
            {show?(<button onClick={()=>setShow(!show)} className="w-1/12 h-full"><EyeOutlined/></button>): (<button onClick={()=>setShow(!show)}  className="w-1/12 h-full"><EyeInvisibleOutlined /></button>)}
          </div>
        </div>
        {
          user.Password!=""&&(!user.Password.match("[a-zA-Z0-9;?,@]{8,15}"))&&<span className="text-red-400 w-5/6 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers</span>
        }
        <div className="flex flex-col md:flex-row w-5/6 justify-between h-28 md:h-20">
          {
              isSubmit?<Spin  className='md:text-center' indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />:<button className="btn-submit" type="submit">Submit</button>
          }
          <Link href="/register" className="text-blue-400 md:self-center hover:underline">You do not have acount <strong>SignUp</strong></Link>
        </div>
      </form>
      <div className=" md:max-h-svh items-center md:justify-center h-1/6 md:flex-col mx-auto justify-between flex self-center space-x-16 md:space-x-0">
        <Link href="#" className="md:w-1/4 w-16 h-10 md:mb-6 md:h-12  md:justify-between md:space-x-4 hover:text-blue-500 items-center justify-center md:flex"><GoogleOutlined className=" text-2xl rounded-lg" /><span className="text-2xl md:visible invisible text-gray-300">Google</span></Link>
        <Link href="#" className="md:w-1/4 w-16 h-10 md:mb-6 md:h-12  md:justify-between md:space-x-4 hover:text-blue-500 items-center justify-center md:flex"><FacebookOutlined className=" text-2xl rounded-lg" /><span className="text-2xl md:visible invisible text-gray-300">Facebook</span></Link>
        <Link href="#" className="md:w-1/4 w-16 h-10 md:h-12 items-center md:justify-between md:space-x-4 hover:text-blue-500 justify-center md:flex"><TwitterOutlined className=" text-2xl rounded-lg" /><span className="text-2xl md:visible invisible text-gray-300">Twitter</span></Link>
      </div>
    </div>
  )
}

export default function LoginView(){
  return(
    <Suspense>
      <Login/>
    </Suspense>
  )
}
