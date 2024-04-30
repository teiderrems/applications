
import React, { SetStateAction, useState } from 'react'
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

export default function ApplicationItem({application}:{application:Props}) {
  const [showDetail,setShowDetail]=useState(false);
  
  return (
    <>
      <button onClick={()=>setShowDetail(!showDetail)} >
      <div className='flex p-1 text-justify hover:cursor-pointer hover:shadow-blue-400 hover:border-inherit  rounded-lg flex-col shadow'>
            <div className='flex justify-between items-center border-b'>
            <h1 className='text-wrap w-9/12'>{application.Title}</h1>
            <h1 className='text-wrap flex-1 '><span className='italic capitalize'>{application.TypeContrat??'inconnu'}</span></h1> 
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
      showDetail&&<ApplicationDetail application={application} setShowDetail={setShowDetail}/>
    }
    </>
  )
}
