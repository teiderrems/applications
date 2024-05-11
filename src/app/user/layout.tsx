import React from "react";

export default function layout({children}: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="flex-1 flex flex-col justify-center">
        {children}
    </div>
  )
}
