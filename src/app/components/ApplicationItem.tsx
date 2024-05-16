import React, { Dispatch, SetStateAction, use, useEffect, useState } from 'react'
import ApplicationDetail, { Props } from './ApplicationDetail';
import { usePathname, useRouter } from 'next/navigation';
import Axios from '@/hooks/axios.config';
import { DeleteOutlined, EditOutlined, ReadOutlined } from '@ant-design/icons';

const Status = ['pending', 'postponed', 'success', 'reject'];

export default function ApplicationItem({ application, setIsAdd }: { application: Props, setIsAdd: Dispatch<SetStateAction<boolean>> }) {

    const router = useRouter();
    const pathname = usePathname();
    const [reload, setReload] = useState(false);
    const [token, setToken] = useState<string>();
    const [currentApp, setCurrentApp] = useState<any>({});
    const [viewDetail, setViewDetail] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(()=>{

    },[application,reload,pathname,token,currentApp])

    async function HandleDelete(a: Props): Promise<void> {
        try {
            const res = await Axios.delete(`applications/${currentApp._id}`, {
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
        if (currentApp && a.Status !== currentApp.Status) {
            try {
                const res = await Axios.put(`applications/${currentApp._id}`, currentApp, {
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
    }

    return (
        <tr key={application._id} className={`border-b dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${application.Status == 'reject' ? 'bg-red-300' : 'bg-white'}`}>

            <td scope="row" className="px-1 py-1 font-medium capitalize text-gray-900 whitespace-nowrap dark:text-white">
                {application.Title}
            </td>
            <td className="px-1 py-1 capitalize">
                {application.Entreprise}
            </td>
            <td className="px-1 py-1 capitalize">
                {application.Adresse}
            </td>
            <td className="px-1 py-1 capitalize">
                {
                    showDetail ? <select onChange={(e) => {
                        setCurrentApp((state: Props) => {
                            return { ...application, Status: (e.target.value != application.Status) ? e.target.value : application.Status }
                        });
                    }}>
                        <option value={application.Status} selected>{application.Status}</option>
                        {Status.filter(s => s !== application.Status).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select> : <>{application.Status}</>
                }
            </td>
            <td className="px-1 py-1 capitalize">
                {application.TypeContrat}
            </td>
            <td className="px-1 py-1">
                {application.CreatedAt?.split('T')[0].split('-').reverse().join('/')}
            </td>
            <td className="px-1 py-1">
                {(!showDetail) ?
                    <div className='flex space-x-2'>
                        <button className='text-blue w-1/3 text-xl' onClick={() => setShowDetail(state => !state)}><EditOutlined className="p-1 hover:rounded-md text-blue-400 hover:text-white hover:bg-blue-300 hover:shadow" /></button>
                        <button className='text-blue w-1/3 text-xl' onClick={() => setViewDetail(state => !state)}><ReadOutlined className="p-1 hover:rounded-md text-green-400 hover:text-white hover:bg-blue-500 hover:shadow" /></button>
                        <button className='w-1/3 text-cyan-300 text-xl' onClick={() => HandleDelete(application)}><DeleteOutlined className="p-1 hover:shadow hover:rounded-md hover:bg-red-300 hover:text-white" /></button>
                    </div>
                    : <button onClick={() => SaveChange(application)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline">SaveChange</button>
                }
            </td>
            {
                viewDetail && <ApplicationDetail application={application} setShowDetail={setViewDetail} />
            }
        </tr>
    )
}
