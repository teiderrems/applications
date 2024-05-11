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
        if (response?.data.Profile) {
            const getProfile=async()=>{
                try {
                  const res=await axios.get(response?.data.Profile);
                  const image=`data:${(res.data.type as string)};base64,${(res?.data?.image as string)}`;
                  setProfile(image as string);
                } catch (error) {
                  console.log(error);
                }
              }
              getProfile();
          }
        
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
        <div className='flex-1 md:space-x-2 flex md:flex-row flex-col'>
            <div className='flex-1 md:w-1/2 space-y-2 flex flex-col md:h-full md:m-6 w-full h-1/2 justify-center'>
                <div className='flex-1'>
                    <Image className=' flex-1 pt-1' width={700} height={700} src={(profile)?profile:profileImg} alt="profile"/>
                    <div  className='flex-1 flex flex-col justify-between md:justify-center border-l'>
                        <p className='text-justify border flex-1 flex justify-between px-3 bg-red-300'><span>Username</span><span className='w-3/5'>: {response?.data.Username}</span> </p>
                        <p className='text-justify border flex-1 flex justify-between px-3 bg-green-300'><span>Email</span><span className='w-3/5'> : {response?.data.Email}</span></p>
                        <p className='text-justify border flex-1 flex justify-between px-3 bg-blue-300'><span>Firstname</span><span className='w-3/5'>: {response?.data.Firstname}</span> </p>
                        <p className='text-justify border flex-1 flex justify-between px-3 bg-gray-300'><span>Lastname</span><span className='w-3/5'>: {response?.data.Lastname}</span> </p>
                        <p className='text-justify border flex-1 flex justify-between px-3 bg-pink-300'><span>Date de Création</span><span className='w-3/5'> : {response?.data.CreatedAt.split('T')[0].split('-').reverse().join('/')}</span></p>
                    </div>
                </div>
                    
                <div className='flex justify-end space-x-2 h-1/12 w-full'>
                    <button className='rounded-md bg-blue-400 my-1 w-1/12 text-white'><EditOutlined /></button>
                    <button className='rounded-md bg-red-400 my-1 w-1/12 text-white' onClick={HandleDelete}><DeleteOutlined /></button>
                </div>
            </div>
            <div className='flex-1 md:m-3 md:mx-0 md:w-1/2 md:h-full w-full h-1/2'>
                <h1>Edit Form</h1>
                <p className=' overflow-hidden'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, sit incidunt. Reprehenderit, in at hic officiis laboriosam veritatis inventore, quisquam iste nulla provident recusandae deleniti officia magnam perspiciatis. Dignissimos, minima!
                Molestias temporibus distinctio quod facere minima nobis dolorem voluptas in maiores. Omnis quo error, repudiandae optio, cum libero saepe ab magnam nobis minima dolores, dolor maiores at. Ipsam, saepe culpa!
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus ut iste, placeat fugiat rerum magnam facere repellendus, quisquam deserunt tenetur amet ab minus odio est nobis doloremque fuga sapiente expedita?
                Amet accusamus nihil consectetur consequuntur eveniet! Pariatur accusantium similique voluptates iure, eaque fugiat! Facilis, sequi ipsum reiciendis ad praesentium quod labore excepturi nobis exercitationem facere quos dolorem nemo quasi aliquam?
                
                
                
                </p>
            </div>
        </div>
    )
}