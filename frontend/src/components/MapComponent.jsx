import React, { useContext } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { ExploreContext } from "../pages/ExplorePage";

// get mapId from .env
const mapId = import.meta.env.VITE_MAP_ID_V1;


const MapComponent = () => {
  const { coords, getPlaceDetails } = useContext(ExploreContext)
  const map = useMap() // have to create an instance of the map to be able to use PlacesServices


  return (
    <>
      <Map
        center={coords} // using the state var of lat/lng
        defaultZoom={12}
        mapId={mapId} // the styling id for the map
        gestureHandling={"cooperative"}
        disableDefaultUI={false}
        onClick={(e) => getPlaceDetails(e.detail, map)} // call func to get the clicked locations details
      />
    </>
  );
};
export default MapComponent;
