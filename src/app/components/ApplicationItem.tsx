import React from 'react'

type Props={
    _id:String
    Title:String
    Description:String
    JobDescription:String
    Entreprise:String
    Adresse:String
    Status:String
    CreatedAt:Date
    UpdatedAt:Date
}

export default function ApplicationItem({application}:{application:Props}) {
  return (
    <div className='flex rounded-lg flex-col h-1/5 w-1/6'>
        <div><h1>{application.Title}</h1> <span>{application.Status}</span></div>
        <p className='text-justify truncate'>
            {application.JobDescription}
        </p>
    </div>
  )
}
