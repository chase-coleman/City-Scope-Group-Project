
// get the length of the trip from the selected dates
export const getTripDuration = (dates) => {
  const startDate = dates[0]
  const endDate = dates[1]

  // 86,4000,000 milliseconds in one day
  const msInDay = 1000 * 60 * 60 * 24;

  const differenceInMs = endDate - startDate
  const diffInDays = Math.round(differenceInMs / msInDay)
  return diffInDays
}

// format the trip for the backend
export const formatTrip = (tripData) => {
  const lastIndex = (tripData.location.split(",")).length
  const formattedTrip = {
    ...tripData,
    city: tripData.location.split(",")[0], // get the city 
    country: tripData.location.split(",")[lastIndex-1], // get the country
    duration: 1, // get the total amount of days 
    start_date: tripData.dates.toISOString().split("T")[0], // format dates for django models.DateField
  }
  // delete unneeded fields now
  delete formattedTrip.location
  delete formattedTrip.dates 
  
  return formattedTrip
}

