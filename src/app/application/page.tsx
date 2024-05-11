"use client"
import { AppstoreAddOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react"
import AddApplication from "../components/AddApplication";
import ApplicationItem from "../components/ApplicationItem";
import { usePathname, useRouter } from "next/navigation";
import { CustomType, Props } from "../components/ApplicationDetail";
import Axios from "@/hooks/axios.config";
import axios from "axios";

export default function Application() {
  const [handleAdd, setHandleAdd] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(12);
  const [url,setUrl]=useState<any>(`${Axios.defaults.baseURL}`+`applications?page=${page}&limit=${limit}`);
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<any>();
  const [response, setResponse] = useState<CustomType>();
  const [isAdd,setIsAdd]=useState(false);
  const [reload,setReload]=useState(false);
  const [next,setNext]=useState(null);
  const [prev,setPrev]=useState(null);


  useEffect(() => {
    setToken(window&&sessionStorage.getItem('token'));
    const findAll = async () => {
      setResponse({ ...response, isLoading: true, data: null, isError: false, isSuccess: false, error: "", status: 0 });
      try {
        
        const res = await axios.get(url, {
          headers: {
            "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {
          setResponse({ ...response, isLoading: false, status: res.status, data: res.data.data.applications, isSuccess: true });
          setPrev(res.data.prev);
          setNext(res.data.next);
          if(response?.data){
            setReload(true);
          }
        }
      } catch (error: any) {
        if (error.response.status == 401) {
          
          try {
            const res=await Axios.post("users/refresh_token",{refresh:sessionStorage.getItem("refresh")});
            console.log(res);
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
  }, [limit, page, token, url,prev,next,pathname, router,isAdd,reload]);

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
    <div className='container mx-auto flex-1 flex flex-col'>
      <div className="flex justify-end h-7">
        {
          (!handleAdd) ? <button className="rounded-lg hover:bg-blue-500 hover:my-2 text-center h-full w-7 text-3xl md:text-xl mr-2 hover:text-white" onClick={() => setHandleAdd(!handleAdd)}><AppstoreAddOutlined className="h-5/6 w-5/6" /></button> : <AddApplication setHandleAdd={setHandleAdd} setIsAdd={setIsAdd} />
        }
      </div>
      <section className="flex flex-col flex-1 space-y-2">
        <div className="flex-1 mx-4 grid md:grid-cols-4 gap-3 grid-cols-1">
          {
            response?.data?.map((a: Props) => {
              return (<ApplicationItem key={a._id} application={a} setIsAdd={setIsAdd} />)
            }
            )
          }
        </div>
        {
          next &&(
            <div className="flex justify-end mb-1 mx-4 space-x-3  items-end basis-1">
            <button onClick={() => setUrl(prev)}
            className="flex hover:bg-blue-400 hover:text-white space-x-1 px-1 items-center justify-center shadow rounded-md">
              <DoubleLeftOutlined /><span>prev</span>
            </button>
            <button onClick={() => setUrl(next)}
            className={`flex hover:bg-blue-400 hover:text-white  px-1 items-center space-x-1 shadow justify-center rounded-md`} disabled>
              <span>next</span><DoubleRightOutlined />
            </button>
          </div>
          )
        }
      </section>
    </div>
  )
}
