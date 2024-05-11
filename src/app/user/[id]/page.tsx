'use client'

import { CustomType } from '@/app/components/ApplicationDetail';
import Axios from '@/hooks/axios.config';
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import  profileImg  from '../../../../public/defaul.jpeg';
import Image from 'next/image';
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';



export default function Userdetail() {

    const param=useParams().id;
    const [response,setResponse]=useState<CustomType>();
    const [profile,setProfile]=useState<string |undefined>(undefined);
    const router=useRouter();
    const [token,setToken]=useState<string>();
    const pathname=usePathname();
    const [reload,setReload]=useState(false);
    const HandleDelete=async()=>{
        
        setResponse({...response,isLoading:true,data:null,isError:false,isSuccess:false,error:"",status:0});
        try {
            const res=await Axios.delete("users/"+param,{
                headers:{
                    "Authorization":window.sessionStorage?("Bearer "+window.sessionStorage.getItem("token")):''
                }
            });
            router.push(pathname);
            if (res.status==204) {
                setResponse({...response,isLoading:false,status:res.status,data:res.data,isSuccess:true});
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
        setToken(window&& (sessionStorage.getItem('token') as string)&&(sessionStorage.getItem('token') as string));
        const getUser=async()=>{
            try {
                const res=await Axios.get(`users/${param}`,{
                    headers: {
                        "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
                    }
                });
                if (res.status == 201 || res.status == 200) {
                    setResponse({ ...response, isLoading: false, status: res.status, data: res.data.user, isSuccess: true });
                    // if (response?.data) {
                    //     const obj=JSON.parse(response?.data.Profile);
                    //     const image=`data:${obj.type};base64,${obj.image}`;
                    //     setProfile(image as string);
                    // }
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
        getUser();
    },[param,response?.isLoading,token,response?.isSuccess,response?.isError]);

    if (response?.isLoading) {
        return (
            <div className="flex flex-col justify-center h-full items-center">
            <p className=" animate-bounce text-center">Loading...</p>
            </div>
        )
    }

    if (response?.isError) {
        return (
        <div className="flex justify-center items-center">
            <p className="text-justify text-red-400">{response.error}</p>
        </div>)
    }
    return (
        <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='flex-1 space-y-2 mt-5 flex flex-col w-5/6 h-5/6'>
                <div className='flex-1 flex md:flex-row flex-col rounded-md shadow'>
                    <Image className=' md:w-2/6 w-full md:rounded-l-lg rounded-t-md float-start' width={100} height={100} src={(response?.data.Profile)?(response?.data.Profile):profileImg} alt="profile"/>
                    <div  className='flex-1 flex flex-col justify-between md:justify-center border-l'>
                        <p className='text-justify border flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data.Username}</span> </p>
                        <p className='text-justify border flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data.Email}</span></p>
                        <p className='text-justify border flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data.Firstname}</span> </p>
                        <p className='text-justify border flex-1 items-center flex justify-between px-2'><span className='w-4/5'>{response?.data.Lastname}</span> </p>
                        <p className='text-justify border flex-1 items-center flex justify-between px-2'><span className='w-3/5'>{response?.data.CreatedAt.split('T')[0].split('-').reverse().join('/')}</span></p>
                    </div>
                </div>   
                <div className='flex md:justify-end justify-between space-x-2 h-1/12 w-full'>
                    <button className='rounded-md bg-blue-400 md:my-2 my-4  h-5/6 w-2/12 md:w-1/12 text-white'><EditOutlined /></button>
                    <button className='rounded-md bg-red-400 md:my-2 my-4  h-5/6 w-2/12 md:w-1/12 text-white' onClick={HandleDelete}><DeleteOutlined /></button>
                </div>
            </div>
        </div>
    )
}
