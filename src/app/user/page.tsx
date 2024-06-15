"use client"

import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import UserItem, { UserType } from "../components/UserItem";
import { PlusOutlined } from "@ant-design/icons";

import AddUser from "../components/AddUser";
import axios from "axios";
import { Table, TableColumnsType } from "antd";

const Role = ['all','admin', 'guest', 'user'];

export default function UserList() {


  const router=useRouter();
  const pathname=usePathname();
  const [token,setToken]=useState<string>();
  const [response,setResponse]=useState<CustomType>({ isLoading: false, status: 0, data: undefined,error:undefined, isSuccess: false });
  const [page,setPage]=useState(0);
  const [limit,setLimit]=useState(12);
  const [handleAdd,setHandleAdd]=useState(false);
  const [isAdd,setIsAdd]=useState(false);
  const [reload,setReload]=useState(false);
  const [url,setUrl]=useState<any>(`${Axios.defaults.baseURL}`+`users?page=${page}&limit=${limit}`);
  const [next,setNext]=useState(null);
  const [prev,setPrev]=useState(null);
  const [filter,setFilter]=useState('all');
  const [total,setTotal]=useState(10);

  const columns: TableColumnsType<UserType> = [
    {
      title: 'Username',
      dataIndex: 'Username',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: 'Firstname',
      dataIndex: 'Firstname',
    },
    {
      title: 'Lastname',
      dataIndex: 'Lastname',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
    },
    {
      title: 'CreatedAt',
      dataIndex: 'CreatedAt',
      render:(value)=>(value as string).split('T')[0].split('-').reverse().join('/')
    },
    
  ];
  
  
  useEffect(()=>{
    const findAll=async()=>{
      try {
        const res = await axios.get(url+`&role=${filter}`, {
          headers: {
            "Authorization": window.localStorage ? ("Bearer " + window.localStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {
          setTotal(state=>state=res.data.data.count);
          setResponse(state=>{
            return { ...state, isLoading: false, status: res.status, data: res.data.data.users, isSuccess: true };
          });
          setPrev(res.data.prev);
          setNext(res.data.next);
          return res.data.users;
        }
        } catch (error:any) {
            setResponse(state=>{
              return {...state,error:error.message,isLoading:false,status:error.response.status,isSuccess:true}
            })
            if ((error.response.status==401)&&(error.response.data.message as string).includes('jwt')) {
              try {
                const res=await Axios.post("users/refresh_token",{refresh:localStorage.getItem("refresh")});
                if (res.status==201 || res.status==200) {
                  localStorage.setItem("token",res.data.token);
                  if (localStorage.getItem("token")) {
                    setReload(true);
                  }
                }
              } catch (err:any) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                if (err.response.status == 401) {
                  router.push(`/login?ReturnUrl=${pathname}`);
                }
                setReload(false);
              }
            }
            if (error.response.Role==401) {
                router.push(`/`);
            }
        }
    }
    findAll();
    
  },[token, pathname, filter, response.isLoading, isAdd, reload, url, router, response?.isSuccess]);


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
    <div className='flex-1 flex overflow-hidden flex-col  mx-2'>
      <div className="h-10 bg-slate-50 mt-2 flex items-center rounded-t-md justify-end">
        {
          (!handleAdd) ? <button onClick={() => setHandleAdd(!handleAdd)} className='mx-2 rounded-full hover:bg-blue-500 hover:text-white text-2xl w-8 h-8'><PlusOutlined /></button> : <AddUser setHandleAdd={setHandleAdd} setIsAdd={setIsAdd} />
        }
      </div>
      <Table className=' cursor-pointer' onRow={(record,index)=>{
        return{
          onClick:(e)=>{
            console.log(record)
          }
        }
      }} columns={columns} dataSource={response?.data} pagination={{
        onChange:()=>console.log('hello'),
        total:total
      }}/>
    </div>

)
}
