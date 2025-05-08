import { Outlet, useNavigate, useHref, useLoaderData } from 'react-router-dom';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { NavbarComponent } from './components/NavbarComponent';
import { confirmUser } from './utilities/LoginPageUtils';
import sample from './utilities/sampleObject.json'
import { useEffect, useState } from 'react'
import axios from 'axios';
import './index.css'
import './App.css'
// google maps API key in the .env file
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const token = localStorage.getItem("token");

const App = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState(sample)
  const [logError, setLogError] = useState("") 
  const [user, setUser] = useState(useLoaderData()['username']);
  const [userTrips, setUserTrips] = useState([])

  useEffect(() => {
    setLogError("");
  }, [location.pathname]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/trip/", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setUserTrips(response.data);
      // setLoading(false); // end loading on success
    } catch (err) {
      console.error("Error fetching trips:", err);
      // setError("Unable to load trips.");
      // setLoading(false); // end loading on error
    }
  };

  useEffect(() => {
    const checkuser = async () => {
      const data = await confirmUser()
      setUser(data)
      fetchTrips()
    }
    
    checkuser()
    if (user == false) {
    }
    // console.log(user)
    },[location.pathname]);
  return (
    <>
      <PrimeReactProvider>
      <NavbarComponent user = {user} setUser= {setUser}/>
      <Outlet context = {{setLogError, user, setUser, userTrips, fetchTrips, results, setResults}} />
      </PrimeReactProvider>
    </>
  );
};
export default App;
