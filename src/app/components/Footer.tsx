import { ContactsOutlined, MailOutlined } from '@ant-design/icons'
import React from 'react'

export default function Footer() {
  return (
    <footer className='flex flex-col h-1/6 w-full container mx-2 border-t justify-self-end justify-center'>
      
        <h2 className='text-sm text-justify px-2'>&copy; 2024</h2>
        <h2 className=' text-sm text-justify px-2'><MailOutlined /> example@yahoo.fr</h2>
        <h2 className=' text-sm text-justify px-2'><ContactsOutlined /> 078563234</h2>
      
    </footer>
  )
}
