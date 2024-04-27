"use client"
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useState } from "react"
import AddApplication from "../components/AddApplication";

export default function Application() {
  const [handleAdd,setHandleAdd]=useState(false);
  return (
    <div className='container mx-auto flex-1 flex flex-col'>
      <div className="flex justify-end h-7">
      {
        (!handleAdd)?<button className="rounded-lg hover:bg-blue-500 text-center h-full w-7 hover:text-white" onClick={()=>setHandleAdd(!handleAdd)}><AppstoreAddOutlined className="h-5/6 w-5/6"/></button>:<AddApplication setHandleAdd={setHandleAdd}/>
      }
      </div>
      <section></section>
    </div>
  )
}
