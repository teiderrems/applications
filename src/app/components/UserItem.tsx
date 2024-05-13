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
      className='flex rounded-md space-y-4 md:space-y-0 md:space-x-4 italic hover:shadow-blue-500 hover:cursor-pointer  justify-between shadow'>
          <Image className=" rounded-l-lg flex-1" src={user?.Profile??profileImg} width={100} height={100} alt={user?.Profile}/>
          <div className=" flex flex-1 flex-col">
            <h3 className="text-justify">{user?.Username}</h3>
            <h3 className="text-justify">{user?.Role}</h3>
            <h3 className="text-justify">{`${user?.CreatedAt.split('T')[0].split('-').reverse().join('/')}`}</h3>
          </div>
      </div>
      {
        showDetail&&<UserDetail  canEdit={true} setIsAdd={setIsAdd} user={user} setShowDetail={setShowDetail}/>
      }
    </>
  )
}
