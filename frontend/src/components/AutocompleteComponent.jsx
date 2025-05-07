import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import React, { use, useEffect, useState, useContext } from "react";
import { ExploreContext } from "../pages/ExplorePage";
import "../App.css";

// https://www.youtube.com/watch?v=HslRpRQcH5M

// this component is used for the autocomplete portion on the explore page
export const AutocompleteComponent = () => {
  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete();
  const { address, setAddress, place, setPlace } = useContext(ExploreContext)


  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = async (selectedAddress) => {
    // set address state to obj of selected location
    setAddress(selectedAddress);
    clearSuggestions();
    try {
      // call the geoCode function from google maps to get a bunch of info from the selected
      // address that we need to get the latitute/longitude
      const results = await getGeocode({"address": selectedAddress.description});

      // call the getLatLng function from google maps so we can change the map's view to that lat/long 
      // (the selected location)
      const latLng = getLatLng(results[0]);

      // create an object from the results of getLatLng
      const placesDetails = {
        name: selectedAddress.description.split(",")[0],
        address: results[0].formatted_address,
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
      setValue('')
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      <div className="autocomplete-container p-0">
        <div className="autocomplete-container">
          {/* search input box */}
          <input
            className="autocomplete-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            placeholder="Enter a location"
          />
          {/* search results */}
          <div className="autocomplete-dropdown">
            {status === "OK" &&
              data.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSelect(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};


// this component is used for the autocomplete portion on the trip creation page
export const AutocompleteTripComponent = ({ setNewTripData }) => {
  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete();


  const handleSelect = async (selectedAddress) => {
    setValue(selectedAddress.description, false) // false stops any other fetches
    setNewTripData(prev => ({...prev, location: selectedAddress.description}))
    clearSuggestions();
  };


  return (
    <>
      <div className="autocompletetrip-container p-0">
        <div className="autocompletetrip-container">
          {/* search input box */}
          <input
            className="autocompletetrip-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            placeholder="Enter a location"
          />
          {/* search results */}
          <div className="autocompletetrip-dropdown">
            {status === "OK" &&
              data.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSelect(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};