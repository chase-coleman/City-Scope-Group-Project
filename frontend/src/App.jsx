import { useState } from 'react'
import './App.css'
import { HeroUIProvider } from "@heroui/react"; // ← Fix capitalization if correct
import { Outlet } from 'react-router-dom';

const App = () => {

  return (
    <>
    <HeroUIProvider>
    <Outlet />
    </HeroUIProvider>
    </>
  );
};

export default App;
