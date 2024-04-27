"use client"
import { AppstoreAddOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
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
      <section className="flex flex-col flex-1">
        <div className="flex-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quo non reprehenderit quod laudantium consequatur optio officiis cum quia nobis, dolorum voluptatibus enim at nisi nihil obcaecati eligendi natus alias.
        Aut ipsam quam minus similique autem iure rem deleniti fugit. Dolorem libero eaque, voluptatum sint corrupti totam et ea ullam voluptates laudantium error placeat tenetur consectetur quam ex tempora laborum.
        Animi blanditiis accusamus vitae aliquid aspernatur. Non aliquam fuga culpa, fugiat odio eos sed quaerat eveniet nemo, optio similique sapiente maxime quos! Dolorem saepe quia distinctio doloribus cum nobis itaque!
        Animi, expedita. Assumenda, quibusdam cum ipsum tempora cupiditate fugit sequi quasi eaque quas voluptatum distinctio culpa deserunt accusamus vero, commodi nesciunt! Debitis enim sunt reprehenderit ipsa, ea voluptatibus quis quaerat.
        Totam tempore non pariatur soluta voluptates recusandae, saepe facilis laudantium aliquid minus, laborum dolores cumque qui fuga suscipit, exercitationem nulla aperiam voluptas beatae doloremque officia nam iusto architecto cupiditate. Modi?
        Est, cum eaque. Minus magni natus quidem a quae voluptas, dicta beatae reprehenderit alias dolore inventore voluptatum cupiditate sint laudantium illum maiores. Nemo ipsa delectus hic vitae fugiat debitis natus.
        Ad ut libero voluptas maxime perferendis dolor molestias totam. Animi debitis culpa nihil aperiam temporibus iure illo itaque sed nemo laudantium consectetur voluptatem ipsa quod fugiat aut beatae, iste ea.
        Nihil expedita illo ea voluptatum voluptatibus labore ipsa vel non, tempora, deleniti rerum et odit aut aliquam blanditiis delectus repudiandae. Rerum obcaecati impedit consequatur nisi non quis iste, magni autem.
        </div>
        <div className="flex justify-end mb-1 space-x-3  items-end basis-1"><button className="flex hover:bg-blue-400 space-x-1 px-1 items-center justify-center shadow rounded-md"><ArrowLeftOutlined /><span>prev</span></button><button className="flex hover:bg-blue-400  px-1 items-center space-x-1 shadow justify-center rounded-md"><span>next</span><ArrowRightOutlined /></button></div>
      </section>
    </div>
  )
}
