import { createCallback, createNearbySearch } from "../utilities/ExplorePageUtils";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ExploreContext } from "../pages/ExplorePage";


// get mapId from .env
const mapId = import.meta.env.VITE_MAP_ID_V1;

const MapComponent = ({ setRestaurants, setHotels, setAttractions }) => {
  const { coords, getPlaceDetails, setPlaceDetails, selectedFilters, restaurants, hotels, attractions } =
    useContext(ExploreContext);
  const map = useMap();
  const mapRef = useRef(null);
  const previousCoordsRef = useRef(coords);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    if (coords) {
      map.setCenter(coords);
    }
  };

  // using a high-order function in the ExplorePageUtils file to avoid repeating
  const restaurantCallback = createCallback(setRestaurants)
  const attractionCallback = createCallback(setAttractions)
  const hotelCallback = createCallback(setHotels)

    // using a high-order function in the ExplorePageUtils file to avoid repeating
  const getNearbyRestaurants = createNearbySearch("restaurant", restaurantCallback, coords, map)
  const getNearbyAttraction = createNearbySearch("tourist_attraction", attractionCallback, coords, map)
  const getNearbyHotels = createNearbySearch("lodging", hotelCallback, coords, map)
  
  // obj to map the selectedFilters to (to avoid if/else statements)
  const FILTER_ACTIONS = {
    Hotels: getNearbyHotels,
    Attractions: getNearbyAttraction,
    Restaurants: getNearbyRestaurants
  };

  // calls the correct function that will return locations matching the filters
  useEffect(() => {
    if (selectedFilters.length < 1) return;
    
    // action is = to the value of FILTER_ACTIONS[filter.name]
    // meaning the variable action holds a function
    selectedFilters.forEach((filter) => {
      const action = FILTER_ACTIONS[filter.name]
      action() // calling the function
  });
  }, [selectedFilters]);

  useEffect(() => {
    console.log(attractions)
  }, [attractions])

  // Reset recentering when coords change via autocomplete
  useEffect(() => {
    if (
      coords &&
      (!previousCoordsRef.current ||
        coords.lat !== previousCoordsRef.current.lat ||
        coords.lng !== previousCoordsRef.current.lng)
    ) {
      previousCoordsRef.current = coords;
    }
  }, [coords]);

  // Apply the center change when needed
  useEffect(() => {
    if (mapRef.current && coords) {
      mapRef.current.setCenter(coords);
    }
  }, [coords]);

  return (
    <>
      <Map
        // unique key per coord change forces the map component to re-render
        key={`${coords?.lat ?? 0}-${coords?.lng ?? 0}`}
        defaultCenter={coords || { lat: 0, lng: 0 }}
        defaultZoom={12}
        mapId={mapId}
        gestureHandling={"greedy"}
        options={{ draggable: true }}
        disableDefaultUI={false}
        onLoad={handleMapLoad}
        onClick={(e) => getPlaceDetails(e.detail.placeId, e.detail.latLng.lat, e.detail.latLng.lng, map)} // Using map from useMap() here
      >
        {coords && <AdvancedMarker position={coords} />}

        {/* Creating Pins for each attraction that is matching the filter */}
        {attractions.length > 0 ? 
        attractions.map((loc) => (
          <AdvancedMarker 
          key={loc.place_id}
          position={{
            lat: loc.geometry.location.lat(),
            lng: loc.geometry.location.lng()
          }}
          // onClick handler that will display the selected location's info in the LocationCard on the ExplorePage
          onClick={() => getPlaceDetails(loc.place_id, loc.geometry.location.lat(), loc.geometry.location.lng(), map)}
          />
        ))
        : null
        }
        {/* Creating Pins for each hotel that is matching the filter */}
        {hotels.length > 0 ? 
        hotels.map((loc) => (
          <AdvancedMarker 
          key={loc.place_id}
          position={{
            lat: loc.geometry.location.lat(),
            lng: loc.geometry.location.lng()
          }}
          // onClick handler that will display the selected location's info in the LocationCard on the ExplorePage
          onClick={() => getPlaceDetails(loc.place_id, loc.geometry.location.lat(), loc.geometry.location.lng(), map)}
          />
        ))
        : null
        }
        {/* Creating Pins for each restaurant that is matching the filter */}
        {restaurants.length > 0 ? 
        restaurants.map((loc) => (
          <AdvancedMarker 
          key={loc.place_id}
          position={{
            lat: loc.geometry.location.lat(),
            lng: loc.geometry.location.lng()
          }}
          // onClick handler that will display the selected location's info in the LocationCard on the ExplorePage
          onClick={() => getPlaceDetails(loc.place_id, loc.geometry.location.lat(), loc.geometry.location.lng(), map)}
          />
        ))
        : null
        }
      </Map>
    </>
  );
};

export default MapComponent;
