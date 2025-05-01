import React, { use, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useOutletContext } from "react-router-dom";
import { userLogin } from "../Utilities/LoginPageUtils";
import usePlacesAuthocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import "../App.css";
import { formToJSON } from "axios";

// .env variables
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_MAP_ID_V1;

const ExplorePage = () => {
  const position = { lat: 41.88167, lng: -87.62861 };
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState(null);


  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);

    try {
      // geocoding api

      const results = await getGeocode(selectedAddress);
      console.log(results);
      const latLng = getLatLng(results[0]);

      const placesDetails = {
        name: results[0].formatted_address,
        formatted_address: results[0].formatted_address,
        place_id: results[0].place_id,
        geometry: {
          location: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
        },
      };

      setPlace(placesDetails);
    } catch (error) {}
  };

  return (
    <>
      <div className="explore-page-container  h-[calc(100vh-56px)] bg-red-500 flex">
        <div className="left-side bg-blue-500 w-[20%]">
          <h1>Filters</h1>
        </div>
        <div className="right-side flex flex-col items-center bg-pink-500 w-[80%]">
          <div className="map-container bg-purple-200 w-[75%] h-[75%]">
            <h1>Map Component</h1>
            <div className="autocomplete-container">
              <PlacesAutoComplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <input
                      {...getInputProps({
                        placeholder: "Enter a location",
                        className: "autocomplete-input",
                      })}
                    />
                    <div className="autocomplete-dropdown">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.place_id}
                          {...getSuggestionItemProps(suggestion)}
                          className="suggestion-item"
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutoComplete>
              {place && (
                <div className="place-info">
                  <h2>Address Details</h2>
                  <p>
                    <strong>Name:</strong> {place.name}
                  </p>
                  <p>
                    <strong>Formatted Address:</strong>{" "}
                    {place.formatted_address}
                  </p>
                  <p>
                    <strong>Place ID:</strong> {place.place_id}
                  </p>
                  <p>
                    <strong>Latitude:</strong> {place.geometry.location.lat}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {place.geometry.location.lng}
                  </p>
                </div>
              )}
            </div>

            <APIProvider apiKey={googleApiKey}>
              <Map
                defaultCenter={position}
                defaultZoom={12}
                mapId={mapId}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
              />
              <AdvancedMarker
                position={position}
                onClick={() => setOpen(true)}
              ></AdvancedMarker>
              {open && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setOpen(false)}
                >
                  <span>Code Platoon HQ</span>
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
