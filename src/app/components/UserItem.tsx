import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UserDetail from "./UserDetail";

export type UserType={
    Username?:string;
    Firstname?:string;
    Lastname?:string;
    Role?:string;
    CreatedAt:Date;
    _id:string;
    Email:string;
}

export default function UserItem({user,setIsAdd}:{user:UserType,setIsAdd:Dispatch<SetStateAction<boolean>>}) {
  const [showDetail,setShowDetail]=useState(false);

  useEffect(()=>{

  },[user,setIsAdd])
  return (
    <>
      <button onClick={()=>setShowDetail(!showDetail)}
      className='flex rounded-md italic hover:shadow-blue-500 hover:cursor-pointer justify-between px-2 shadow'>
          <span className=" text-center">{user.Username}</span>
          <h3 className="text-center">{user.Role}</h3>
      </button>
      {
        showDetail&&<UserDetail setIsAdd={setIsAdd} user={user} setShowDetail={setShowDetail}/>
      }
    </>
  )
}
