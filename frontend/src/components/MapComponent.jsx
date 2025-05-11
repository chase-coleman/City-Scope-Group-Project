import React, { useContext, useEffect, useRef, useState } from "react";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
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


  // calls the getNearby function that will return locations matching the filters
  useEffect(() => {
    if (selectedFilters.length < 1) return;
    selectedFilters.forEach((filter) => {
      if (filter.name === "Hotels") {
        getNearbyHotels()
      } else if (filter.name === "Attractions") {
        getNearbyAttraction()
      } else {
        getNearbyRestaurants()
      }
    });
  }, [selectedFilters]);

  const restaurantCallback = (result, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      setRestaurants(result)
    }
  };
  const attractionCallback = (result, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      setAttractions(result)
    }
  }
  const hotelCallback = (result, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      setHotels(result)
    }
  }


  const getNearbyRestaurants = () => {
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: coords,
      radius: 1000,
      type: "restaurant",
    };
    service.nearbySearch(request, restaurantCallback);
  };

  const getNearbyAttraction = () => {
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: coords,
      radius: 1000,
      type: "attraction",
    };
    service.nearbySearch(request, attractionCallback);
  };

  const getNearbyHotels = () => {
    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: coords,
      radius: 1000,
      type: "lodging",
    };
    service.nearbySearch(request, hotelCallback);
  };
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
        onClick={(e) => getPlaceDetails(e.detail, map)} // Using map from useMap() here
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
          }}/>
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
          onClick={() => setPlaceDetails(loc)}
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
          }}/>
        ))
        : null
        }
      </Map>
    </>
  );
};

export default MapComponent;
