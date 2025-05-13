import {
  handleViewOnGoogle, // redirects to google
  handleViewWebsite, // redirects to the locations website
  onCategoryChange, // handles changing of checked filters for the map
  formatStayData, // formats data for backend
  formatActivityData, // formats data for backend
  lodgingSet, // set of place types under lodging
  touristAttractionSet, // set of attraction types under tourist attractions
  activitySet, // set of activity types
  restaurantSet, // set of restaurant types
} from "../utilities/ExplorePageUtils";
import React, { useEffect, useState, createContext, useContext } from "react";
import { AutocompleteComponent } from "../components/AutocompleteComponent";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import { grabLocID } from "../utilities/TripAdvisorUtils";
import MapComponent from "../components/MapComponent";
import { Button, Card, Accordion } from "react-bootstrap";
import { Checkbox } from "primereact/checkbox";
import { ExternalLink, X } from "lucide-react";
import "../App.css";
import axios from "axios";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";
// .env variables
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// logged in user's token
const token = localStorage.getItem("token");
// get mapId from .env
const mapId = import.meta.env.VITE_MAP_ID_V1;

// if they're not logged in, can't add location to a trip
const redirectToLogin = () => {
  navigate("/login");
};

// setting context to pass to any component rendered on this page
// don't need to include function params when passing thru context
export const ExploreContext = createContext({
  address: "",
  setAddress: () => {},
  place: null,
  selectedFilters: [],
  setPlace: () => {},
  coords: { lat: 0, lng: 0 },
  getPlaceDetails: () => {},
  setPlaceDetails: () => {},
  handleViewOnGoogle: () => {},
  handleViewWebsite: () => {},
  setMapInst: () => {},
  restaurants: [],
  hotels: [],
  attractions: [],
});

export const ExplorePage = () => {
  const { trip_id } = useParams();
  const navigate = useNavigate();
  const [mapInst, setMapInst] = useState(null)
  const [selected, setSelected] = useState(null)
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
  // state variables for locations that match the selected filters
  // set in the MapComponent
  const [restaurants, setRestaurants] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null)

  useEffect(() => {
    if (!place) return;
    updateMapLocation();
  }, [place]);

  // update the center location of the map
  const updateMapLocation = () => {
    setCoords({
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    });
  };

  // GETS INFORMATION REGARDING THE MAP LOCATION THAT THE USER SELECTED
  const getPlaceDetails = (placeId, lat, lng, map) => {
    if (!map) {
      console.warn("PlacesService container is null");
      return;
    }
    // map is the instance of the current map
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
          result["geometry"] = { lat: lat, lng: lng };
          setPlaceDetails(result); // This sets the details of the place
          setCoords(result.geometry); // set the map to center on the clicked location now
        } else {
          console.error("Error fetching details", status); // Handle error
        }
      }
    );
  };

  const returnToTrip = () => {
    navigate(`/tripview/${trip_id}`);
  };

  // handles the state for the selected location in the accordion dropdown
  const selectedSetter = (selectedLoc) => {
    if (selected === selectedLoc){
      setSelected(null)
      setPlaceDetails(null)
    } else if (!selected || selected){
      setSelected(selectedLoc)
    }
  };

