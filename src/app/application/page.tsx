"use client"
import { AppstoreAddOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react"
import AddApplication from "../components/AddApplication";
import { usePathname, useRouter } from "next/navigation";
import Axios from "@/hooks/axios.config";
import axios from "axios";
import { Table } from "antd";
import { CustomType } from "../components/ApplicationDetail";

export default function Application() {
  const [handleAdd, setHandleAdd] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(12);
  const [url,setUrl]=useState<any>(`${Axios.defaults.baseURL}`+`applications?page=${page}&limit=${limit}`);
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<any>();
  const [response, setResponse] = useState<CustomType>({ isLoading: false, status: 0, data: undefined,error:undefined, isSuccess: false });
  const [isAdd,setIsAdd]=useState(false);
  const [reload,setReload]=useState(false);
  const [next,setNext]=useState(null);
  const [prev,setPrev]=useState(null);



  const columns = [
    {
      title: 'Title',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: 'Entreprise',
      dataIndex: 'Entreprise',
      key: 'Entreprise',
    },
    {
      title: 'Adresse',
      dataIndex: 'Adresse',
      key: 'Adresse',
    },
    {
      title: 'TypeContrat',
      dataIndex: 'TypeContrat',
      key: 'TypeContrat',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
    },
    {
      title: 'Date de Création',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
  ];

  useEffect(() => {
    setToken(window&&sessionStorage.getItem('token'));
    const findAll = async () => {
      try {
        
        const res = await axios.get(url, {
          headers: {
            "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {

          setResponse(state=>{
            return { ...state, isLoading: false, status: res.status, data: res.data.data.applications, isSuccess: true };
          });
          setPrev(res.data.prev);
          setNext(res.data.next);
          if(response?.data){
            setReload(true);
          }
        }
      } catch (error: any) {
        console.log(error);
        if (error.response.status == 401) {
          
          try {
            const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
            if (res.status==201 || res.status==200) {
              setToken(res.data.token);
              sessionStorage.setItem("token",res.data.token);
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
    findAll();
  }, [limit, page, url,prev,next,pathname,response?.data, router,isAdd,reload]);

  if (response?.isLoading) {
    return (
      <div className="flex flex-col justify-center h-full items-center">
        <p className=" animate-bounce text-center">Loading...</p>
      </div>
    )
  }

  if (response?.isError) {
    return (
    <div className="flex justify-center items-center">
      <p className="text-justify text-red-400">{response.error}</p>
    </div>)
  }

  return (
    <div className='flex-1 flex overflow-hidden flex-col space-y-5'>
      <div className="flex justify-end h-7">
        {
          (!handleAdd) ? <button className="rounded-lg  text-center h-full w-7 text-2xl md:text-xl md:mr-8 mr-4 mb-2 hover:text-blue-400" onClick={() => setHandleAdd(!handleAdd)}><AppstoreAddOutlined className="h-5/6 w-5/6 m-2" /></button> : <AddApplication setHandleAdd={setHandleAdd} setIsAdd={setIsAdd} />
        }
      </div>
      <section className="flex flex-col justify-center m-2 items-center flex-1">

        <Table pagination={false} rowKey={(record) => record._id} dataSource={response?.data} columns={columns} />
      </section>
    </div>
  )
}
