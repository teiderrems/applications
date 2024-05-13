import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UserDetail from "./UserDetail";
import Image from "next/image";
import  profileImg  from '../../../public/defaul.jpeg';

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
      className='flex rounded-full shadow hover:scale-110 space-y-4 h-1/6 md:space-y-0 md:space-x-4 italic hover:shadow-blue-500 hover:cursor-pointer  justify-between'>
          <Image className=" rounded-full" src={user?.Profile??profileImg} width={25} height={25} alt={user?.Profile}/>
          <h3 className="text-justify px-2 hover:text-blue-400 hover:underline">{user?.Email}</h3>
      </div>
      {
        showDetail&&<UserDetail  canEdit={true} setIsAdd={setIsAdd} user={user} setShowDetail={setShowDetail}/>
      }
    </>
  )
}
