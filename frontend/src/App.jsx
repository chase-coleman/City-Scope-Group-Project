<<<<<<<<< Temporary merge branch 1
import { use, useEffect, useState } from 'react'
=========
>>>>>>>>> Temporary merge branch 2
import './App.css'
import './index.css'
import { NavComponent } from './components/Navbar';
import React, {useState} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
// https://beta.heroui.com/docs/guide/routing  ^^^

const App = () => {
<<<<<<<<< Temporary merge branch 1
  // google maps API key in the .env file
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
=========
  const navigate = useNavigate()
  const [logError, setLogError] = useState("") 
>>>>>>>>> Temporary merge branch 2

  return (
    <>
       <NavComponent />
       <Outlet context={{setLogError}} />
       <h1>City Scope</h1>
    </>
  );
};
export default App;