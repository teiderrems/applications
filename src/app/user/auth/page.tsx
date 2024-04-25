"use client"

import { useLoginMutation } from "@/lib/features/users";
import { useState } from "react";

export default function Login() {
  const [user, setUser] = useState<{
    Username: string
    Password: string
  }>({
    Username: "",
    Password: ""
  });

  const [SingIn, { isError, isLoading, isSuccess, data }] = useLoginMutation();

  const HandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    SingIn({ Username: user.Username, Password: user.Password });
    if (isSuccess) {
      console.log(data);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center h-full  items-center">
      <form action="" onSubmit={HandleSubmit} className="w-3/5 h-3/5 flex space-y-6 rounded-md shadow px-2 flex-col justify-center">
        {isError && (<span className="text-red-400 text-center w-full block">Something wrong {data}</span>)}
        {isSuccess && (<span className="text-green-400 text-center w-full block">Register success{data}</span>)}

        <div className="w-full h-14 md:justify-between flex md:flex-row flex-col items-center">
          <label htmlFor="Username" className="text-2xl">Username</label>
          <input type="text" id="Username" required onChange={(e) => { setUser({ ...user, Username: e.target.value }) }} className="form-input" />
        </div>
        <div className="w-full md:justify-between flex h-14 md:flex-row flex-col items-center">
          <label htmlFor="Password" className="text-2xl">Password</label>
          <input type="password" id="Password" required minLength={8} pattern="/[A-Za-z0-9]+[A-Za-z]+[0-9]+[;:/!]/" onChange={(e) => { setUser({ ...user, Password: e.target.value }) }} className="form-input" />
          {
                user.Password!=""&&(!user.Password.match("[A-Za-z0-9]+[A-Za-z]+[0-9]+[;:/!]"))&&<p className="text-red-400 text-wrap">Password must contain at least 8 characters with a mixture of uppercase, lowercase, numbers with at least one character among</p>
            }
        </div>
        <div className="w-full md:justify-start flex h-14 md:flex-row flex-col items-center">
          <button className="md:w-1/5 w-full rounded-lg bg-blue-400 h-3/4" type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}
