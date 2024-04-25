"use client"

import { useLoginMutation } from "@/lib/features/users";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Login() {
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

  const HandleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    await SingIn({ Username: user.Username, Password: user.Password });
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
    <div className="flex flex-1 flex-col justify-center h-full  items-center">
      <form action="" onSubmit={HandleSubmit} className="w-3/5 h-3/5 flex space-y-6 rounded-md shadow px-2 flex-col justify-center">
        {isError && (<span className="text-red-400 text-center w-full block">Something wrong {data}</span>)}
        <div className="form-group">
          <label htmlFor="Username" className="text-2xl">Username</label>
          <input type="text" id="Username" required onChange={(e) => { setUser({ ...user, Username: e.target.value }) }} className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="Password" className="text-2xl">Password</label>
          <input type="password" id="Password" required minLength={8} pattern="[a-zA-Z]+[a-zA-Z0-9]+[;?,@]" onChange={(e) => { setUser({ ...user, Password: e.target.value }) }} className="form-input" />
        </div>
        {
          user.Password!=""&&(!user.Password.match("[a-zA-Z]+[a-zA-Z0-9]+[;?,@]"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers with at least one character among</p>
        }
        <div className="w-full justify-between flex h-14 md:flex-row flex-col items-center">
          <button className="md:w-1/5 w-full self-start rounded-lg bg-blue-400 h-3/4" type="submit">Submit</button>
          <Link href="/user" className="text-blue-400 hover:underline">You don't have acount <strong>SignUp</strong></Link>
        </div>
      </form>
    </div>
  )
}
