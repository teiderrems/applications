"use client"

import  { SetStateAction, useEffect } from "react";

export interface Props{
    _id?:string;
    Title?:string;
    Description?:string;
    JobDescription?:string;
    Entreprise?:string;
    Adresse?:string;
    TypeContrat?:string;
    Status?:string;
    Action?:string
    CreatedAt?:string;
    UpdatedAt?:string;
}

export type CustomType={
    data?:any,
    isError?:boolean;
    isSuccess?:boolean;
    status?:number;
    isLoading?:boolean;
    error?:string;
}

export default function ApplicationDetail({application,setShowDetail}:{application:Props,setShowDetail:React.Dispatch<SetStateAction<boolean>>}) {
    
    useEffect(()=>{
    },[application,setShowDetail]);
  return (
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
  )
}
