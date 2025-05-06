
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
    console.log(`You've used  ${key} calls`)
  }
  grabKeyUse(TAKey)


  export const grabLocID = async (city, country, category, setLogError, setResults, latlong="", name="", address = "") => {
    
    const checkUsage = await trip_Advisor_Api.get(`apiUsed/${TAKey}/`)
    const usedKey = checkUsage.data.APIs[0].key_used

    if (usedKey >= 4990) {
      alert(`API key is at ${usedKey} out of 5,000; get a new key`)
      return
    } else {
      console.log(`API calls used for this key : ${usedKey}, adding 7 for the calls`)
      await trip_Advisor_Api.put(`apiUsed/${TAKey}/`)
      return
    }
    try {
      const response = await trip_Advisor_Api.get('locID/', {
        params: {
          city: city,
          country: country,
          category: category,
          ...(latlong ? { latlong }:{}), //spread operator with ternary statement for optional axios parameters.
          ...(name ? {name}:{}),
          ...(address? {address}:{})
        },
        headers: {
            Accept: 'application/json',
          },
        validateStatus: (status) => true,
      });
  
      console.log(response);
  
      if (response.data?.locinfo) {
        console.log("Location info:", response.data.locinfo);
        setResults(response.data)

      }
  
    } catch (error) {
        console.error("Frontend error:", error);
        setLogError("Failed to fetch location ID");
        return false
    }
  };



