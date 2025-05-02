import { Outlet, useNavigate, useHref, useLoaderData } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { confirmUser } from './Utilities/LoginPageUtils';
import './App.css'
import './index.css'

// google maps API key in the .env file
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
import { NavbarComponent } from './components/NavbarComponent';

const App = () => {


  const navigate = useNavigate()
  const [logError, setLogError] = useState("") 
  const [user, setUser] = useState(useLoaderData()['username']);

  useEffect(() => {
    setLogError("");
  }, [location.pathname]);


  useEffect(() => {
    const checkuser = async () => {
      const data = await confirmUser()
      setUser(data)
    }
    
    checkuser()
    if (user == false) {
    }
    // console.log(user)
    },[location.pathname]);
  return (
    <>
      <NavbarComponent user = {user}/>
      <Outlet context = {{setLogError, user, setUser}} />
    </>
  );
};
export default App;
