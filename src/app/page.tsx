"use client"

import { Suspense } from "react"
import Login from "./login/page"

export default function Home() {
  return (
    <main className="flex h-full flex-col md:flex-row items-center justify-between">
      <Suspense>
        <Login/>
      </Suspense>
      <div>
        
      </div>
    </main>
  );
}
