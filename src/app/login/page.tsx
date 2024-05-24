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
              sessionStorage.setItem("token",res.data.token);
              sessionStorage.setItem("refresh",res.data.refresh);
              if (query.get("ReturnUrl")!=null) {
                router.push(query.get("ReturnUrl") as string);
              }
              else{
                const user=JSON.parse(atob(sessionStorage.getItem("token")!.split('.')[1]));
                sessionStorage.setItem('userId',user?._id);
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
    sessionStorage.removeItem('token');
  },[query,isSubmit]);

  return (
    <div className="wrap-form">
      <form action="" onSubmit={HandleSubmit} className="md:w-3/5 md:ml-5 w-5/6 md:h-full flex items-center md:space-y-3 flex-col bg-white justify-center">
        <h1 className="text-gray-400 self-start mb-4 text-justify">Login to continue</h1>
        {response?.isError && (<span className="text-red-400 text-center w-full block">Something wrong username or password isn&rsquo;t valid please try again</span>)}
        <div className="flex w-full flex-col h-1/5 space-y-1">
          <label htmlFor="Username" className="text-xl">Username</label>
          <input type="text"  id="Username" required onChange={(e) => { setUser({ ...user, Username: e.target.value }) }} className="form-input px-2" />
        </div>
        <div className="flex w-full flex-col h-1/5 space-y-2">
          <label htmlFor="Password" className="text-xl">Password</label>
          <div className="flex w-full shadow  form-input">
            <input type={show?"text":"password"} id="Password" required min={8} pattern="[a-zA-Z0-9;?,@]{8,15}" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="flex-1 pl-2 rounded-s-md" />
            {show?(<button onClick={()=>setShow(!show)} className="w-1/12 h-full border-l"><EyeOutlined/></button>): (<button onClick={()=>setShow(!show)}  className="w-1/12 h-full  border-l"><EyeInvisibleOutlined /></button>)}
          </div>
        </div>
        {
          user.Password!=""&&(!user.Password.match("[a-zA-Z0-9;?,@]{8,15}"))&&<span className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers</span>
        }
        <div className="flex w-full flex-col md:flex-row  justify-around md:justify-between h-1/6">
          {
              isSubmit?<Spin  className='md:text-center' indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />:<button className="btn-submit" type="submit">Submit</button>
          }
          <Link href="/register" className="text-blue-400 md:self-center hover:underline">You do not have acount <strong>SignUp</strong></Link>
        </div>
      </form>
      <div className="md:flex-1 md:w-1/4 md:h-2/5 h-1/6 w-full flex  justify-center  items-center space-x-2">
        <Link href="#" className="md:w-1/4 w-16 h-20 items-center justify-center md:flex md:h-1/3 "><GoogleOutlined className=" text-6xl rounded-lg bg-blue-500 hover:text-white" /></Link>
        <Link href="#" className="md:w-1/4 w-16 h-20  items-center justify-center md:flex md:h-1/3 "><FacebookOutlined className=" text-6xl rounded-lg bg-blue-500 hover:text-white" /></Link>
        <Link href="#" className="md:w-1/4 w-16 h-20 items-center justify-center md:flex md:h-1/3 "><TwitterOutlined className=" text-6xl rounded-lg bg-blue-500 hover:text-white" /></Link>
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
