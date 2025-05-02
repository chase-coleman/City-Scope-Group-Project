import React, { use, useEffect, useState, createContext } from "react";
import { createRoot } from "react-dom/client";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, } from "@vis.gl/react-google-maps";
import { useOutletContext } from "react-router-dom";
import { userLogin } from "../Utilities/LoginPageUtils";
import useOnclickOutside from "react-cool-onclickoutside";
import "../App.css";
import AutocompleteComponent from "../components/AutocompleteComponent";

// .env variables
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_MAP_ID_V1;

// setting context to pass to any component rendered on this page
export const ExploreContext = createContext({
  address: "",
  setAddress: () => {},
  place: null,
  setPlace: () => {},
});


const ExplorePage = () => {
  const [open, setOpen] = useState(false); // state var for viewing a pinned locations
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState(null);
  const [lat, setLat] = useState(41.88167) // default = Code Platoon
  const [lng, setLng] = useState(-87.62861) // default = Code Platoon

  useEffect(() => {
    if (!place) return;
    updateMapLocation()
  }, [place]) // might have to change this to watch lat/lng states instead

  // update the center location of the map
  const updateMapLocation =() => {
    setLat(place.geometry.location.lat);
    setLng(place.geometry.location.lng);
  };


  return (
    <>
      <div className="explore-page-container  h-[calc(100vh-56px)] bg-red-500 flex">
        <div className="left-side bg-blue-500 w-[20%]">
          <h1>Filters</h1>
        </div>
        <div className="right-side flex flex-col items-center bg-pink-500 w-[80%]">
          <div className="map-container bg-purple-200 w-[75%] h-[75%]">
            <ExploreContext.Provider
              value={{ address, setAddress, place, setPlace }}
            >
              <AutocompleteComponent />
            </ExploreContext.Provider>
            <APIProvider apiKey={googleApiKey}>
              <Map
                center={{"lat": lat, "lng": lng}}
                defaultZoom={12}
                mapId={mapId}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
              />
              <AdvancedMarker
                position={{"lat": lat, "lng": lng}}
                onClick={() => setOpen(true)}
              ></AdvancedMarker>
              {open && (
                <InfoWindow
                  position={{"lat": lat, "lng": lng}}
                  onCloseClick={() => setOpen(false)}
                >
                  <span>{place.name}</span>
                </InfoWindow>
              )}
            </APIProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;

// docs for available filters :
// https://developers.google.com/maps/documentation/javascript/place-autocomplete