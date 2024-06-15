"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [token,setToken]=useState<string>();
  useEffect(()=>{
    setToken(sessionStorage.getItem("token") as string);
  },[token])
  return (
    <main className="flex h-full container mx-auto flex-col">
      <p className="text-wrap text-sm text-justify h-full w-full p-2">Nous sommes enchantés de vous accueillir sur notre plateforme d&rsquo;enregistrement des candidatures. Chez <strong>Candidatura</strong>,
       nous croyons en la force d&apos;une équipe diversifiée et passionnée. 
        Que vous soyez un professionnel chevronné ou un jeune talent plein de potentiel, nous sommes impatients de découvrir ce que vous pouvez apporter à notre équipe.</p>
    </main>
  );
}
