import './App.css'
import './index.css'
import { NavComponent } from './components/Navbar';
import React, {useState} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
// https://beta.heroui.com/docs/guide/routing  ^^^

const App = () => {
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