"use client"


import { Card} from "antd";
import Head from "next/head";
import {MailOutlined, PhoneOutlined } from "@ant-design/icons";
import backgroundImg from '../../public/background-img.jpeg';
import Image from "next/image";

export default function Home() {
  
  return (
    <main className="flex flex-1 items-center flex-col">
        <Image src={backgroundImg} className="absolute top-14 bottom-0 left-0 right-0 z-0 opacity-15" fill content="cover" alt="image de font"/>

        <div className="container mx-auto p-4 opacity-100 pt-6 z-10 pb-8"><Head><title>Applications Manager</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head> <h1 className="text-3xl  font-bold mb-8">Applications Manager</h1>

            <div className="flex flex-wrap flex-col  text-xl space-y-2">
                <p className="text-wrap text-justify h-full w-full p-2">Nous sommes enchantés de vous accueillir
                    sur
                    notre plateforme d&rsquo;enregistrement des candidatures. Chez <strong>Candidatura</strong>,
                    nous croyons en la force d&apos;une équipe diversifiée et passionnée.
                    Que vous soyez un professionnel chevronné ou un jeune talent plein de potentiel, nous sommes
                    impatients
                    de découvrir ce que vous pouvez apporter à notre équipe.</p>
                <div className="flex flex-col space-y-2">
                    <div className="flex space-x-3">
                        <MailOutlined/><span>teidaremi0@gmail.com</span>
                    </div>
                    <div className="flex space-x-3">
                        <PhoneOutlined/><span>0758703501</span>
                    </div>
                    &copy; 2024
                </div>
            </div>
        </div>
    </main>
  );
}
