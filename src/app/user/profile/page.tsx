'use client'

import { CustomType } from '@/app/components/ApplicationDetail';
import Axios from '@/hooks/axios.config';
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import  profileImg  from '../../../../public/defaul.jpeg';
import Image from 'next/image';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UserDetail from '@/app/components/UserDetail';
import { Avatar } from 'antd';



export default function UserDetailInfo() {

    const [param,setParam]=useState<string|undefined>(undefined);
    const [response,setResponse]=useState<CustomType>({ isLoading: false, status: 0, data: undefined,error:undefined, isSuccess: false });
    const router=useRouter();
    const [token,setToken]=useState<string>();
    const pathname=usePathname();
    const [reload,setReload]=useState(false);
    const [edit,setEdit]=useState(false);
    const [profile,setProfile]=useState<any>(undefined);
    const HandleDelete=async()=>{
        try {
            const res=await Axios.delete("users/"+param,{
                headers:{
                    "Authorization":window.localStorage?("Bearer "+window.localStorage.getItem("token")):''
                }
            });
            if (res.status==204) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                localStorage.removeItem('userId');
                router.push('/register');
            }
        } catch (error:any) {
            if (error.response.status==401) {
                try {
                  const res=await Axios.post("users/refresh_token",{refresh:localStorage.getItem("refresh")});
                  if (res.status==201 || res.status==200) {
                    localStorage.setItem("token",res.data.token);
                    localStorage.setItem("refresh",res.data.refresh);
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
        }
    }

    useEffect(()=>{
        setParam(window&& (localStorage.getItem('userId') as string)&&(localStorage.getItem('userId') as string));
        setToken(window&& (localStorage.getItem('token') as string)&&(localStorage.getItem('token') as string));
        console.log(localStorage.getItem('userId'));
        const getUser=async()=>{
            try {
                const res=await Axios.get(`users/${param}`,{
                    headers: {
                        "Authorization": window.localStorage ? ("Bearer " + window.localStorage.getItem("token")) : ''
                    }
                });
                if (res.status == 201 || res.status == 200) {
                    
                    if (!res.data.user) {
                        router.push('/register');
                    }
                    setResponse(state=>{
                        return{ ...state, isLoading: false, status: res.status, data: res.data.user, isSuccess: true }
                    });
                }
                
            } catch (error: any) {
                if (error.response.status == 401) {
                try {
                    const res=await Axios.post("users/refresh_token",{refresh:localStorage.getItem("refresh")});
                    if (res.status==201 || res.status==200) {
                        
                        setToken(res.data.token);
                        localStorage.setItem("token",res.data.token);
                    }
                } catch (err:any) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh");
                    if (err.response.status == 401) {
                    router.push(`/login?ReturnUrl=${pathname}`);
                    }
                }
                }
            }
        }
        const getProfile=async()=>{
          try {
            const res=await Axios.get(`profile/${response.data.ProfileId}`);
            const imgb64=Buffer.from((res.data.image)).toString('base64');
            setProfile((state: string)=>state=`data:${res.data.minetype};base64,${imgb64}`);
          } catch (error) {
            console.log(error);
          }
        }
        if (param) {
            getUser();
            getProfile();
        }
    },[param,reload,router,response?.data?.ProfileId,profile,pathname]);

    if (response?.isLoading || !param) {
        return (
            <div className="flex flex-1 flex-col justify-center h-full items-center">
            <p className=" animate-bounce text-center">Loading...</p>
            </div>
        )
    }

    if (response?.isError) {
        return (
        <div className="flex  flex-1 justify-center items-center">
            <p className="text-justify text-red-400">{response.error}</p>
        </div>)
    }
    return (
        <div className='flex-1 flex flex-col mx-5 md:flex-row items-center justify-center'>
            <div className='flex-1 space-y-2 mt-5 flex flex-col w-5/6 h-4/6'>
                <div className='flex-1 flex flex-col space-y-2'>
                    <Avatar className='h-64 w-64 m-2 self-start' draggable={false} size={'large'} src={(response?.data?.ProfileId)?(profile):profileImg} />
                    <div className='flex justify-start md:ml-2 space-x-10 h-7'>
                        <button className='flex items-center shadow rounded-full space-x-2  hover:bg-blue-500 hover:text-white h-5/6 justify-center p-2 text-black' onClick={()=>setEdit(!edit)}><EditOutlined /> <span>Edit</span></button>
                        <button className='rounded-full shadow flex items-center space-x-2 hover:bg-red-400 hover:text-white h-5/6 justify-center p-2  text-black' onClick={HandleDelete}><DeleteOutlined /> <span>Delete</span></button>
                    </div>
                    <div  className='w-2/3 flex flex-col justify-between md:justify-center'>
                        <p className='text-justify capitalize font-bold h-7 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Username}</span> </p>
                        <hr />
                        <p className='text-justify lowercase h-7 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Email}</span></p>
                        <hr />
                        <p className='text-justify lowercase h-7 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Firstname}</span> </p>
                        <hr />
                        <p className='text-justify lowercase h-7 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Lastname}</span> </p>
                        <hr />
                        <p className='text-justify h-7 items-center flex justify-between px-2'><span className='w-3/5'>{response?.data?.CreatedAt.split('T')[0].split('-').reverse().join('/')}</span></p>
                        <hr />
                    </div>
                </div>   
            </div>
            <div className='flex-1 md:w-1/2 md:my-4'>
                <h1>About You</h1>
                <hr className='w-full' />
                <p className='text-wrap text-justify'>bo cumque recusandae expedita eos eius aliquid! Inventore iure nam deserunt commodi eos aperiam ullam autem molestiae, esse atque numquam illo laborum ex! Minima, laboriosam quam?
                Temporibus sed eaque numquam maxime fugit eos quaerat velit alias sit. Iusto quaerat rem, iure laboriosam libero quas aperiam incidunt, qui eos a adipisci nobis voluptate. Ad nulla sit nisi!
                Sunt tenetur nihil molestiae quia o cupiditate eveniet atque molestias mollitia ut aliquid at dolores cum repellat incidunt error doloribus repudiandae, provident perferendis assumenda.</p>
            </div>
            {
                edit&&<UserDetail canEdit={false} user={response?.data} setShowDetail={setEdit} setIsAdd={setReload}/>
            }
        </div>
    )
}
