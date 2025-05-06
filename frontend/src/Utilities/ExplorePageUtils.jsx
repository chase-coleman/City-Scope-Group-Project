

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