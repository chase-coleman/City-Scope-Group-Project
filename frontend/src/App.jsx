import React, { useEffect, useState } from 'react'
import './App.css'
import './index.css'
import { NavComponent } from './components/Navbar';
import { useNavigate, Outlet } from 'react-router-dom';
// https://beta.heroui.com/docs/guide/routing  ^^^

const App = () => {

  // google maps API key in the .env file
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const navigate = useNavigate()
  const [logError, setLogError] = useState("") 


  return (
    <>
       <NavComponent />
       <Outlet context={{setLogError}} />
       <h1>City Scope</h1>
    </>
  );
};
export default App;
