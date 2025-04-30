import { Outlet, useNavigate, useHref } from 'react-router-dom';
import { useEffect, useState } from 'react'

import './App.css'
import './index.css'

import { NavbarComponent } from './components/NavbarComponent';

const App = () => {
  // google maps API key in the .env file
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  return (
    <>
      <NavbarComponent />
      <Outlet />
    </>
  );
};

export default App;
