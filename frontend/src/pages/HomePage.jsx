import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useLoaderData } from "react-router-dom";
import {grabLocID} from '../Utilities/TripAdvisorUtils'
import sample from '../Utilities/sampleObject.json'
import TripAdvisorComponent from "../components/tripAdvisorSearchComponent";

const HomePage = () => {
  const [logError, setLogError] = useState("");
  const [results,setResults] = useState(sample)
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
    onClick = {
      () => {
        grabLocID('tokyo', 'japan', 'hotels', setLogError)
      }
    }
    >click me and look to your console</button>
    <br />
    {logError}
    <TripAdvisorComponent locinfo = {results.locinfo} />

    </>
  )
}

export default HomePage