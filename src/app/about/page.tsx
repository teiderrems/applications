"use client"
import React, { useState } from 'react'

export default function About() {

  const [text,setText]=useState<Array<{key:string,content:string}>>([{key:"en",content:`Welcome to our dedicated application for organizing your professional future! 
    Here, we understand the importance of each step in your journey. 
    Whether you are seeking an apprenticeship or an internship, our application is designed to help you keep track of all your applications.
    With our app, you can easily record and manage your applications, ensuring you never 
    miss an opportunity. Start transforming your search into a stress-free experience today!`},
  {
    key:"fr",
    content:`Bienvenue sur notre application dédiée à l&apos;organisation de votre avenir professionnel !
    Ici, nous comprenons l&apos;importance de chaque étape de votre parcours.
     Que vous soyez à la recherche d&apos;une alternance ou d&apos;un stage, notre application est conçue pour vous aider à garder une trace de toutes vos candidatures.
     Avec notre application, vous pouvez facilement historiser et gérer vos candidatures, vous assurant ainsi de ne jamais manquer une opportunité.
    Commencez dès aujourd&apos;hui à transformer votre recherche en une expérience sans stress !`}]);
  return (
    <div className='flex flex-col items-center flex-1 h-full w-full justify-center bg-gray-500'>
        <p className='md:w-5/6 w-full h-full p-2  md:h-5/6 bg-white rounded-md text-wrap text-justify'>
        {/* Bienvenue sur notre application dédiée à l&apos;organisation de votre avenir professionnel !
         Ici, nous comprenons l&apos;importance de chaque étape de votre parcours.
          Que vous soyez à la recherche d&apos;une alternance ou d&apos;un stage, notre application est conçue pour vous aider à garder une trace de toutes vos candidatures.
          Avec notre application, vous pouvez facilement historiser et gérer vos candidatures, vous assurant ainsi de ne jamais manquer une opportunité.
         Commencez dès aujourd&apos;hui à transformer votre recherche en une expérience sans stress ! */}
        
          {text[0].content}
        </p>
    </div>
  )
}
