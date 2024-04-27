import React from 'react'

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
  return (
    <div className='flex p-1 hover:cursor-pointer hover:shadow-blue-400 hover:border-inherit rounded-lg flex-col shadow'>
        <div className='flex justify-between'><h1>{application.Title}</h1> <span className={`rounded-md shadow text-center p-1 ${application.Status==="success"?'bg-green-400':'bg-red-400'}`}>{application.Status}</span></div>
        <p className='text-justify text-wrap truncate'>
            {application.JobDescription}
        </p>
        <h1 className='text-sm'>{application.CreatedAt?.toLocaleString().split('T')[0].split('-').reverse().join('/')}</h1>
    </div>
  )
}
