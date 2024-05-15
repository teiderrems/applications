import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UserDetail from "./UserDetail";
import Image from "next/image";
import  profileImg  from '../../../public/defaul.jpeg';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Axios from "@/hooks/axios.config";

export type UserType={
    ProfileId: string;
    Username?:string;
    Firstname?:string;
    Lastname?:string;
    Profile:string;
    Role?:string;
    CreatedAt:string;
    _id:string;
    Email:string;
}

const Role = ['admin', 'guest', 'user'];

export default function UserItem({user,setIsAdd}:{user:UserType,setIsAdd:Dispatch<SetStateAction<boolean>>}) {
  const [showDetail,setShowDetail]=useState(false);
  const router=useRouter();
  const pathname=usePathname();
  const [currentUser, setCurrentUser] = useState<any>({});
  const [reload,setReload]=useState(false);
  const [token,setToken]=useState<string>();

  async function HandleDelete(a:UserType): Promise<void> {
    try {
      const res = await Axios.delete(`users/${currentUser._id}`,{
        headers: {
          "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
        }
      });
      if (res.status == 204 || res.status == 200) {
        setReload(true);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status == 401) {
        try {
          const res = await Axios.post("users/refresh_token", { refresh: sessionStorage.getItem("refresh") });
          if (res.status == 201 || res.status == 200) {
            setToken(res.data.token);
            sessionStorage.setItem("token", res.data.token);
            if (sessionStorage.getItem("token")) {
              setReload(true);
            }
          }
        } catch (err: any) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refresh");
          if (err.response.Role == 401) {
            router.push(`/login?ReturnUrl=${pathname}`);
          }
          setReload(false);
        }
      }
    }
  }

  const SaveChange = async (a:UserType) => {
    setShowDetail(state => !state);
    
    if (currentUser && a.Role!==currentUser.Role) {
      try {
        const res = await Axios.put(`users/${currentUser._id}`, currentUser, {
          headers: {
            "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {
          setReload(true);
        }
      } catch (error: any) {
        if (error.response.status == 401) {
          try {
            const res = await Axios.post("users/refresh_token", { refresh: sessionStorage.getItem("refresh") });
            if (res.status == 201 || res.status == 200) {
              setToken(res.data.token);
              sessionStorage.setItem("token", res.data.token);
              if (sessionStorage.getItem("token")) {
                setReload(true);
              }
            }
          } catch (err: any) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("refresh");
            if (err.response.Role == 401) {
              router.push(`/login?ReturnUrl=${pathname}`);
            }
            setReload(false);
          }
        }
      }
    }
  }

  useEffect(()=>{

  },[user,setIsAdd,reload,showDetail,pathname])
  return (
    <tr key={user._id} className={`border-b dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${user.Role == 'reject' ? 'bg-red-300' : 'bg-white'}`}>
                  
      <td scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {user.Username}
      </td>
      <td className="px-4 py-4">
        {user.Email}
      </td>
      <td className="px-4 py-4">
        {user.Firstname}
      </td>
      <td className="px-4 py-4">
        {user.Lastname}
      </td>
      <td className="px-4 py-4">
        {
          showDetail ? <select onChange={(e) => {
            setCurrentUser((state: UserType) => {
              return { ...user, Role: (e.target.value != user.Role) ? e.target.value : user.Role }
            });
          }}>
            <option value={user.Role} selected>{user.Role}</option>
            {Role.filter(s => s !== user.Role).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select> : <>{user.Role}</>
        }
      </td>
      <td className="px-4 py-4">
        {user.CreatedAt?.split('T')[0].split('-').reverse().join('/')}
      </td>
      <td className="px-4 py-4">
        {(!showDetail) ?
          <div className='flex space-x-2'>
            <button className='text-blue w-1/3 text-xl' onClick={() => setShowDetail(state => !state)}><EditOutlined className="p-1 hover:rounded-md text-blue-400 hover:text-white hover:bg-blue-300 hover:shadow"/></button>
            <button className='w-1/3 text-cyan-300 text-xl' onClick={()=>HandleDelete(user)}><DeleteOutlined className="p-1 hover:shadow hover:rounded-md hover:bg-red-300 hover:text-white" /></button>
          </div>
          : <button onClick={()=>SaveChange(user)}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">SaveChange</button>
        }
      </td>
    </tr>
  )
}
