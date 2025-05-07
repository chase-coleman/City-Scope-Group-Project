import React from 'react'
import { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useOutletContext } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import axios from 'axios';


export default function ManageAccount(isOpen) {

if(!isOpen) return null;
  return (


<div className="fixed inset-0 flex items-center justify-center bg-black/50">
<Card style={{ width: '30rem' }} className="relative flex flex-col h-[22rem] border border-gray-300 rounded-lg shadow-sm bg-white  transition-transform duration-300">
       <button
       variant="danger"
       className={
           `absolute right-1 top-0 bg-[#DA291C] hover:bg-red-700 hover:scale-110 text-white font-bold py-2 z-10 px-3 rounded shadow-md transition duration-300 `
       }
       onClick={() => setIsOpen(false)}
       >
            X 
            </button>
   
   <div className="relative w-full h-40">
   <Card.Img
   variant="top" src="https://en.wikipedia.org/wiki/Picturesque"
   className="w-full h-52 object-contain hover:cursor-pointer"
   onClick={handleImageClick}
   />
   <div className="absolute top-2 right-1/2 flex items-center justify-center">
   {loading?<LoadingSpinner/>:""}
   </div>
   </div>
       <input
       type="file"
       accept="image/*"
       ref={imageInputRef}
       onChange={handleChange}
       className="hidden"
     />
   <Card.Body className="flex flex-col justify-between flex-grow">
    <br />
   <Card.Title>
 <span className="text-sm font-semibold truncate overflow-hidden whitespace-nowrap block w-full">
 <span className="block break-words">Set's name:</span>

   <input
   type="text"
   className="border-2 border-black w-[95%]"
   value = {customName}
   onChange= {(e) => {
    setCustomName(e.target.value);
    setSetNum(`${randomAlphaNum()}-${e.target.value}`);
    // console.log(setNum)
    }}
        
   placeholder='Name of the custom set'
   >
   </input>

   <span className="block break-words">Number of parts:</span>

   <input
   type="number"
   min='0'
   className="border-2 border-black w-[35%]"
   value = {set_parts}
   onChange= {(e) => setSet_parts(e.target.value)}
   maxLength={5}
   >
   </input>
 </span>
</Card.Title>
   <Card.Text className="text-sm overflow-hidden">

</Card.Text>

    
     <Button 
     variant="primary"
     className={`w-auto text-sm ${!validForm?'disabled':""}`}
     onClick = {(() => {
       [buildCustom(), setShow(false), cleanup()]
       
     })}
     >

   {`${validForm?'Add to your pool!':'Incomplete info'}`}
   </Button>

   </Card.Body>
 </Card>
 </div>
  )
}
