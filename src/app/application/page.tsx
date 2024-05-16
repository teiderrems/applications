"use client"
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react"
import AddApplication from "../components/AddApplication";
import { usePathname, useRouter } from "next/navigation";
import Axios from "@/hooks/axios.config";
import axios from "axios";
import { CustomType, Props } from "../components/ApplicationDetail";
import ApplicationItem from "../components/ApplicationItem";


const Status = ['all','pending', 'postponed', 'success', 'reject'];


export default function Application() {
  const [handleAdd, setHandleAdd] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(12);
  const [url, setUrl] = useState<any>(`${Axios.defaults.baseURL}` + `applications?page=${page}&limit=${limit}`);
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<any>();
  const [response, setResponse] = useState<CustomType>({ isLoading: false, status: 0, data: undefined, error: undefined, isSuccess: false });
  const [isAdd, setIsAdd] = useState(false);
  const [reload, setReload] = useState(false);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [filter,setFilter]=useState('all');
  

  

  useEffect(() => {
    setToken((state:any)=>{
      state=window && sessionStorage.getItem('token');
      return state;
    });
    const findAll = async () => {
      try {

        const res = await axios.get(url+`&status=${filter}`, {
          headers: {
            "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {

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
            const res = await Axios.post("users/refresh_token", { refresh: sessionStorage.getItem("refresh") });
            if (res.status == 201 || res.status == 200) {
              setToken((state: any)=>state=res.data.token);
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
    findAll();
  }, [limit, page, url,response?.isLoading, prev,filter, token, next, pathname,window&&sessionStorage.getItem('token'), router, isAdd, reload]);

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
    <div className='flex-1 flex overflow-hidden mx-2 flex-col space-y-5'>
      <div className="flex justify-end space-x-3 h-7">
      <div className="flex space-x-2 shadow hover:shadow-blue-400 rounded-md">
        <label htmlFor="filter" className="mt-2 h-5/6">Filter :</label>
        <select className=" capitalize mt-2 h-5/6" onChange={(e) => {
            setFilter(e.target.value);
            setReload(!reload);              
          }}>
              <option value={filter} selected>{filter}</option>
              {Status.filter(s => s !== filter).map(s => (
                  <option key={s} value={s}>{s}</option>
              ))}
          </select>
      </div>
        {
          (!handleAdd) ? <button className="rounded-lg  text-center h-full w-7 text-2xl md:text-xl  mr-4 mb-2 hover:text-blue-400" onClick={() => setHandleAdd(!handleAdd)}><AppstoreAddOutlined className="h-5/6 w-5/6 m-2" /></button> : <AddApplication setHandleAdd={setHandleAdd} setIsAdd={setIsAdd} />
        }
      </div>
      <div className="shadow-md sm:rounded-lg w-full">
        <table className="w-full overflow-x-auto overflow-y-hidden text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-1 py-1">
                Titre
              </th>
              <th scope="col" className="px-1 py-1">
                Entreprise
              </th>
              <th scope="col" className="px-1 py-1">
                Adresse
              </th>
              <th scope="col" className="px-1 py-1">
                Status
              </th>
              <th scope="col" className="px-1 py-1">
                Type Contrat
              </th>
              <th scope="col" className="px-1 py-1">
                Date Création
              </th>
              <th scope="col" className="px-1 py-1">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {
              response.data?.map((a: Props) => (
                <ApplicationItem key={a._id} application={a} setIsAdd={setIsAdd}/>
              ))
            }
          </tbody>
        </table>
        {
          next && <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li onClick={() => setUrl(prev)}>
                <a href="#" className="flex items-center justify-center px-1 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-center px-1 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
              </li>
              <li onClick={() => setUrl(next)}>
                <a href="#" className="flex items-center justify-center px-1 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
              </li>
            </ul>
          </nav>
        }
      </div>
    </div>
  )
}
