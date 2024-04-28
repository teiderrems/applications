
import React, { useState } from 'react'
import ApplicationDetail from './ApplicationDetail';

type Props={
    _id?:string;
    Title?:string;
    Description?:string;
    JobDescription?:string;
    Entreprise?:string;
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
            <h1 className='border-b text-wrap'>Titre : {application.Title}</h1> 
          {/* <div className='flex justify-around'>
            <span className={`rounded-md shadow text-center p-1 
            ${application.Status==="success"?'bg-green-400':'bg-red-400'}`}>
              {application.Status}</span>
          </div> */}
          <ul>
            <li className='text-wrap'><span>Entreprise : </span>{application.Entreprise}</li>
            <li className='text-wrap'>Adresse : {application.Adresse}</li>
            <li> Date de Création : {application.CreatedAt?.toLocaleString().split('T')[0].split('-').reverse().join('/')}</li>
          </ul>
      </div>
    </button>
    {
      showDetail&&<ApplicationDetail application={application} setShowDetail={setShowDetail}/>
    }
    </>
  )
}
