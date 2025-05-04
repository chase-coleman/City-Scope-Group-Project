import React, { useContext } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { ExploreContext } from "../pages/ExplorePage";

const mapId = import.meta.env.VITE_MAP_ID_V1;


const MapComponent = () => {
  const { lat, lng, getPlaceDetails } = useContext(ExploreContext)
  const map = useMap()


  return (
    <>
      <Map
        center={{ lat: lat, lng: lng }}
        defaultZoom={12}
        mapId={mapId}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={(e) => getPlaceDetails(e.detail, map)}
      />
    </>
  );
};
export default MapComponent;
