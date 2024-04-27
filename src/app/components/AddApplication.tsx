import { usePostApplicationMutation } from '@/lib/features/applications';
import { usePathname, useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useState } from 'react'


type Application={
  Title:string;
  Description:string;
  JobDescription:string;
  Entreprise:string;
  Adresse:string;
}

export default function AddApplication({setHandleAdd}:{setHandleAdd:Dispatch<SetStateAction<boolean>>}) {
  const [postApplication,{isError,isLoading,isSuccess,data,error}]=usePostApplicationMutation();
  
  const [application,setApplication]=useState<Application>({
    Title:"",
    Description:"",
    JobDescription:"",
    Entreprise:"",
    Adresse:""
  });
  const router=useRouter();
  const pathname=usePathname();
  const HandleSubmit=()=>{
    postApplication(application);
    if (isError) {
      console.log(error,data);
    }
    if (isSuccess) {
      setHandleAdd(false);
      console.log(error,data);
      router.refresh();
    }
  }
  
  return (
    <div className='wrap-form absolute top-0 bottom-0 left-0 w-full h-full bg-gray-500 opacity-50 z-10'>
        <form onSubmit={HandleSubmit} className='form-app'>
             <div className='form-group-app'>Title<label className='flex-1'  htmlFor="title"></label><input onChange={(e)=>setApplication({...application,Title:e.target.value})} className='input-form-app' type="text" required minLength={4} /></div>
             <div className='form-group-app'>Entreprise<label className='flex-1'  htmlFor="entreprise"></label><input onChange={(e)=>setApplication({...application,Entreprise:e.target.value})} className='input-form-app' type="text" required minLength={4} /></div>
             <div className='form-group-app'>Adresse<label  className='flex-1' htmlFor="adresse"></label><input onChange={(e)=>setApplication({...application,Adresse:e.target.value})} className='input-form-app' placeholder="entrez l'adresse de l'entreprise" type="text" required minLength={4} /></div>
             <div className='form-group-text'><label className='flex-1'  htmlFor="fichePoste">Fiche de Poste</label><textarea onChange={(e)=>setApplication({...application,JobDescription:e.target.value})} className='md:w-2/3 p-1 rounded-md shadow w-full  mr-1' required minLength={4} ></textarea></div>
             <div className='form-group-text'><label className='flex-1'  htmlFor="description">Description</label><textarea onChange={(e)=>setApplication({...application,Description:e.target.value})} className='md:w-2/3 p-1 rounded-md shadow w-full  mr-1' required minLength={4} ></textarea></div>
             <div className='w-full justify-start md:h-14 flex px-2 md:px-0 flex-col items-start'><button className='hover:bg-blue-700 rounded-md text-2xl shadow opacity-100 hover:text-white  md:ml-2 w-full md:w-1/3 h-full bg-blue-500' type="submit">Submit</button></div>
        </form>
    </div>
  )
}
