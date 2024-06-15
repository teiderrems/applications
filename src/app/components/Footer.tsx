import { ContactsOutlined, MailOutlined } from '@ant-design/icons'
import React from 'react'

export default function Footer() {
  return (
    <footer className='flex flex-col h-1/6 w-full container mx-2 border-t justify-self-end justify-center'>
      
        <h2 className='text-sm text-justify px-2'>&copy; Contact</h2>
        <h2 className=' text-sm text-justify px-2'><MailOutlined /> teiderrems0@gmail.com</h2>
        <h2 className=' text-sm text-justify px-2'><ContactsOutlined /> 0758703501</h2>
      
    </footer>
  )
}
