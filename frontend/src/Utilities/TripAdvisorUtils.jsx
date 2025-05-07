
import axios from "axios";

const TAKey = import.meta.env.VITE_TRIP_ADVISOR_KEY

// --------------- API instance for all user functions ----------------

export const trip_Advisor_Api = axios.create({
  baseURL: `http://127.0.0.1:8000/api/v1/loc/`,
});

const headers = {
    Authorization: `key ${TAKey}`,
    'Content-Type': 'application/json',
  };
  const grabKeyUse = async(TAKey) =>  {
    const keyUse = await trip_Advisor_Api.get(`apiUsed/${TAKey}/`)
    const key = keyUse.data.APIs[0].key_used
    return key
  }
  const usedCalls =await grabKeyUse(TAKey)
  const akey = TAKey
  console.log(`You've used ${usedCalls} TripAdvisor Calls`)


  export const grabLocID = async (searchQuery, category, setLogError, setResults, results=3, latlong=null, address = null) => {
    const usedCalls =await grabKeyUse(TAKey)
    try{
    if (usedCalls >= 4990) {
      alert(`API key is at ${usedKey} out of 5,000; get a new key`)
      return
    } else {
      console.log(`API calls used for this key ${usedCalls}: adding 7 for the calls`)
      await trip_Advisor_Api.put(`apiUsed/${TAKey}/`)
     
    }

    const params = {
      searchQuery,
      category,
      akey,
      results
      
  };
  
  // Only add optional parameters if they have values
  //could also use the spread operator to do this  ...(latlong ? { latlong }:{}),
  if (latlong) params.latlong = latlong;
  if (address) params.address = address;
  
console.log("sending request to backend")

const response = await trip_Advisor_Api.get('locID', {
  params,
  headers: {
    Accept:'application/json',
  },
  validateStatus: (status) => status <500
});

      console.log("Back-end Response",response);

  if (response.status === 200 && response.data?.locinfo) {
    console.log("location info", response.data.locinfo);
    setResults(response.data)
    return true
  } else {

    setLogError("API ERROR")
    return false;
  }
  
    } catch (error) {
        console.error("Frontend error:", error);
        setLogError("Failed to fetch location ID");
        return false
    }
  };



