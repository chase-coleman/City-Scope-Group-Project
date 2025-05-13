
// setter = the state setter for that filter's results
// callback function that will set the state variable to the return of whatever nearbySearch function called it 
// (restaurants, hotels, attractions)
export const createCallback = (setter) => (result, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK){
    setter(result)
  }
}

// type will be one of these : (restaurants, hotels, attractions)
// callback is the correct callback that sets the state for each filter's return values
// coords are the current map's view
// map is the map isntance
export const createNearbySearch = (types, callback, coords, map) => () => {
  const service = new google.maps.places.PlacesService(map);
  const request = {
    location: coords,
    radius: 1000, // 1000 meters
    type: types, 
  };
  // nearbySearch is from Google Maps API
  service.nearbySearch(request, callback);
}  
  
// redirecting the user to view the selected location on Google Maps
export const handleViewOnGoogle = (placeDetails) => {
  if (!placeDetails?.website) {
    console.error("Google link is missing or invalid.")
    return;
  }

  try {
    const newTab = window.open(placeDetails.url, "_blank");
    if (!newTab){
      console.error("There was an issue opening this link on Google. Please check your browser's pop-up settings.")
    }
  } catch (error) {
    console.error("There was an issue redirecting. Please search the location on Google manually.")
  }
};

// redirecting the user to view the selected location's website
export const handleViewWebsite = (placeDetails) => {
  if (!placeDetails?.website) {
    console.error("Website URL is missing or invalid.");
    return;
  }

  try {
    const newTab = window.open(placeDetails.website, "_blank");
    
    if (!newTab) {
      console.error("The website couldn't be opened. Please check your browser's pop-up settings.");
    }
  } catch (error) {
    console.error("There was an issue redirecting. Please search the location website manually.");
  }
};

// handling the change of selected filters for the google map
export const onCategoryChange = (e, category, selectedFilters, setSelectedFilters, setRestaurants, setHotels, setAttractions, placeDetails, setPlaceDetails, setActiveAccordion) => {
  let _currentFilters = [...selectedFilters]; // retrieve the current selectedFilters
  if (e.checked) {
    _currentFilters.push(category); // add the newly checked category to the current selected filters
    setSelectedFilters(_currentFilters); // set the state
    setActiveAccordion(category.key)
  } else { // if we're unselecting a filter, remove it 
    clearResults(category.key, setRestaurants, setHotels, setAttractions)
    _currentFilters = _currentFilters.filter(
      (cat) => cat.key !== category.key 
    );
    if (placeDetails){
      setPlaceDetails(null)
    }
    setActiveAccordion(null)
    setSelectedFilters(_currentFilters);
  }
};

const clearResults = (category, setRestaurants, setHotels, setAttractions) => {
  if (category === "H"){
    console.log("clearing hotels!")
    setHotels([])
  } else if (category === "R"){
    setRestaurants([])
  } else {
    console.log("clearing attractions!")
    setAttractions([])
  }
}

// selects a random photo from the two arrays beneath it
// the photos are in the public directory
const getRandomImage = (arr) => arr[Math.floor(Math.random() * arr.length)];
const defaultActivityPhotos = [
  '/activities/gymclass.jpg', '/activities/hikers-top.jpg', '/activitiesoutdoorsphoto.jpg', '/activities/yoga.jpg', '/activities/badminton.jpg', '/activities/bike.jpg'
]
const defaultRestaurantPhotos = [
  '/restaurants/restaurant.jpg', '/restaurants/restaurant2.jpg', '/restaurants/restaurant3.jpg', '/restaurants/restaurant4.jpg', '/restaurants/restaurant5.jpg', '/restaurants/restaurant6.jpg'
]
const defaulHotelPhotos = [
  '/hotels/genericHotel.jpg', '/hotels/hotel2.jpg', '/hotels/hotel3.jpg', '/hotels/hotel4.jpg', '/hotels/hotel5.jpg', '/hotels/hotel6.jpg'
]


// formatting data for the backend
export const formatStayData = (
  tripAdvisorMatch = null, 
  placeDetails={},
   trip_id) => {
  const stayData = {
    "name": tripAdvisorMatch?.details?.name || placeDetails.name,
    "location": `${tripAdvisorMatch?.details?.address_obj.city}, ${tripAdvisorMatch?.details?.address_obj.country}`
     || `${placeDetails.address_components[3].long_name}, ${placeDetails.address_components[6].long_name}`,
    "link": tripAdvisorMatch?.details?.web_url || placeDetails.website,
    "trip": trip_id,
    "image_thumb": tripAdvisorMatch?.photos?.data[0]?.images?.thumbnail?.url || getRandomImage(defaulHotelPhotos), 
    "image_main": tripAdvisorMatch?.photos?.data[0]?.images?.large?.url || getRandomImage(defaulHotelPhotos),
    "location_id": tripAdvisorMatch?.details?.location_id || null
  }
  return stayData
};

// formatting data for the backend
export const formatActivityData = (
  tripAdvisorMatch = null,
  placeDetails = {},
  noMatchType = '',
  trip_id = null
) => {
  // checking if the category of the location is a restaurant or attraction
  // so that we can display a default image of roughly the same type
  const category = tripAdvisorMatch?.details?.category?.name || noMatchType
  const isRestaurant = category === "restaurant"

  const fallbackImg = isRestaurant ? getRandomImage(defaultRestaurantPhotos) : getRandomImage(defaultActivityPhotos)

  const activityData = {
    name: tripAdvisorMatch?.details?.name || placeDetails.name,
    location:
      (tripAdvisorMatch?.details?.address_obj?.city &&
        tripAdvisorMatch?.details?.address_obj?.country &&
        `${tripAdvisorMatch.details.address_obj.city}, ${tripAdvisorMatch.details.address_obj.country}`) ||
      (placeDetails.address_components &&
        `${placeDetails.address_components[3]?.long_name}, ${placeDetails.address_components[6]?.long_name}`),
    address:
      tripAdvisorMatch?.details?.address_obj?.address_string ||
      placeDetails.formatted_address,
    category: tripAdvisorMatch?.details?.category?.name || noMatchType,
    url: tripAdvisorMatch?.details?.web_url || placeDetails.website,
    trip: trip_id,
    image_thumb:
      tripAdvisorMatch?.photos?.data?.[0]?.images?.thumbnail?.url || fallbackImg,
    image_main:
      tripAdvisorMatch?.photos?.data?.[0]?.images?.large?.url || fallbackImg,
    location_id: tripAdvisorMatch?.details?.location_id || null,
  };
  return activityData;
};





// sets used to simplify the google maps location "types" to fit into 
// Trip Advisor's Api "categories"
export const lodgingSet = new Set([
  "lodging", "campground", "rv_park"
]);

export const touristAttractionSet = new Set([
  "amusement_park", "aquarium", "art_gallery", "museum", "zoo", 
  "stadium", "park", "casino", "church", "hindu_temple", 
  "mosque", "synagogue", "tourist_attraction"
]);

export const activitySet = new Set([
  "bar", "book_store", "bowling_alley", "night_club", 
  "shopping_mall", "spa", "movie_theater", "liquor_store", 
  "library", "gym", "supermarket",  "clothing_store", 
  
]);

export const restaurantSet = new Set([
  "restaurant", "cafe", "restaurant", "meal_delivery", "meal_takeaway",
]);




