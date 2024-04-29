"use client"

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

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
  const HandleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

        setResponse({...response,status:0,data:null,isLoading:true,isError:false,error:"",isSuccess:false})
        try {
            const res=await Axios.post("users/auth",{Username:user.Username,Password:user.Password});
            if (res.status==201 || res.status==200) {
              localStorage.setItem("token",res.data.token);
              if (query.get("ReturnUrl")!=null) {
                router.push(query.get("ReturnUrl") as string);
              }
              else{
                router.push('/application');
              }
              setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
                // if (response?.isSuccess) {
                // }
          }
        } catch (error:any) {
            setResponse({...response,error:error.message,isError:true,isLoading:false});
        }
  }
  const [show,setShow]=useState(false);
  useEffect(()=>{

  },[query]);

  return (
    <div className="wrap-form">
      <form action="" onSubmit={HandleSubmit} className="md:w-3/5 w-5/6 h-4/5 space-y-3 flex px-2 flex-col bg-white rounded-md shadow justify-center">
        <h1 className="text-gray-400 text-justify">Login to continue</h1>
        {response?.isError && (<span className="text-red-400 text-center w-full block">Something wrong {response?.error}</span>)}
        <div className="form-group">
          <label htmlFor="Username" className="text-2xl">Username</label>
          <input type="text" pattern="[a-zA-Z0-9]*" id="Username" required onChange={(e) => { setUser({ ...user, Username: e.target.value }) }} className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="Password" className="text-2xl">Password</label>
          <div className="flex w-full shadow  md:w-3/4 md:h-3/4 h-full rounded-md">
            <input type={show?"text":"password"} id="Password" required min={8} pattern="[a-zA-Z0-9;?,@]{7,15}[;?,@][a-zA-Z0-9;?,@]*" onChange={(e)=>{setUser({...user,Password:e.target.value})}} className="flex-1 pl-2 rounded-s-md" />
            {show?(<button onClick={()=>setShow(!show)} className="w-1/12 h-full border-l"><EyeOutlined/></button>): (<button onClick={()=>setShow(!show)}  className="w-1/12 h-full  border-l"><EyeInvisibleOutlined /></button>)}
          </div>
        </div>
        {
          user.Password!=""&&(!user.Password.match("[a-zA-Z0-9;?,@]{7,15}[;?,@][a-zA-Z0-9;?,@]*"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers with at least one character among</p>
        }
        <div className="w-full justify-between flex md:h-14 h-28 md:flex-row flex-col items-center">
          <button className="btn-submit" type="submit">Submit</button>
          <Link href="/register" className="text-blue-400 hover:underline">You do not have acount <strong>SignUp</strong></Link>
        </div>
      </form>
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
