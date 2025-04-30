import { useState } from 'react'
import './App.css'
import './index.css'
import { HeroUIProvider } from "@heroui/react"; // ← Fix capitalization if correct
import { Outlet } from 'react-router-dom';
import { NavComponent } from './components/Navbar';
import React from 'react';
import { useNavigate, useHref } from 'react-router-dom';
// https://beta.heroui.com/docs/guide/routing  ^^^

const App = () => {
  const navigate = useNavigate()

  return (
    <>
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <NavComponent />
        <Outlet />
      <h1>City Scope</h1>
    </HeroUIProvider>
    </>
  );
};

export default App;
