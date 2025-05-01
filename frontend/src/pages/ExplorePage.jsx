import React, { use, useEffect, useState } from "react";
import {createRoot} from 'react-dom/client';
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow} from '@vis.gl/react-google-maps';
import { useOutletContext } from "react-router-dom";
import { userLogin } from "../Utilities/LoginPageUtils";
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY // api key for google maps
const mapId = import.meta.env.VITE_MAP_ID_V1 //ID for the map in google API 

// TO DO : set state variables for a business that was clicked to store that business info and use in the InfoWindow

const ExplorePage = () => {
  const position = { lat: 41.88167, lng: -87.62861 }
  const [open, setOpen] = useState(false)


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
              defaultCenter={ position }
              defaultZoom={12}
              mapId={mapId}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            />
            <AdvancedMarker 
            position={position}
            onClick={() => setOpen(true)}
            >
            </AdvancedMarker>
            {open && <InfoWindow position={position} onCloseClick={() => setOpen(false)}><span>Code Platoon HQ</span></InfoWindow>}
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
