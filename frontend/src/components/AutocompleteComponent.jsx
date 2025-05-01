import React, { use, useEffect, useState, useContext } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "../App.css";
import { ExploreContext } from "../pages/ExplorePage";

// https://www.youtube.com/watch?v=HslRpRQcH5M

const AutocompleteComponent = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const { address, setAddress, place, setPlace } = useContext(ExploreContext)

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
      <div className="autocomplete-container">
        <div className="autocomplete-container">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            placeholder="Enter a location"
          />
          <div className="autocomplete-dropdown">
            {status === "OK" &&
              data.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSelect(suggestion.description)}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </div>
              ))}
          </div>
        </div>

        {place && (
          <div className="place-info">
            <h2>Address Details</h2>
            <p>
              <strong>Name:</strong> {place.name}
            </p>
            <p>
              <strong>Formatted Address:</strong> {place.formatted_address}
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
    </>
  );
};

export default AutocompleteComponent;
