
import axios from "axios";
const TAKey = import.meta.env.TRIP_ADVISOR_KEY
// --------------- API instance for all user functions ----------------

export const trip_Advisor_Api = axios.create({
  baseURL: `http://127.0.0.1:8000/api/v1/loc/`,
});

const headers = {
    Authorization: `key ${TAKey}`,
    'Content-Type': 'application/json',
  };

  export const grabLocID = async (city, country, category, setLogError) => {
    try {
      const response = await trip_Advisor_Api.get('locID/', {
        params: {
          city: city,
          country: country,
          category: category,
        },
        headers: {
            Accept: 'application/json',
          },
        validateStatus: (status) => true,
      });
  
      console.log(response);
  
      if (response.data?.locinfo) {
        console.log("Location info:", response.data.locinfo);
      }
  
    } catch (error) {
        console.error("Frontend error:", error);
        setLogError("Failed to fetch location ID");
        return false
    }
  };



