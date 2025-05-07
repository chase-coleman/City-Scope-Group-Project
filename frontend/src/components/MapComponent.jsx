import React, { useContext, useEffect, useRef, useState } from "react";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { ExploreContext } from "../pages/ExplorePage";

// get mapId from .env
const mapId = import.meta.env.VITE_MAP_ID_V1;

const MapComponent = () => {
  const { coords, getPlaceDetails } = useContext(ExploreContext);
  const map = useMap();
  const mapRef = useRef(null);
  const previousCoordsRef = useRef(coords);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    if (coords) {
      map.setCenter(coords);
    }
  };

  // Reset recentering when coords change via autocomplete
  useEffect(() => {
    if (coords && 
        (!previousCoordsRef.current || 
        coords.lat !== previousCoordsRef.current.lat || 
        coords.lng !== previousCoordsRef.current.lng)) {
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
      </Map>
    </>
  );
};

export default MapComponent;