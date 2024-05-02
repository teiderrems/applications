import Axios from '@/hooks/axios.config';
import { usePathname, useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'


type Application={
  Title?:string;
  Description?:string;
  TypeContrat?:string;
  JobDescription?:string;
  Entreprise?:string;
  Adresse?:string;
}

let Contrat=['alternance','stage','cdi','cdd','interim']

export default function AddApplication({setHandleAdd,setIsAdd}:{setHandleAdd:Dispatch<SetStateAction<boolean>>,setIsAdd:Dispatch<SetStateAction<boolean>>}) {  
  const [application,setApplication]=useState<Application>({
    Title:"",
    Description:"",
    JobDescription:"",
    Entreprise:"",
    TypeContrat:"",
    Adresse:""
  });
  const router=useRouter();
  const pathname=usePathname();
  const [reload,setReload]=useState(false);
  const HandleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();

    try {
      const res=await Axios.post("applications",application,{
        headers:{
            "Authorization":window.localStorage?("Bearer "+window.localStorage.getItem("token")):''
        }
      });
      router.refresh();
      setHandleAdd(state=>!state);
      setIsAdd(state=>!state);
    } catch (error:any) {
      if (error.response.status==401) {
        try {
          const res=await Axios.post("users/refresh_token",{refresh:localStorage.getItem("refresh")});
          if (res.status==201 || res.status==200) {
            localStorage.setItem("token",res.data.token);
            localStorage.setItem("refresh",res.data.refresh);
            if (localStorage.getItem("token")) {
              setReload(true);
            }
          }
        } catch (err:any) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          if (err.response.status == 401) {
            router.push(`/login?ReturnUrl=${pathname}`);
          }
          setReload(false);
        }
      }
    }
  }

  useEffect(()=>{

  },[reload])
  
  return (
    <div className='wrap-form fixed inset-0 w-full h-full  opacity-100 z-10'>
        <div onClick={()=>setHandleAdd(state=>!state)} className="absolute inset-1 bg-gray-500 z-0"></div>
        <form onSubmit={HandleSubmit} className='form-app z-10'>
             <div className='form-group-app'>
              <label className='flex-1'  htmlFor="title">Title</label>
              <div className='md:w-2/3 w-full md:h-full h-3/4 flex justify-between'>
              <input onChange={(e)=>setApplication({...application,Title:e.target.value})} className='md:flex-1 mr-1 shadow pl-1 rounded-md' type="text" required minLength={4} />
                <div className='flex md:w-5/12 space-x-1'>
                  <label htmlFor="contrat" className='flex-1 md:translate-y-2'>Type</label>
                  <select name="contrat" defaultValue={'alternance'} id="contrat" onChange={(e)=>setApplication({...application,TypeContrat:e.target.value})} className='rounded-md w-3/4 shadow'>
                      {
                        Contrat.map(c=>(<option value={c} key={c} className=' uppercase'>{c}</option>))
                      }
                    </select>
                </div>
                </div>
             </div>
             <div className='form-group-app'><label className='flex-1'  htmlFor="entreprise">Entreprise</label><input onChange={(e)=>setApplication({...application,Entreprise:e.target.value})} className='input-form-app' type="text" required minLength={4} /></div>
             <div className='form-group-app'>
              <label  className='flex-1' htmlFor="adresse">Adresse</label>
              
              <input onChange={(e)=>setApplication({...application,Adresse:e.target.value})} className='input-form-app' placeholder="entrez l'adresse de l'entreprise" type="text" required minLength={4} />
              </div>
             <div className='form-group-text'><label className='flex-1'  htmlFor="fichePoste">Fiche de Poste</label><textarea onChange={(e)=>setApplication({...application,JobDescription:e.target.value})} className='md:w-2/3 p-1 rounded-md shadow w-full  mr-1' minLength={4} ></textarea></div>
             <div className='form-group-text'><label className='flex-1'  htmlFor="description">Description</label><textarea onChange={(e)=>setApplication({...application,Description:e.target.value})} className='md:w-2/3 p-1 rounded-md shadow w-full  mr-1' minLength={4} ></textarea></div>
             <div className='w-full justify-start md:h-14 flex px-2 md:px-0 flex-col items-start'><button className='hover:bg-blue-700 rounded-md text-2xl shadow opacity-100 hover:text-white  md:ml-2 w-full md:w-1/3 h-full bg-blue-500' type="submit">Submit</button></div>
        </form>
    </div>
  )
}
