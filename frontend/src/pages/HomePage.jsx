import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useLoaderData } from "react-router-dom";
import {grabLocID} from '../utilities/TripAdvisorUtils'
import sample from '../utilities/sampleObject.json'
import TripAdvisorComponent from "../components/tripAdvisorSearchComponent";

const HomePage = () => {
  const [logError, setLogError] = useState("");
  const [results,setResults] = useState(sample);

  console.log(results)

    useEffect(() => {
      const timeout = setTimeout(() => {
        setLogError("");
      }, 2000);
      return () => clearTimeout(timeout);
    }, [logError]);



  return (
    <>

    <h1>Home Page</h1>


    <button
    className="font-bold text-2xl text-fuchsia-700 border-2 bg-amber-300 pt-2 pb-2 m-2"
    onClick = {
      () => {
        grabLocID('National Museum of Mexican Art', 'attractions', setLogError, setResults, 3)
      }
    }
    >Click me and look to your console, WILL SUBMIT REQUEST TO TRIP ADVISOR FOR HOTEL IS SEOUL!</button>
    <br />
    {logError}
    <TripAdvisorComponent locinfo = {results.locinfo} />

    </>
  )
}

export default HomePage