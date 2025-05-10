import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useLoaderData } from "react-router-dom";
import {grabLocID} from '../utilities/TripAdvisorUtils'
import sample from '../utilities/sampleObject.json'
import TripAdvisorComponent from "../components/tripAdvisorSearchComponent";

const HomePage = () => {
  const [logError, setLogError] = useState("");
  const [results,setResults] = useState([]);


    useEffect(() => {
      const timeout = setTimeout(() => {
        setLogError("");
      }, 2000);
      return () => clearTimeout(timeout);
    }, [logError]);



  return (
    <>

    <h1>Home Page</h1>

    </>
  )
}

export default HomePage