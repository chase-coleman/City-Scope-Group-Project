import { Outlet, useNavigate, useHref } from 'react-router-dom';
import { use, useEffect, useState } from 'react'

import './App.css'
import './index.css'

import { NavComponent } from './components/NavbarComponent';

const App = () => {
  // google maps API key in the .env file
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  return (
    <>
      <NavComponent />
      <Outlet />
    </>
  );
};

export default App;
