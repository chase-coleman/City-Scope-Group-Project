

// get the length of the trip from the selected dates
export const getTripDuration = (dates) => {
  const startDate = dates[0]
  const endDate = dates[1]

  // 86,4000,000 milliseconds in one day
  const msInDay = 1000 * 60 * 60 * 24;

  const differenceInMs = endDate - startDate
  const diffInDays = Math.round(differenceInMs, msInDay)
  return diffInDays
}