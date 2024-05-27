"use client"

import Axios from "@/hooks/axios.config";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import  { SetStateAction, useEffect, useState } from "react";
const Status = ['pending', 'postponed', 'success', 'reject'];
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

export default function ApplicationDetail({application,setShowDetail,setApplication}:{application:Props,setShowDetail:React.Dispatch<SetStateAction<boolean>>,setApplication:React.Dispatch<SetStateAction<Props>>}) {
    const [edit,setEdit]=useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const [reload, setReload] = useState(false);
    const [token, setToken] = useState<string>();
    useEffect(()=>{
    },[application,setShowDetail]);

    
    async function HandleDelete(a: Props): Promise<void> {
        try {
            const res = await Axios.delete(`applications/${application._id}`, {
                headers: {
                    "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
                }
            });
            if (res.status == 204 || res.status == 200) {
                setReload(state=>!state);
            }
        } catch (error: any) {
            console.log(error);
            if (error.response.status == 401) {
                try {
                    const res = await Axios.post("users/refresh_token", { refresh: sessionStorage.getItem("refresh") });
                    if (res.status == 201 || res.status == 200) {
                        setToken(res.data.token);
                        sessionStorage.setItem("token", res.data.token);
                        if (sessionStorage.getItem("token")) {
                            setReload(true);
                        }
                    }
                } catch (err: any) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("refresh");
                    if (err.response.status == 401) {
                        router.push(`/login?ReturnUrl=${pathname}`);
                    }
                    setReload(state=>!state);
                }
            }
        }
    }

    const SaveChange = async (a: Props) => {
    setShowDetail(state => !state);
        try {
            const res = await Axios.put(`applications/${application._id}`, application, {
                headers: {
                    "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
                }
            });
            if (res.status == 201 || res.status == 200) {
                setReload(state=>!state);
            }
        } catch (error: any) {
            if (error.response.status == 401) {
                try {
                    const res = await Axios.post("users/refresh_token", { refresh: sessionStorage.getItem("refresh") });
                    if (res.status == 201 || res.status == 200) {
                        setToken(res.data.token);
                        sessionStorage.setItem("token", res.data.token);
                        if (sessionStorage.getItem("token")) {
                            setReload(state=>!state);
                        }
                    }
                } catch (err: any) {
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

  return (
   <div className="absolute inset-0 flex justify-center items-center flex-col">
        <div  onClick={()=>setShowDetail(state=>!state)} className="absolute inset-0 opacity-50 bg-gray-100 z-1"></div>
        <div className="flex flex-col flex-1 space-y-3 z-30 w-10/12 my-10 bg-white opacity-100 md:rounded ">
            <h1 className="mx-2 py-2  font-bold">{application?.Title}</h1>
            <ul className="flex mx-2 md:mx-0 border-b-2 italic md:flex-row flex-col justify-between md:items-center">
                <li className="md:pl-2">{application?.Entreprise}</li>
                <li className="">{application?.Adresse}</li>
                <li className="">{
                    edit ? <select onChange={(e) => {
                        setApplication((state: Props) => {
                            return { ...application, Status: (e.target.value != application.Status) ? e.target.value : application?.Status }
                        });
                    }}>
                        <option value={application?.Status} selected>{application?.Status}</option>
                        {Status.filter(s => s !== application?.Status).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select> : <>{application?.Status}</>
                }</li>
                <li className="md:pr-2">{application?.CreatedAt?.split('T')[0].split('-').reverse().join('/')}</li>
                <li>{(!edit) ?
                    <div className='flex justify-between'>
                        <button className='text-blue w-1/3 text-xl' onClick={() => setEdit(state => !state)}><EditOutlined className="p-1 hover:rounded-md text-blue-400 hover:text-white hover:bg-blue-300 hover:shadow" /></button>
                        <button className='w-1/3 text-cyan-300 text-xl' onClick={() => HandleDelete(application)}><DeleteOutlined className="p-1 hover:shadow hover:rounded-md hover:bg-red-300 hover:text-white" /></button>
                    </div>
                    : <button onClick={() => SaveChange(application)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline">SaveChange</button>
                }</li>
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
