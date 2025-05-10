



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
export const onCategoryChange = (e, category, selectedFilters, setSelectedFilters) => {
  let _currentFilters = [...selectedFilters]; // retrieve the current selectedFilters
  if (e.checked) {
    _currentFilters.push(category); // add the newly checked category to the current selected filters
    setSelectedFilters(_currentFilters); // set the state
  } else { // if we're unselecting a filter, remove it 
    _currentFilters = _currentFilters.filter(
      (cat) => cat.key !== category.key 
    );
    setSelectedFilters(_currentFilters);
  }
};

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
    "image_thumb": tripAdvisorMatch?.photos?.data[0].images.thumbnail.url || null, 
    "image_main": tripAdvisorMatch?.photos?.data[0].images.large.url || null,
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
      tripAdvisorMatch?.photos?.data?.[0]?.images?.thumbnail?.url || null,
    image_main:
      tripAdvisorMatch?.photos?.data?.[0]?.images?.large?.url || null,
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
  "bar", "bicycle_store", "book_store", "bowling_alley", "night_club", 
  "shopping_mall", "spa", "movie_rental", "movie_theater", "liquor_store", 
  "library", "gym", "supermarket",  "department_store", "clothing_store", 
  "florist", "subway_station"
]);

export const restaurantSet = new Set([
  "restaurant", "cafe", "restaurant", "meal_delivery", "meal_takeaway",
]);
