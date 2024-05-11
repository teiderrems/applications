"use client"

import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import UserItem, { UserType } from "../components/UserItem";
import { AppstoreAddOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import AddUser from "../components/AddUser";
import axios from "axios";

export default function UserList() {


    const router=useRouter();
  const pathname=usePathname();
  const [token,setToken]=useState<string>();
  const [response,setResponse]=useState<CustomType>();
  const [page,setPage]=useState(0);
  const [limit,setLimit]=useState(12);
  const [handleAdd,setHandleAdd]=useState(false);
  const [isAdd,setIsAdd]=useState(false);
  const [reload,setReload]=useState(false);
  const [url,setUrl]=useState<any>(`${Axios.defaults.baseURL}`+`users?page=${page}&limit=${limit}`);
  const [next,setNext]=useState(null);
    const [prev,setPrev]=useState(null);
  
  useEffect(()=>{
    const findAll=async()=>{
      setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
      try {
        const res = await axios.get(url, {
          headers: {
            "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {
          setResponse({ ...response, isLoading: false, status: res.status, data: res.data.data.users, isSuccess: true });
          setPrev(res.data.prev);
          setNext(res.data.next);
          if(response?.data){
            setReload(true);
          }
        }
        } catch (error:any) {
            setResponse({...response,error:error.message,isLoading:false,status:error.response.status,isSuccess:true})
            if ((error.response.status==401)&&(error.response.data.message as string).includes('jwt')) {
              try {
                const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
                if (res.status==201 || res.status==200) {
                  sessionStorage.setItem("token",res.data.token);
                  if (sessionStorage.getItem("token")) {
                    setReload(true);
                  }
                }
              } catch (err:any) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("refresh");
                if (err.response.status == 401) {
                  router.push(`/login?ReturnUrl=${pathname}`);
                }
                setReload(false);
              }
            }
            if (error.response.status==401) {
                router.push(`/`);
            }
        }
    }
    findAll();
  },[token,pathname,isAdd,reload]);

  if (response?.isLoading) {
    return(
      <div className="flex flex-col justify-center h-full items-center">
        <p className=" animate-bounce text-center">Loading...</p>
      </div>
    )    
  }

  if (response?.isError) {
    return(
        <div className="flex justify-center items-center">
            <p className="text-justify text-red-400">{response.error}</p>
        </div>
    )
  }
  
  return (
    <div className='container mx-auto flex-1 flex flex-col'>
    <div className="flex justify-end h-7">
    {
      (!handleAdd)?<button className="rounded-lg hover:text-blue-500 text-center h-full w-10 " onClick={()=>setHandleAdd(!handleAdd)}><AppstoreAddOutlined className="h-5/6 w-5/6 m-2"/></button>:<AddUser setIsAdd={setIsAdd} setHandleAdd={setHandleAdd}/>
    }
    </div>
    <section className="flex flex-col flex-1 mt-2 space-y-2">
      <div className="flex-1 mx-4 grid md:grid-cols-4 md:grid-rows-4 grid-rows-12 gap-3 grid-cols-1">
        {
          response?.data?.map((u: UserType)=>{
            return (<UserItem key={u._id} setIsAdd={setIsAdd} user={u}/>)
          })
        }
      </div>
      {
        next &&(
          <div className="flex justify-end mb-1 mx-4 space-x-3  items-end basis-1">
          <button onClick={() => setUrl(prev)}
          className="flex hover:bg-blue-400 hover:text-white space-x-1 px-1 items-center justify-center shadow rounded-md">
            <DoubleLeftOutlined /><span>prev</span>
          </button>
          <button onClick={() => setUrl(next)}
          className={`flex hover:bg-blue-400 hover:text-white  px-1 items-center space-x-1 shadow justify-center rounded-md`} disabled>
            <span>next</span><DoubleRightOutlined />
          </button>
        </div>
        )
      }
    </section>
  </div>
  )
}
