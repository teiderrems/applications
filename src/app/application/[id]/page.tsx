"use client"

import ApplicationDetail from "@/app/components/ApplicationDetail";
import Axios from "@/hooks/axios.config";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CurrentApp() {

    const param=useParams();
    const pathname=usePathname();
    const router=useRouter();

    const [application,setApplication]=useState<any>(undefined);

    const [showDetail,setShowDetail]=useState(true);
    const [token,setToken]=useState<any>(undefined);

    useEffect(()=>{
        
        const findOne=async()=>{
            try {
                const res=await Axios.get(`applications/${param.id}`,{
                    headers: {
                        "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
                    }
                });
                console.log(res);
                if (res.status == 201 || res.status == 200) {
                    if (!res.data.user) {
                        router.push('/register');
                    }
                    setApplication((state: any)=>state=res.data);
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
        findOne();
    },[param, pathname, router])

  return (
    <>
        {/* <ApplicationDetail application={application} setShowDetail={setShowDetail} /> */}
        <div className="absolute inset-0 flex justify-center items-center flex-col">
        <div  onClick={()=>setShowDetail(state=>!state)} className="absolute inset-0 opacity-50 bg-gray-100 z-1"></div>
        <div className="flex flex-col flex-1 space-y-3 z-30 w-8/12 my-10 bg-white opacity-100 md:rounded ">
            <h1 className="mx-2 py-2  font-bold">{application?.Title}</h1>
            <ul className="flex border-b-2 italic md:flex-row flex-col justify-between items-center">
                <li className="md:pl-2">{application?.Entreprise}</li>
                <li className="">{application?.Adresse}</li>
                <li className="">{application?.Status}</li>
                <li className="md:pr-2">{application?.CreatedAt?.split('T')[0].split('-').reverse().join('/')}</li>
            </ul>
            <div className=" flex-1 flex md:flex-row flex-col">
                <article className=" flex-1 px-2 flex flex-col space-y-2">
                    <h2 className="text-xl">Fiche de Poste</h2>
                    <p className="flex-1 text-wrap">{application?.JobDescription}</p>
                </article>
                <article className="flex flex-1  px-2 flex-col space-y-2">
                    <h2 className="text-xl md:border-l">Description du Poste</h2>
                    <p className="flex-1">{application?.Description}</p>
                </article>
            </div>  
        </div>
   </div>
    </>
  )
}
