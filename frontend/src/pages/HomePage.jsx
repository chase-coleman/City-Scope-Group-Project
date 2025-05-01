import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useLoaderData } from "react-router-dom";
import {grabLocID} from '../Utilities/TripAdvisorUtils'

const HomePage = () => {

  return (
    <>

    <h1>Home Page</h1>
    {/* <button
    onClick = {
      () => {
        grabLocID('japan', 'tokyo', 'hotels')
      }
    }
    >click me</button> */}
    </>
  )
}

export default HomePage