useEffect(() => {
  if (!selected) return;
  getPlaceDetails(selected.place_id, selected.geometry.location.lat(), selected.geometry.location.lng(), mapInst)
}, [selected]);

  return (
    <>
      <div className="explore-page-container h-[calc(100vh-56px)] flex pr-3 pl-3">
        <div className="left-side w-[30%] h-full overflow-hidden">
          <h1 className="!text-[#00005A] text-center">Filters</h1>
          <div className="card !bg-[#00005A] w-9/10">
            <div className="flex flex-column gap-1">
              <Accordion flush activeKey={activeAccordion} onSelect={(key) => setActiveAccordion(key)}>
                {categoryFilters.map((category) => (
                  <Accordion.Item eventKey={category.key}>
                    <div key={category.key} className="flex items-center">
                      <div className="w-6 flex-shrink-0 flex justify-center">
                        <Checkbox
                          inputId={category.id}
                          name="category"
                          value={category.key}
                          onChange={(e) =>
                            onCategoryChange(
                              e,
                              category,
                              selectedFilters,
                              setSelectedFilters,
                              setRestaurants,
                              setHotels,
                              setAttractions,
                              placeDetails,
                              setPlaceDetails,
                              setActiveAccordion
                            )
                          }
                          checked={selectedFilters.some(
                            (item) => item.key === category.key
                          )}
                        />
                      </div>
                      <Accordion.Header>{category.name}</Accordion.Header>
                      {/* <label htmlFor={category.key} className="ml-2 text-white p-1">
                    {category.name}
                  </label> */}
                    </div>
                    <Accordion.Body className="!max-h-1/2 overflow-y-auto !p-5">
                      {/* checking if restaurants filter is selected */}
                      {category.key === "R" && restaurants
                        ? restaurants.map((restaurant) => (
                            <div className={`border-b-1 rounded-md p-1 ${
                              selected === restaurant
                              ? "bg-[#00005A] text-white"
                              : null
                            }`}
                              onClick={() => selectedSetter(restaurant)}
                              key={restaurant.name}
                              >
                              <span className="!text-[.75em]">
                                {restaurant.name}
                              </span>
                            </div>
                          ))
                        : null}
                        {/* checking if attractions filter is selected */}
                      {category.key === "A" && attractions
                        ? attractions.map((attraction) => (
                            <div className={`border-b-1 rounded-md p-1 ${
                              selected === attraction
                              ? "bg-[#00005A] text-white"
                              : null
                            }`}
                              onClick={() => selectedSetter(attraction)}
                              key={attraction.name}
                              >
                              <span className="!text-[.75em]">{attraction.name}</span>
                            </div>
                          ))
                        : null}
                      {/* checking if hotels filter is selected */}
                      {category.key === "H" && hotels
                        ? hotels.map((hotel) => (
                            <div className={`border-b-1 rounded-md p-1 ${
                              selected === hotel
                              ? "bg-[#00005A] text-white"
                              : null
                            }`}
                              onClick={() => selectedSetter(hotel)}
                              key={hotel.name}
                              >
                              <span className="!text-[.75em]">{hotel.name}</span>
                            </div>
                          ))
                        : null}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
        <div className="right-side relative flex flex-col items-center w-[70%]">
          <div className="right-container w-[100%] h-[95%] flex flex-col justify-center">
            <APIProvider apiKey={googleApiKey}>
              <ExploreContext.Provider
                value={{
                  place,
                  coords,
                  hotels,
                  address,
                  attractions,
                  restaurants,
                  selectedFilters,
                  setPlace,
                  setAddress,
                  setMapInst,
                  setPlaceDetails,
                  getPlaceDetails,
                }}
              >
                <div className="w-1/2">
                  <button
                    className="button-background text-white w-1/2 h-full"
                    onClick={returnToTrip}
                  >
                    Return to Trip
                  </button>
                </div>
                <div className="autocomplete-container w-[100%] h-[30%] p-1">
                  {placeDetails ? (
                    <LocationCard
                      placeDetails={placeDetails}
                      setPlaceDetails={setPlaceDetails}
                    />
                  ) : (
                    // {!isAdding ? <Grid size="50" speed="1.5" color="black" /> : null}
                    <AutocompleteComponent />
                  )}
                </div>
                <div className="map-container border-2 h-[80%] w-full">
                  <MapComponent
                    setRestaurants={setRestaurants}
                    setHotels={setHotels}
                    setAttractions={setAttractions}
                  />
                </div>
              </ExploreContext.Provider>
            </APIProvider>
          </div>
        </div>
      </div>
    </>
  );
};

// card to be displayed if a user select's a location on the map.
export const LocationCard = ({ placeDetails, setPlaceDetails }) => {
  const token = localStorage.getItem("token");
  const { results, setLogError, setResults } = useOutletContext();
  const { trip_id } = useParams();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  // STATE VARIABLES
  const [tripAdvisorMatch, setTripAdvisorMatch] = useState(null); // the trip advisor matching obj
  const [noMatchType, setNoMatchType] = useState(""); // used to update the activity "category" from Google's category types to our backend category types (attraction/restaurant)
  const [isDisabled, setIsDisabled] = useState(false);

  // checking which Google category type the location falls under --> LOOK IN THE ExplorePageUtils FILE for the SETS !!
  const setCategoryType = (types) => {
    if (lodgingSet.has(types[0])) {
      setNoMatchType("hotel");
      return "lodging";
    } else if (
      touristAttractionSet.has(types[0]) ||
      activitySet.has(types[0])
    ) {
      setNoMatchType("attraction");
      return "attraction";
    } else if (restaurantSet.has(types[0])) {
      setNoMatchType("restaurant");
      return "restaurant";
    }
    return "NO_MATCH";
  };

  useEffect(() => {
    const category = setCategoryType(placeDetails.types);
    if (category === "NO_MATCH") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [placeDetails]);

  const addToTrip = () => {
    console.log("adding to trip");
    let category = setCategoryType(placeDetails.types);
    console.log(category);
    if (!category) return;

    // call the Trip Advisor API --> LOOK IN THE TripAdvisorUtils FILE !!
    grabLocID(placeDetails.name, category, setLogError, setResults, 3);
  };

  // once there is a trip advisor object that matches the selected Google location, run this useEffect
  useEffect(() => {
    if (results.length < 1) return;
    getTripAdvisorMatch(placeDetails.name);
  }, [results]);

  // recursively iterating through the new results from trip advisor
  const getTripAdvisorMatch = (locationName) => {
    function findByName(obj, locationName) {
      // obj is the object containing the details and photos (both their own objects aka NESTED)
      if (obj && typeof obj === "object") {
        // checking of the details has a matching name
        if (obj.details && obj.details.name === locationName) {
          return obj;
        }

        for (const [key, value] of Object.entries(obj)) {
          if (key === "name" && value === locationName) {
            return obj;
          }
          const found = findByName(value, locationName);
          if (found) return found;
        }
      }
      return null;
    }

    // Loop through each top-level value in `results` (since it's an object)
    let matchingLocation = null;
    for (const obj of Object.values(results)) {
      matchingLocation = findByName(obj, locationName);
      if (matchingLocation) break; // Stop at the first match
    }

    if (matchingLocation) {
      setTripAdvisorMatch(matchingLocation);
    } else {
      console.log("No match found for:", locationName);
      if (noMatchType === "hotel") {
        const stay = formatStayData(null, placeDetails, trip_id);
        saveStay(stay);
      } else {
        const activity = formatActivityData(
          null,
          placeDetails,
          noMatchType,
          trip_id
        );
        saveActivity(activity);
      }
    }

    return matchingLocation;
  };

  // both formatStayData and formatActivityData are in the ExplorePageUtils file
  useEffect(() => {
    if (!tripAdvisorMatch) return;
    if (tripAdvisorMatch.details.category.name === "hotel") {
      const stay = formatStayData(tripAdvisorMatch, placeDetails, trip_id);
      saveStay(stay); // function to save stay data to backend
    } else {
      // if its an attraction or restaurant
      const activity = formatActivityData(
        tripAdvisorMatch,
        placeDetails,
        noMatchType,
        trip_id
      );
      saveActivity(activity); // function to save activity data to backend
    }
  }, [tripAdvisorMatch]);

  // save the the Activity model in the backend
  const saveActivity = async (activity) => {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/v1/activity/all/${trip_id}/`,
      activity,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    if (response.status === 201) {
      alert("success");
      setPlaceDetails(null); // removing the info for the selected place
      setResults([]); // clearing the tripAdvisor results so that clicking somewhere doesn't auto-add it
    } else {
      console.warn("There was an issue adding this to your trip.");
    }
  };

  const saveStay = async (stay) => {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/v1/stay/all/${trip_id}/`,
      stay,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    // console.log(response)
    if (response.status === 201) {
      alert("success!");
      setPlaceDetails(null); // removing the info for the selected place
      setResults([]); // clearing the tripAdvisor results so that clicking somewhere doesn't auto-add it
    } else {
      console.warn("There was an issue adding this to your trip.");
    }
  };

  return (
    <>
      <Card
        style={{ width: "18rem" }}
        className="!bg-[#00005A] !w-[100%] !h-[100%]"
      >
        <Card.Body>
          <div className="flex flex-row justify-between items-center text-white ">
            <Card.Title>{placeDetails.name}</Card.Title>
            <button
              className="bg-white !rounded-none w-5 h-5 flex items-center justify-center"
              onClick={() => setPlaceDetails(null)}
            >
              <X color="black" size={15} />
            </button>
          </div>
          <Card.Subtitle className="mb-2 text-white !text-[.75em]">
            {placeDetails.formatted_address}
          </Card.Subtitle>
          <div className="flex flex-col gap-1">
            {/* token - is user logged in? trip_id - is user editing a specific trip? */}
            {token ? (
              <button
                className="bg-white !text-[#00005A]"
                onClick={addToTrip}
                disabled={isDisabled}
                style={{
                  backgroundColor: isDisabled ? "#ccc" : "#007bff",
                  color: isDisabled ? "#666" : "white",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                Add to trip
              </button>
            ) : (
              // if token is null (not logged in)
              <button
                className="bg-white text-[#00005A]"
                onClick={redirectToLogin}
              >
                You have to login to add this to a trip!
              </button>
            )}
            <div className="location-links flex flex-row gap-1 justify-center">
              <button
                onClick={() => handleViewOnGoogle(placeDetails)}
                className="bg-white !text-[0.75em] !text-[#00005A] w-[35%] flex items-center gap-1 justify-center"
                variant="primary"
                size="sm"
              >
                Google <ExternalLink size={10} />
              </button>
              <button
                onClick={() => handleViewWebsite(placeDetails)}
                className="bg-white !text-[0.75em] !text-[#00005A] w-[35%] flex items-center gap-1 justify-center"
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
