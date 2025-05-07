import { handleViewOnGoogle, handleViewWebsite, onCategoryChange } from "../Utilities/ExplorePageUtils";
import React, { useEffect, useState, createContext, useContext } from "react";
import { AutocompleteComponent } from "../components/AutocompleteComponent";
import { APIProvider, AdvancedMarker } from "@vis.gl/react-google-maps";
import { grabLocID } from "../Utilities/TripAdvisorUtils";
import { userLogin } from "../Utilities/LoginPageUtils";
import MapComponent from "../components/MapComponent";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { Checkbox } from "primereact/checkbox";
import { ExternalLink } from "lucide-react";
import "../App.css";

// .env variables
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// logged in user's token
const token = localStorage.getItem("token");
// get mapId from .env
const mapId = import.meta.env.VITE_MAP_ID_V1;

// setting context to pass to any component rendered on this page
// don't need to include function params when passing thru context
export const ExploreContext = createContext({
  address: "",
  setAddress: () => {},
  place: null,
  setPlace: () => {},
  coords: { lat: 0, lng: 0 },
  getPlaceDetails: () => {},
  handleViewOnGoogle: () => {},
  handleViewWebsite: () => {},
});

export const ExplorePage = () => {
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState("");
  const [coords, setCoords] = useState({ lat: 41.88167, lng: -87.62861 }); // default = Code Platoon
  const [placeDetails, setPlaceDetails] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const { trip_id } = useParams()
  const categoryFilters = [
    { name: "Restaurants", key: "R" },
    { name: "Attractions", key: "A" },
    { name: "Hotels", key: "H" },
  ];

  useEffect(() => {
    if (!place) return;
    updateMapLocation();
  }, [place]); // might have to change this to watch lat/lng states instead


  // update the center location of the map
  const updateMapLocation = () => {
    setCoords({
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    });
  };

  const getPlaceDetails = (e, map) => {
    const placeId = e.placeId;

    if (!map) {
      console.warn("PlacesService container is null");
      return;
    }
    // using 'map' as an instance of google.maps.Map as
    // a link to PlacesServices to display it on the map
    // the google.maps.places.PlacesService is a JS class
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: placeId,
        fields: [
          "address_components",
          "formatted_address",
          "formatted_phone_number",
          "name",
          "photo",
          "url",
          "reviews",
          "types",
          "website",
        ],
      },
      (result, status) => {
        // if PlacesService class returns a valid value
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          result["geometry"] = { lat: e.latLng.lat, lng: e.latLng.lng };
          setPlaceDetails(result); // This sets the details of the place
          setCoords(result.geometry); // set the map to center on the clicked location now
        } else {
          console.error("Error fetching details", status); // Handle error
        }
      }
    );
  };

  useEffect(() => {
    if (selectedFilters.length < 1) return;
    console.log(selectedFilters);
  }, [selectedFilters]);

  return (
    <>
      <div className="explore-page-container  h-[calc(100vh-56px)] bg-red-500 flex">
        <div className="left-side bg-blue-500 w-[20%]">
          <h1>Filters</h1>
          <div className="card flex justify-center">
            <div className="flex flex-column gap-1">
              {categoryFilters.map((category) => (
                <div key={category.key} className="flex items-center">
                  <Checkbox
                    inputId={category.id}
                    name="category"
                    value={category.key}
                    // onCategoryChange is in the ExplorePageUtils file
                    onChange={(e) =>
                      onCategoryChange(
                        e,
                        category,
                        selectedFilters,
                        setSelectedFilters
                      )
                    }
                    checked={selectedFilters.some(
                      (item) => item.key === category.key
                    )}
                  />
                  <label htmlFor={category.key} className="ml-2">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="right-side relative flex flex-col items-center bg-pink-500 w-[80%]">
          <div className="right-container bg-purple-200 w-[75%] h-[95%] flex flex-col">
            <APIProvider apiKey={googleApiKey}>
              <ExploreContext.Provider
                value={{
                  address,
                  setAddress,
                  place,
                  setPlace,
                  coords,
                  getPlaceDetails,
                }}
              >
                <div className="autocomplete-container w-[100%] h-[30%] border-2 bg-blue-500 p-1">
                  {placeDetails ? (
                    <LocationCard
                      placeDetails={placeDetails}
                      setPlaceDetails={setPlaceDetails}
                    />
                  ) : (
                    <AutocompleteComponent />
                  )}
                </div>
                <div className="map-container border-2 h-[80%] w-full">
                  <MapComponent />
                </div>
                {/* <AdvancedMarker position={coords}></AdvancedMarker> */}
              </ExploreContext.Provider>
            </APIProvider>
          </div>
          {/* render the selected location's basic info on the card component below */}
        </div>
      </div>
    </>
  );
};

// card to be displayed if a user select's a location on the map.
export const LocationCard = ({ placeDetails, setPlaceDetails }) => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  const addToTrip = () => {
    console.log(placeDetails);
  };

  return (
    <>
      <Card style={{ width: "18rem" }} className="border-2 !w-[100%] !h-[100%]">
        <Card.Body>
          <div className="flex flex-row justify-between items-center">
            <Card.Title>{placeDetails.name}</Card.Title>
            <Button size="sm" onClick={() => setPlaceDetails(null)}>
              X
            </Button>
          </div>
          <Card.Subtitle className="mb-2 text-muted !text-[.75em]">
            {placeDetails.formatted_address}
          </Card.Subtitle>
          <div className="flex flex-col gap-1">
            {/* if user is logged in, let them add to a trip, if not redirect them to the login page */}
            {token ? (
              <button className="border-2" onClick={addToTrip}>
                Add to trip
              </button>
            ) : (
              <button className="border-2" onClick={redirectToLogin}>
                You have to login to add this to a trip!
              </button>
            )}
            <div className="location-links flex flex-row gap-1 justify-center">
              <button
                onClick={() => handleViewOnGoogle(placeDetails)}
                className="!text-[0.75em] border-2 w-[35%] flex items-center gap-1 justify-center"
                variant="primary"
                size="sm"
              >
                Google <ExternalLink size={10} />
              </button>
              <button
                onClick={() => handleViewWebsite(placeDetails)}
                className="!text-[0.75em] border-2 w-[35%] flex items-center gap-1 justify-center"
                variant="primary"
                size="sm"
              >
                Website <ExternalLink size={10} />
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

// docs for available filters :
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
