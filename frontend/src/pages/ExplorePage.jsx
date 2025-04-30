import React, { use, useEffect } from "react";
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import { useOutletContext } from "react-router-dom";
import { userLogin } from "../Utilities/LoginPageUtils";
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY


const ExplorePage = () => {


  return (
    <>
      <div className="explore-page-container  h-[calc(100vh-56px)] bg-red-500 flex">
        <div className="left-side bg-blue-500 w-[20%]">
          <h1>Filters</h1>
        </div>
        <div className="right-side flex flex-col items-center bg-pink-500 w-[80%]">
          <h1>Map Component</h1>
          <div className="map-container bg-purple-200 w-[75%] h-[75%]">
          <APIProvider apiKey={googleApiKey}>
            <Map
              defaultCenter={{ lat: 22.54992, lng: 0 }}
              defaultZoom={3}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            />
          </APIProvider>
          </div>
        </div>
      </div>
    </>
  );
};

<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=places&callback=initMap">
</script>
export default ExplorePage;
