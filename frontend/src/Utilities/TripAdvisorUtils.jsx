
import axios from "axios";
const TAKey = import.meta.env.TRIP_ADVISOR_KEY
// --------------- API instance for all user functions ----------------

export const trip_Advisor_Api = axios.create({
  baseURL: `https://api.content.tripadvisor.com/api/v1/location/search?key=${TAKey}&searchQuery=`,
});

const headers = {
    Authorization: `key ${TAKey}`,
    'Content-Type': 'application/json',
  };

export const grabLocID = async(country, city, category) => {
    try {
        let response
        response = await trip_Advisor_Api.get(`${country}%20${city}&category=${category}&language=en`,
        {
            validateStatus: (status) => true,
        },
        headers,
        )
        console.log(response)
    if(response.location_id) {


    }


}
catch {
    console.log("Error somewhere")
}
}

