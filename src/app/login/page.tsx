"use client"

import { useLoginMutation } from "@/lib/features/users";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function Login() {
  const [user, setUser] = useState<{
    Username: string
    Password: string
  }>({
    Username: "",
    Password: ""
  });

  const query=useSearchParams();

  const router=useRouter()

  const [SingIn, { isError, isLoading, isSuccess, data }] = useLoginMutation();

  const HandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    SingIn({ Username: user.Username, Password: user.Password });
    if (isSuccess) {
      localStorage.setItem("token",data.token);
      if (query.get("ReturnUrl")!=null) {
        router.push(query.get("ReturnUrl") as string);
      }
      else{
        router.push('/application');
      }
    }
  }

  return (
    <div className="wrap-form">
      <form action="" onSubmit={HandleSubmit} className="md:w-3/5 w-5/6 h-4/5 space-y-3 flex px-2 flex-col bg-white rounded-md shadow justify-center">
        {isError && (<span className="text-red-400 text-center w-full block">Something wrong {data}</span>)}
        <div className="form-group">
          <label htmlFor="Username" className="text-2xl">Username</label>
          <input type="text" id="Username" required onChange={(e) => { setUser({ ...user, Username: e.target.value }) }} className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="Password" className="text-2xl">Password</label>
          <input type="password" id="Password" required minLength={8} pattern="[a-zA-Z0-9]{7,15}[;?,@]" onChange={(e) => { setUser({ ...user, Password: e.target.value }) }} className="form-input" />
        </div>
        {
          user.Password!=""&&(!user.Password.match("[a-zA-Z0-9]{7,15}[;?,@]"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers with at least one character among</p>
        }
        <div className="w-full justify-around flex md:h-14 h-28 md:flex-row flex-col items-center">
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