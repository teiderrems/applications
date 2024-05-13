"use client"
import { AppstoreAddOutlined, DeleteOutlined, DoubleLeftOutlined, DoubleRightOutlined, EditOutlined, ReadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react"
import AddApplication from "../components/AddApplication";
import { usePathname, useRouter } from "next/navigation";
import Axios from "@/hooks/axios.config";
import axios from "axios";
import ApplicationDetail, { CustomType, Props } from "../components/ApplicationDetail";

const Status = ['pendding', 'postponed', 'success', 'reject'];

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
  const [showDetail, setShowDetail] = useState(false);
  const [currentApp, setCurrentApp] = useState<any>({});
  const [viewDetail,setViewDetail]=useState(false);

  const SaveChange = async () => {
    setShowDetail(state => !state);
    if (currentApp) {
      try {
        const res = await Axios.put(`applications/${currentApp._id}`, currentApp, {
          headers: {
            "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
          }
        });
        if (res.status == 201 || res.status == 200) {
          setReload(true);
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
            setReload(false);
          }
        }
      }
    }
  }

  useEffect(() => {
    setToken((state:any)=>{
      state=window && sessionStorage.getItem('token');
      return state;
    });
    const findAll = async () => {
      try {

        const res = await axios.get(url, {
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
  }, [limit, page, url, prev, token, next, pathname, response?.data, router, isAdd, reload, showDetail]);

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



  async function HandleDelete(a:Props): Promise<void> {
    try {
      const res = await Axios.delete(`applications/${currentApp._id}`,{
        headers: {
          "Authorization": window.sessionStorage ? ("Bearer " + window.sessionStorage.getItem("token")) : ''
        }
      });
      if (res.status == 204 || res.status == 200) {
        setReload(true);
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
          setReload(false);
        }
      }
    }
  }

  return (
    <div className='flex-1 flex overflow-hidden flex-col space-y-5'>
      <div className="flex justify-end h-7">
        {
          (!handleAdd) ? <button className="rounded-lg  text-center h-full w-7 text-2xl md:text-xl  mr-4 mb-2 hover:text-blue-400" onClick={() => setHandleAdd(!handleAdd)}><AppstoreAddOutlined className="h-5/6 w-5/6 m-2" /></button> : <AddApplication setHandleAdd={setHandleAdd} setIsAdd={setIsAdd} />
        }
      </div>
      <div className="shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm px-2 text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                Titre
              </th>
              <th scope="col" className="px-4 py-3">
                Entreprise
              </th>
              <th scope="col" className="px-4 py-3">
                Adresse
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Type Contrat
              </th>
              <th scope="col" className="px-4 py-3">
                Date Création
              </th>
              <th scope="col" className="px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {
              response.data?.map((a: Props) => (
                <tr key={a._id} className={`border-b dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${a.Status == 'reject' ? 'bg-red-300' : 'bg-white'}`}>
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {a.Title}
                  </th>
                  <td className="px-4 py-4">
                    {a.Entreprise}
                  </td>
                  <td className="px-4 py-4">
                    {a.Adresse}
                  </td>
                  <td className="px-4 py-4">
                    {
                      showDetail ? <select onChange={(e) => {
                        setCurrentApp((state: Props) => {
                          return { ...a, Status: (e.target.value != a.Status) ? e.target.value : a.Status }
                        });
                      }}>
                        <option value={a.Status} selected>{a.Status}</option>
                        {Status.filter(s => s !== a.Status).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select> : <>{a.Status}</>
                    }
                  </td>
                  <td className="px-4 py-4">
                    {a.ContratType}
                  </td>
                  <td className="px-4 py-4">
                    {a.CreatedAt?.split('T')[0].split('-').reverse().join('/')}
                  </td>
                  <td className="px-4 py-4">
                    {(!showDetail) ?
                      <div className='flex space-x-2'>
                        <button className='text-blue w-1/3 text-xl' onClick={() => setShowDetail(state => !state)}><EditOutlined className="p-1 hover:rounded-md text-blue-400 hover:text-white hover:bg-blue-300 hover:shadow"/></button>
                        <button className='text-blue w-1/3 text-xl' onClick={()=>setViewDetail(state=>!state)}><ReadOutlined className="p-1 hover:rounded-md text-green-400 hover:text-white hover:bg-blue-500 hover:shadow"/></button>
                        <button className='w-1/3 text-cyan-300 text-xl' onClick={()=>HandleDelete(a)}><DeleteOutlined className="p-1 hover:shadow hover:rounded-md hover:bg-red-300 hover:text-white" /></button>
                      </div>
                      : <button onClick={SaveChange}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline">SaveChange</button>
                    }
                  </td>
                  {
                    viewDetail&&<ApplicationDetail application={a} setShowDetail={setViewDetail}/>
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
        {
          next && <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li onClick={() => setUrl(prev)}>
                <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
              </li>
              <li onClick={() => setUrl(next)}>
                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
              </li>
            </ul>
          </nav>
        }
      </div>
    </div>
  )
}
