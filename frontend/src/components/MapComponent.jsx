import React, { useContext, useEffect, useRef } from "react";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { ExploreContext } from "../pages/ExplorePage";

// get mapId from .env
const mapId = import.meta.env.VITE_MAP_ID_V1;

const MapComponent = () => {
  const { coords, getPlaceDetails } = useContext(ExploreContext);
  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    if (coords) {
      map.setCenter(coords); // Set the initial center
    }
  };

  useEffect(() => {
    if (mapRef.current && coords) {
      mapRef.current.setCenter(coords); // Update the map center when coords change
    }
  }, [coords]);

  return (
    <div className="h-[100%] w-[100%]">
      <Map
        defaultCenter={coords || { lat: 0, lng: 0 }} // Initial center
        defaultZoom={12} // Set initial zoom level
        mapId={mapId} // the styling id for the map
        gestureHandling={"greedy"}
        options={{ draggable: true }}
        disableDefaultUI={false}
        onLoad={handleMapLoad}
        onClick={(e) => getPlaceDetails(e.detail, mapRef.current)} // Get clicked location details
      >
        <AdvancedMarker position={coords} />
      </Map>
    </div>
  );
};

export default MapComponent;