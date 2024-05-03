
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ApplicationDetail from './ApplicationDetail';

type Props={
    _id?:string;
    Title?:string;
    Description?:string;
    JobDescription?:string;
    Entreprise?:string;
    TypeContrat?:string;
    Adresse?:string;
    Status?:string;
    CreatedAt?:Date;
    UpdatedAt?:Date;
}

export default function ApplicationItem({application,setIsAdd}:{application:Props,setIsAdd:Dispatch<SetStateAction<boolean>>}) {
  const [showDetail,setShowDetail]=useState(false);
  useEffect(()=>{

  },[application,setIsAdd])
  return (
    <>
      <button onClick={()=>setShowDetail(!showDetail)} >
      <div className='flex p-1 text-justify hover:cursor-pointer hover:shadow-blue-400 hover:border-inherit  rounded-lg flex-col shadow'>
            <div className='flex justify-between items-center border-b'>
            <h1 className='text-wrap w-9/12 px-1'>{application.Title}</h1>
            <h1 className='text-wrap flex-1 self-start'><span className='italic capitalize'>{application.TypeContrat??'inconnu'}</span></h1> 
            </div>
          <ul>
            <li className='text-wrap'><span></span>{application.Entreprise}</li>
            <li className='text-wrap'>{application.Adresse}</li>
            <li> {application.CreatedAt?.toLocaleString().split('T')[0].split('-').reverse().join('/')}</li>
            <li><span className={application.Status=="success"?'text-green-200 italic':'text-red-300 italic'}>{application.Status}</span></li>
          </ul>
      </div>
    </button>
    {
      showDetail&&<ApplicationDetail setIsAdd={setIsAdd} application={application} setShowDetail={setShowDetail}/>
    }
    </>
  )
}
