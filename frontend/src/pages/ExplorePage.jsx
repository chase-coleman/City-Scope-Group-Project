import React, { use, useEffect, useState, createContext } from "react";
import { createRoot } from "react-dom/client";
import {
  APIProvider,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { useOutletContext } from "react-router-dom";
import { userLogin } from "../Utilities/LoginPageUtils";
import useOnclickOutside from "react-cool-onclickoutside";
import AutocompleteComponent from "../components/AutocompleteComponent";
import "../App.css";
import MapComponent from "../components/MapComponent";
import { getDetails } from "use-places-autocomplete";

// .env variables
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_MAP_ID_V1;

// setting context to pass to any component rendered on this page
// don't need to include function params when passing thru context
export const ExploreContext = createContext({
  address: "",
  setAddress: () => {},
  place: null,
  setPlace: () => {},
  lat: 0,
  lng: 0,
  getPlaceDetails: () => {}
});

const ExplorePage = () => {
  const [open, setOpen] = useState(false); // state var for viewing a pinned locations
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState(null);
  const [lat, setLat] = useState(41.88167); // default = Code Platoon
  const [lng, setLng] = useState(-87.62861); // default = Code Platoon
  const [placeDetails, setPlaceDetails] = useState([]);
  const [mapInst, setMapInst] = useState(null)


  useEffect(() => {
    if (!place) return;
    updateMapLocation();
  }, [place]); // might have to change this to watch lat/lng states instead

  // update the center location of the map
  const updateMapLocation = () => {
    setLat(place.geometry.location.lat);
    setLng(place.geometry.location.lng);
  };

  useEffect(() => {
    if (placeDetails.length > 0){
    console.log(placeDetails)
    }
  }, [placeDetails])

  const getPlaceDetails = (e, map) => {
    const placeId = e.placeId;
    // console.log(placeId, map)
  
    const service = new window.google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: placeId,
        fields: ["address_components", "formatted_address", "geometry", "name", "photo", "url", "website"],
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(result)
          // setPlaceDetails(result); // This sets the details of the place
        } else {
          console.error("Error fetching details", status); // Handle error
        }
      }
    );
  };

  return (
    <>
      <div className="explore-page-container  h-[calc(100vh-56px)] bg-red-500 flex">
        <div className="left-side bg-blue-500 w-[20%]">
          <h1>Filters</h1>
        </div>
        <div className="right-side flex flex-col items-center bg-pink-500 w-[80%]">
          <div className="map-container bg-purple-200 w-[75%] h-[75%]">
            <APIProvider apiKey={googleApiKey}>
            <ExploreContext.Provider
              value={{ address, setAddress, place, setPlace, lat, lng, getPlaceDetails }}
            >
              <AutocompleteComponent />
              <MapComponent />
            </ExploreContext.Provider>
              <AdvancedMarker
                position={{ lat: lat, lng: lng }}
                onClick={() => setOpen(true)}
              ></AdvancedMarker>
              {open && (
                <InfoWindow
                  position={{ lat: lat, lng: lng }}
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
