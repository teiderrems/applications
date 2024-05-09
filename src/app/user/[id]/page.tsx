'use client'

import { CustomType } from '@/app/components/ApplicationDetail';
import Axios from '@/hooks/axios.config';
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import  profileImg  from '../../../../public/defaul.jpeg';
import Image from 'next/image';



export default function Userdetail() {

    const param=useParams().id;
    const [response,setResponse]=useState<CustomType>();
    const router=useRouter();
    const pathname=usePathname();
    useEffect(()=>{
        const getUser=async()=>{
            try {
                const res=await Axios.get(`users/${param}`,{
                    headers: {
                        "Authorization": window.localStorage ? ("Bearer " + window.localStorage.getItem("token")) : ''
                    }
                });
                if (res.status == 201 || res.status == 200) {
                    setResponse({ ...response, isLoading: false, status: res.status, data: res.data.user, isSuccess: true });
                }
            } catch (error: any) {
                if (error.response.status == 401) {
                try {
                    const res=await Axios.post("users/refresh_token",{refresh:localStorage.getItem("refresh")});
                    if (res.status==201 || res.status==200) {
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
        getUser();
        
    },[param])

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
        <div className='flex-1 flex md:flex-row h-full flex-col'>
            <div className='flex-1 flex items-center justify-center'>
            <Image className=' md:h-full md:w-full w-full h-full pt-1' width={500} height={500} src={(!response?.data.Profile.includes('null'))?response?.data.Profile:profileImg} alt="profile"/>
            </div>
            <div  className='flex-1 flex flex-col justify-between md:justify-center border-l'>
                
                <p className='text-justify border flex-1 flex justify-between px-3 bg-red-300'><span>Username</span><span className='w-3/5'>: {response?.data.Username}</span> </p>
                
                <p className='text-justify border flex-1 flex justify-between px-3 bg-green-300'><span>Email</span><span className='w-3/5'> : {response?.data.Email}</span></p>
                
                <p className='text-justify border flex-1 flex justify-between px-3 bg-blue-300'><span>Firstname</span><span className='w-3/5'>: {response?.data.Firstname}</span> </p>
                
                <p className='text-justify border flex-1 flex justify-between px-3 bg-gray-300'><span>Lastname</span><span className='w-3/5'>: {response?.data.Lastname}</span> </p>
                
                <p className='text-justify border flex-1 flex justify-between px-3 bg-pink-300'><span>Date de Création</span><span className='w-3/5'> : {response?.data.CreatedAt.split('T')[0].split('-').reverse().join('/')}</span></p>
                
                {/* <span className='text-justify border flex-1 bg-cyan-300'>{response?.data.UpdatedAt}</span> */}
                
            </div>
        </div>
    )
}
