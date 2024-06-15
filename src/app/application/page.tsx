"use client"
import React, { useEffect, useState } from 'react';
import { Button, Row, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import ApplicationDetail, { CustomType, Props } from '../components/ApplicationDetail';
import Axios from '@/hooks/axios.config';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { PlusOutlined } from '@ant-design/icons';
import AddApplication from '../components/AddApplication';


  

  

  


const Application: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<any>();
  const [response, setResponse] = useState<CustomType>({ isLoading: false, status: 0, data: undefined, error: undefined, isSuccess: false });
  const [isAdd, setIsAdd] = useState(false);
  const [reload, setReload] = useState(false);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [filter,setFilter]=useState('all');

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(12);
  const [url, setUrl] = useState<any>(`${Axios.defaults.baseURL}` + `applications?page=${page}&limit=${limit}`);
  const router = useRouter();
  const pathname = usePathname();
  const [currentApp, setCurrentApp] = useState<any>({});
  const [showDetail, setShowDetail] = useState(false);
  const [total,setTotal]=useState(10);
  const [handleAdd,setHandleAdd]=useState(false);

  const columns: TableColumnsType<Props> = [
    {
      title: 'Title',
      dataIndex: 'Title'
    },
    {
      title: 'Entreprise',
      dataIndex: 'Entreprise',
    },
    {
      title: 'Adresse',
      dataIndex: 'Adresse',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
    },
    {
      title: 'TypeContrat',
      dataIndex: 'TypeContrat',
    },
    {
      title: 'CreatedAt',
      dataIndex: 'CreatedAt',
      render:(value)=>(value as string).split('T')[0].split('-').reverse().join('/')
    },
    
  ];

  useEffect(() => {
    setToken((state:any)=>{
      state=window && localStorage.getItem('token');
      return state;
    });
    const findAll=async () => {
      try {
  
        const res = await axios.get(url+`&status=${filter}`, {
          headers: {
            "Authorization": window.localStorage ? ("Bearer " + window.localStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {
          setTotal(state=>state=res.data.data.count);
          setResponse(state => {
            return { ...state, isLoading: false, status: res.status, data: res.data.data.applications, isSuccess: true };
          });
          setPrev(state=>{
            return state = res.data.prev;
          });
          setNext(state=>{
            return state=res.data.next;
          });
          if (response?.data) {
            setReload(state=>!state);
          }
        }
        
      } catch (error: any) {
        if (error.response.status == 401) {
  
          try {
            const res = await Axios.post("users/refresh_token", { refresh: localStorage.getItem("refresh") });
            if (res.status == 201 || res.status == 200) {
              setToken((state: any)=>state=res.data.token);
              localStorage.setItem("token", res.data.token);
              if (localStorage.getItem("token")) {
                setReload(state=>!state);
              }
            }
          } catch (err: any) {
  
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
    findAll();
  }, [limit, page, response.isLoading, prev, url, filter, token, next, pathname, router, isAdd, reload, response?.data]);


  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };



  return (
    <div className='mx-2 flex flex-col min-h-full'>
      <div className='h-10 bg-slate-50 mt-2 flex items-center rounded-t-md justify-end'>
        <Button icon={<PlusOutlined />} onClick={() => setHandleAdd(!handleAdd)} className='mx-2 rounded-full hover:bg-blue-500 hover:text-white text-2xl w-8 h-8'/>
      </div>
      
      <Table className=' cursor-pointer' onRow={(record,index)=>{
        return{
          onClick:(e)=>{
            setCurrentApp((state:Props)=>state=record);
            setShowDetail(state=>!state);
          }
        }
      }} columns={columns} dataSource={response?.data} pagination={{
        onChange:()=>console.log('hello'),
        total:total
      }}/>{
        showDetail && currentApp && <ApplicationDetail setApplication={setCurrentApp} application={currentApp} setShowDetail={setShowDetail}/>
      }
      {
        handleAdd &&<AddApplication setIsAdd={setIsAdd} setHandleAdd={setHandleAdd}/> 
      }
    </div>
  );
};

export default Application;