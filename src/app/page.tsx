"use client"

import { useEffect, useState } from "react";
import {Button, Card} from "antd";
import Head from "next/head";
import {MailOutlined, PhoneOutlined } from "@ant-design/icons";

export default function Home() {
  const [token,setToken]=useState<string>();
  useEffect(()=>{
    setToken(sessionStorage.getItem("token") as string);
  },[token])
  return (
    <main className="flex h-full container mx-auto flex-col">

        <div className="container mx-auto p-4 pt-6 pb-8"><Head><title>Applications Manager</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head> <h1 className="text-3xl font-bold mb-8">Applications Manager</h1>

            <div className="flex flex-wrap flex-col space-y-2">
                <p className="text-wrap text-sm text-justify h-full w-full p-2">Nous sommes enchantés de vous accueillir
                    sur
                    notre plateforme d&rsquo;enregistrement des candidatures. Chez <strong>Candidatura</strong>,
                    nous croyons en la force d&apos;une équipe diversifiée et passionnée.
                    Que vous soyez un professionnel chevronné ou un jeune talent plein de potentiel, nous sommes
                    impatients
                    de découvrir ce que vous pouvez apporter à notre équipe.</p>
                <div className="flex justify-center space-x-10">
                    <Button type="link" size="large" href="/login" className=" font-bold border border-gray-300 hover:bg-blue-500 hover:text-white">Sign In </Button>
                    <Button type="link" size="large" href="/register" className="font-bold border border-gray-300 hover:bg-blue-500 hover:text-white">Sign Up </Button>
                </div>
            </div>
        </div>
        <Card title="Contact" className="flex flex-col space-y-2">
            <div className="flex space-x-3">
                <MailOutlined/><span>teidaremi0@gmail.com</span>
            </div>
            <div className="flex space-x-3">
                <PhoneOutlined/><span>0758703501</span>
            </div>
            &copy; 2024

        </Card>
    </main>
  );
}
