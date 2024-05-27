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
    TypeContrat:"alternance",
    Adresse:""
  });
  const router=useRouter();
  const pathname=usePathname();
  const [reload,setReload]=useState(false);
  const [token,setToken]=useState();
  
  const HandleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();

    try {
      console.log(application);
      const res=await Axios.post("applications",application,{
        headers:{
            "Authorization":window.sessionStorage?("Bearer "+window.sessionStorage.getItem("token")):''
        }
      });
      router.refresh();
      setHandleAdd(state=>!state);
      setIsAdd(state=>!state);
    } catch (error:any) {
      if (error.response.status==401) {
        try {
          const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
          if (res.status==201 || res.status==200) {
            setToken(res.data.token);
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

  },[reload,token])
  
  return (
    <div className='wrap-form fixed inset-0 w-full h-full  opacity-100 z-10'>
        <div onClick={()=>setHandleAdd(state=>!state)} className="absolute  inset-0 bg-gray-700 opacity-75 z-0"></div>
        <form onSubmit={HandleSubmit} className='form-app z-10'>
             <div className='w-full mb-2 md:mb-0 justify-around md:justify-between md:h-12 h-44 px-2 flex md:flex-row space-y-1 flex-col'>
                <div className='flex justify-between md:w-5/6 h-1/2 md:h-full w-full md:flex-row flex-col'>
                  <label className='flex-1'  htmlFor="title">Title</label>
                  <input onChange={(e)=>setApplication({...application,Title:e.target.value})} 
                  className='flex-1 md:mr-1 shadow pl-1 rounded-md' type="text" required minLength={4} />
                </div>
                <div className='flex md:w-5/12 w-full md:flex-row h-1/2 flex-col md:h-full justify-between'>
                  <label htmlFor="contrat" className='flex-1 md:translate-y-2'>Type</label>
                  <select name="contrat" defaultValue={'alternance'} id="contrat" 
                  onChange={(e)=>setApplication({...application,TypeContrat:e.target.value})} 
                  className='rounded-md w-full flex-1 shadow'>
                      {
                        Contrat.map(c=>(<option value={c} key={c} className=' uppercase'>{c}</option>))
                      }
                    </select>
                </div>
             </div>
             <div className='form-group-app'>
                <label className='flex-1' 
                htmlFor="entreprise">Entreprise</label>
                <input onChange={(e)=>setApplication({...application,Entreprise:e.target.value})} 
                className='input-form-app' type="text" required minLength={4} />
              </div>
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
