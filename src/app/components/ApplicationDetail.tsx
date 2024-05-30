"use client"

import Axios from "@/hooks/axios.config";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message } from "antd";
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
                    "Authorization": window.localStorage ? ("Bearer " + window.localStorage.getItem("token")) : ''
                }
            });
            if (res.status == 204 || res.status == 200) {
                success('deleted');
                setReload(state=>!state);
            }
        } catch (err: any) {
            if (err.response.status == 401) {
                error();
                try {
                    const res = await Axios.post("users/refresh_token", { refresh: localStorage.getItem("refresh") });
                    if (res.status == 201 || res.status == 200) {
                        setToken(res.data.token);
                        localStorage.setItem("token", res.data.token);
                        if (localStorage.getItem("token")) {
                            setReload(true);
                        }
                    }
                } catch (err: any) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh");
                    if (err.response.status == 401) {
                        router.push(`/login?ReturnUrl=${pathname}`);
                    }
                    setReload(state=>!state);
                }
            }
        }
    }

    const SaveChange = async (a: Props) => {
        try {
            const res = await Axios.put(`applications/${application._id}`, application, {
                headers: {
                    "Authorization": window.localStorage ? ("Bearer " + window.localStorage.getItem("token")) : ''
                }
            });
            if (res.status == 201 || res.status == 200) {
                success();
                setReload(state=>!state);
                setTimeout(()=>setShowDetail(state => !state),500);
            }
        } catch (err: any) {
            if (err.response.status == 401) {
                error();
                try {
                    const res = await Axios.post("users/refresh_token", { refresh: localStorage.getItem("refresh") });
                    if (res.status == 201 || res.status == 200) {
                        setToken(res.data.token);
                        localStorage.setItem("token", res.data.token);
                        if (localStorage.getItem("token")) {
                            setReload(state=>!state);
                        }
                    }
                } catch (err: any) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh");
                    if (err.response.status == 401) {
                        error('unauthorized');
                        setTimeout(()=>router.push(`/login?ReturnUrl=${pathname}`),1000)
                    }
                    setReload(false);
                }
            }
        }
    }

    const [messageApi, contextHolder] = message.useMessage();

  const success = (message:string='updated') => {
    messageApi.open({
      type: 'success',
      content: `Application with title ${application.Title} has ${message}`,
      duration:500
    });
  };

  const error = (message:any='unauthorized') => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  return (
   <div className="absolute inset-0 flex justify-center items-center flex-col">
    {contextHolder}
        <div  onClick={()=>setShowDetail(state=>!state)} className="absolute inset-0  bg-gray-700 opacity-75 z-1"></div>
        <div className="flex flex-col flex-1 space-y-3 z-30 w-9/12 my-10 bg-white opacity-100 md:rounded ">
            <h1 className={`mx-2 py-2  font-bold  ${application.Status=='reject'?' line-through':''}`}>{application?.Title}</h1>
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
                <li className="md:mr-2">{(!edit) ?
                    <div className='flex justify-between'>
                        <button className=' w-1/3 text-xl' onClick={() => setEdit(state => !state)}><EditOutlined className="p-1  hover:text-blue-300" /></button>
                        <button className='w-1/3  text-xl' onClick={() => HandleDelete(application)}><DeleteOutlined className="p-1 hover:text-red-300" /></button>
                    </div>
                    : <button onClick={() => SaveChange(application)}
                        className="font-medium   hover:underline">SaveChange</button>
                }</li>
            </ul>
            <div className=" flex-1 flex md:flex-row flex-col">
                <article className=" flex-1 px-2 flex flex-col space-y-2">
                    <h2 className="text-xl">Fiche de Poste</h2>
                    <p className={`flex-1 text-wrap ${application.Status=='reject'?' line-through':''}`}>{application?.JobDescription}</p>
                </article>
                <article className="flex flex-1  px-2 flex-col space-y-2">
                    <h2 className="text-xl md:border-l">Description du Poste</h2>
                    <p className={`flex-1 text-wrap ${application.Status=='reject'?' line-through':''}`}>{application?.Description}</p>
                </article>
            </div>  
        </div>
   </div>
  )
}
