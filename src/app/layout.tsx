import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./components/StoreProvider";
import Link from "next/link";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        {/* <head>
          <link rel="stylesheet" href="app/global.css"/>
        </head> */}
        <body className="flex min-h-screen">
          <div className="flex flex-col z-10 absolute top-100 sm:opacity-50 left-0 md:w-1/5 bg-white h-screen sm:w-1/2 md:static">
            <h1 className="text-3xl font-bold m-1 h-10">Applications</h1>
            <div className="flex-1 flex flex-col shadow">
            <SideBar/>
            </div>
            <Footer/>
            </div>
          <div className="flex-1 flex flex-col bg-slate-50 h-screen">
            <Header/>
            <div className="flex-1">
              {children}
            </div>
          </div>
        </body>
      </html>
    </StoreProvider>
  );
}
