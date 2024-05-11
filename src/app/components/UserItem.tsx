import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UserDetail from "./UserDetail";
import Image from "next/image";

export type UserType={
    Username?:string;
    Firstname?:string;
    Lastname?:string;
    Profile:string;
    Role?:string;
    CreatedAt:string;
    _id:string;
    Email:string;
}

export default function UserItem({user,setIsAdd}:{user:UserType,setIsAdd:Dispatch<SetStateAction<boolean>>}) {
  const [showDetail,setShowDetail]=useState(false);

  useEffect(()=>{

  },[user,setIsAdd])
  return (
    <>
      <div onClick={()=>setShowDetail(!showDetail)}
      className='flex rounded-md italic hover:shadow-blue-500 hover:cursor-pointer  justify-between shadow'>
          <span className=" text-center"><Image className="rounded" src={user?.Profile} width={75} height={75} alt={user?.Profile}/></span>
          <div className=" flex flex-col mr-2">
            <h3 className="text-justify">{user.Username}</h3>
            <h3 className="text-justify">{user.Role}</h3>
            <h3 className="text-justify">{`${user.CreatedAt.split('T')[0].split('-').reverse().join('/')}`}</h3>
          </div>
      </div>
      {
        showDetail&&<UserDetail setIsAdd={setIsAdd} user={user} setShowDetail={setShowDetail}/>
      }
    </>
  )
}
