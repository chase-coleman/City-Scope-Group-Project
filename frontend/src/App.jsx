import { useEffect, useState } from 'react'
import './App.css'
import './index.css'
import { Outlet } from 'react-router-dom';
import { NavComponent } from './components/Navbar';
import React from 'react';
import { useNavigate, useHref } from 'react-router-dom';
// https://beta.heroui.com/docs/guide/routing  ^^^


const App = () => {
  const navigate = useNavigate()
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY


  useEffect(() => {
    console.log(googleApiKey)
  }, [])

  return (
    <>
       <NavComponent />
        <Outlet />
      <h1>City Scope</h1>
    </>
  );
};

export default App;
