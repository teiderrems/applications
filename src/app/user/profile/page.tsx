'use client'

import { CustomType } from '@/app/components/ApplicationDetail';
import Axios from '@/hooks/axios.config';
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import  profileImg  from '../../../../public/defaul.jpeg';
import Image from 'next/image';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UserDetail from '@/app/components/UserDetail';



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
                    "Authorization":window.sessionStorage?("Bearer "+window.sessionStorage.getItem("token")):''
                }
            });
            if (res.status==204) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('refresh');
                sessionStorage.removeItem('userId');
                router.push('/register');
            }
        } catch (error:any) {
            if (error.response.status==401) {
                try {
                  const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
                  if (res.status==201 || res.status==200) {
                    sessionStorage.setItem("token",res.data.token);
                    sessionStorage.setItem("refresh",res.data.refresh);
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
        }
    }

    useEffect(()=>{
        setParam(window&& (sessionStorage.getItem('userId') as string)&&(sessionStorage.getItem('userId') as string));
        setToken(window&& (sessionStorage.getItem('token') as string)&&(sessionStorage.getItem('token') as string));
        const getUser=async()=>{
            try {
                const res=await Axios.get(`users/${param}`,{
                    headers: {
                        "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
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
                    const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
                    if (res.status==201 || res.status==200) {
                        
                        setToken(res.data.token);
                        sessionStorage.setItem("token",res.data.token);
                    }
                } catch (err:any) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("refresh");
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
        <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='flex-1 space-y-2 mt-5 flex flex-col w-5/6 h-5/6'>
                <div className='flex-1 flex md:flex-row flex-col rounded-md shadow'>
                    <Image className=' flex-1 w-full md:rounded-l-lg rounded-t-md float-start' width={100} height={100} src={(response?.data?.ProfileId)?(profile):profileImg} alt="profile"/>
                    <div  className='flex-1 flex flex-col md:rounded-r-lg justify-between md:justify-center'>
                        <p className='text-justify border-b flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Username}</span> </p>
                        <p className='text-justify border-b flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Email}</span></p>
                        <p className='text-justify border-b flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Firstname}</span> </p>
                        <p className='text-justify border-b flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data?.Lastname}</span> </p>
                        <p className='text-justify border-b flex-1 items-center flex justify-between px-2'><span className='w-3/5'>{response?.data?.CreatedAt.split('T')[0].split('-').reverse().join('/')}</span></p>
                    </div>
                </div>   
                <div className='flex md:justify-end justify-between space-x-2 h-1/12 w-full'>
                    <button className='rounded-md bg-blue-400 md:my-2 my-4  h-5/6 w-2/12 md:w-1/12 text-white' onClick={()=>setEdit(!edit)}><EditOutlined /></button>
                    <button className='rounded-md bg-red-400 md:my-2 my-4  h-5/6 w-2/12 md:w-1/12 text-white' onClick={HandleDelete}><DeleteOutlined /></button>
                </div>
            </div>
            {
                edit&&<UserDetail canEdit={false} user={response?.data} setShowDetail={setEdit} setIsAdd={setReload}/>
            }
        </div>
    )
}
