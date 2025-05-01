import React, { use, useEffect, useState } from "react";
import {createRoot} from 'react-dom/client';
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow} from '@vis.gl/react-google-maps';
import { useOutletContext } from "react-router-dom";
import { userLogin } from "../Utilities/LoginPageUtils";
import usePlacesAutocomplete, { getGeocode, getLatLng} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY // api key for google maps
const mapId = import.meta.env.VITE_MAP_ID_V1 //ID for the map in google API 

// TO DO : set state variables for a business that was clicked to store that business info and use in the InfoWindow



const ExplorePage = () => {
  const position = { lat: 41.88167, lng: -87.62861 }
  const [open, setOpen] = useState(false)

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When the user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });
  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };
  const handleSelect =
  ({ description }) =>
  () => {
    // When the user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      console.log("📍 Coordinates: ", { lat, lng });
    });
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <>
      <div className="explore-page-container  h-[calc(100vh-56px)] bg-red-500 flex">
        <div className="left-side bg-blue-500 w-[20%]">
          <h1>Filters</h1>
        </div>
        <div className="right-side flex flex-col items-center bg-pink-500 w-[80%]">
          <div className="map-container bg-purple-200 w-[75%] h-[75%]">
          <APIProvider apiKey={googleApiKey}>
          <h1>Map Component</h1>
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


export default ExplorePage;
