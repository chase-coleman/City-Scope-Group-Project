import { useState } from 'react'
import './App.css'
import { heroUIProvider } from "@heroui/react"
import { Outlet } from 'react-router-dom';

const App = () => {

  return (
    <>
    <Outlet />
    <h1>City Scope</h1>
    </>
  );
};

export default App;
