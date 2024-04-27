"use client"
import { AppstoreAddOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react"
import AddApplication from "../components/AddApplication";
import { useGetApplicationsQuery } from "@/lib/features/applications";
import ApplicationItem from "../components/ApplicationItem";

export default function Application() {
  const [handleAdd,setHandleAdd]=useState(false);
  const [page,setPage]=useState(0);
  const [limit,setLimit]=useState(10);
  const {data,isError,isLoading,isSuccess,error}=useGetApplicationsQuery({page,limit});
 
  useEffect(()=>{

  },[limit,page])

  if (isError) {
    <div className="flex justify-center items-center">
        <pre>{JSON.stringify(data)}</pre>
    </div>
  }
  
  return (
    <div className='container mx-auto flex-1 flex flex-col'>
      <div className="flex justify-end h-7">
      {
        (!handleAdd)?<button className="rounded-lg hover:bg-blue-500 text-center h-full w-7 mr-2 hover:text-white" onClick={()=>setHandleAdd(!handleAdd)}><AppstoreAddOutlined className="h-5/6 w-5/6"/></button>:<AddApplication setHandleAdd={setHandleAdd}/>
      }
      </div>
      <section className="flex flex-col flex-1">
        <div className="flex-1 mx-4 grid md:grid-cols-4 gap-3 grid-cols-1">
          {
            data?.map(a=>(<ApplicationItem key={a._id} application={a}/>))
          }
        </div>
        <div className="flex justify-end mb-1 mr-2 space-x-3  items-end basis-1"><button onClick={()=>setPage(page-1)} className="flex hover:bg-blue-400 space-x-1 px-1 items-center justify-center shadow rounded-md"><ArrowLeftOutlined /><span>prev</span></button><button onClick={()=>setPage(page+1)} className="flex hover:bg-blue-400  px-1 items-center space-x-1 shadow justify-center rounded-md"><span>next</span><ArrowRightOutlined /></button></div>
      </section>
    </div>
  )
}
