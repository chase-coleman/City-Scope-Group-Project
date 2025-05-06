import {
  handleViewOnGoogle,
  handleViewWebsite,
} from "../Utilities/ExplorePageUtils";
import React, { useEffect, useState, createContext, useContext } from "react";
import { AutocompleteComponent } from "../components/AutocompleteComponent";
import { APIProvider, AdvancedMarker } from "@vis.gl/react-google-maps";
import { grabLocID } from "../Utilities/TripAdvisorUtils";
import { userLogin } from "../Utilities/LoginPageUtils";
import MapComponent from "../components/MapComponent";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { Checkbox } from "primereact/checkbox";
import { ExternalLink } from "lucide-react";
import "../App.css";

// .env variables
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// logged in user's token
const token = localStorage.getItem("token");

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
    setLat(place.geometry.location.lat);
    setLng(place.geometry.location.lng);
  };

  const getPlaceDetails = (e, map) => {
    const placeId = e.placeId;

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
    // if (selectedFilters.length < 1) return;
    console.log(selectedFilters);
  }, [selectedFilters]);

  const onCategoryChange = (e, category) => {
    let _selectedFilters = [...selectedFilters];
    if (e.checked) {
      _selectedFilters.push(category);
      setSelectedFilters(_selectedFilters);
    } else {
      console.log("unchecking");
      _selectedFilters = _selectedFilters.filter(
        (cat) => cat.key !== category.key
      );
      setSelectedFilters(_selectedFilters);
    }
  };

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
                    onChange={(e) => onCategoryChange(e, category)}
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
          <div className="map-container bg-purple-200 w-[75%] h-[75%]">
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
                <AutocompleteComponent />
                <MapComponent />
              </ExploreContext.Provider>
              <AdvancedMarker position={coords}></AdvancedMarker>
            </APIProvider>
          </div>
          {/* render the selected location's basic info on the card component below */}
          {placeDetails ? <LocationCard placeDetails={placeDetails} /> : null}
        </div>
      </div>
    </>
  );
};

// card to be displayed if a user select's a location on the map.
export const LocationCard = ({ placeDetails }) => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  const addToTrip = () => {
    console.log(placeDetails);
  };

  return (
    <>
      <Card
        style={{ width: "18rem" }}
        className="absolute bottom-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <Card.Body>
          <Card.Title>{placeDetails.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted !text-[.75em]">
            {placeDetails.formatted_address}
          </Card.Subtitle>
          <div className="flex flex-col gap-1">
            {/* if user is logged in, let them add to a trip, if not redirect them to the login page */}
            {token ? (
              <Button variant="success" size="sm" onClick={addToTrip}>
                Add to trip
              </Button>
            ) : (
              <Button variant="success" size="sm" onClick={redirectToLogin}>
                You have to login to add this to a trip!
              </Button>
            )}
            <div className="location-links flex flex-row gap-1 justify-center">
              <Button
                onClick={() => handleViewOnGoogle(placeDetails)}
                className="!text-[0.75em] w-[35%] flex items-center gap-1 justify-center]"
                variant="primary"
                size="sm"
              >
                Google <ExternalLink size={10} />
              </Button>
              <Button
                onClick={() => handleViewWebsite(placeDetails)}
                className="!text-[0.75em] w-[35%] flex items-center gap-1 justify-center"
                variant="primary"
                size="sm"
              >
                Website <ExternalLink size={10} />
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

// docs for available filters :
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
