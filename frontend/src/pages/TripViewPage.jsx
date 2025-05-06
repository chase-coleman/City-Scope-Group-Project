import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import ItineraryTicketComponent from "../components/ItineraryTicketComponent"

export default function TripViewPage() {

  const { trip_id } = useParams()

  const [selected, setSelected] = useState(null)
  // All itinieraries for a specific trip
  const [itineraries, setItineraries] = useState(null)
  // All stays user chose to add to top bar
  const [stays, setStays] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchItineraries() {
    setIsLoading(true)
    const response = await fetch(`http://localhost:8000/api/v1/itinerary/all/${trip_id}/`, {
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`
      }
    })
    if(!response.ok) {
      setItineraries(null)
      setIsLoading(false)
      setError(`Had troubles fetching trip itineraries`)
    }
    const data = await response.json()
    setIsLoading(false)
    console.log(data)
  }

  async function fetchStays() {

    const response = await fetch(`http://localhost:8000/api/v1/stay/itinerary/${trip_id}/`, {
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`
      }
    })
    const data = await response.json()
    setStays(data.stays)

    // const stay1 = {
    //   "name": "Hilton Tokyo",
    //   "location": "japan",
    //   "duration": 3,
    //   "link": "https://www.tripadvisor.com/Hotel_Review-g14133673-d304289-Reviews-Hilton_Tokyo-Nishishinjuku_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html?m=66827",
    //   "itinerary": 1,
    //   "image_thumb": "https://media-cdn.tripadvisor.com/media/photo-t/2d/e6/4f/88/exterior.jpg",
    //   "image_main": "https://media-cdn.tripadvisor.com/media/photo-m/1280/2d/e6/4f/88/exterior.jpg",
    //   "location_id": 304289
    // }
    // const stay2 = {
    //   "name": "Hilton Tokyo 2",
    //   "location": "japan",
    //   "duration": 3,
    //   "link": "https://www.tripadvisor.com/Hotel_Review-g14133673-d304289-Reviews-Hilton_Tokyo-Nishishinjuku_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html?m=66827",
    //   "itinerary": 1,
    //   "image_thumb": "https://media-cdn.tripadvisor.com/media/photo-t/2d/e6/4f/88/exterior.jpg",
    //   "image_main": "https://media-cdn.tripadvisor.com/media/photo-m/1280/2d/e6/4f/88/exterior.jpg",
    //   "location_id": 304289
    // }
    // const stay3 = {
    //   "name": "Hilton Tokyo3",
    //   "location": "japan",
    //   "duration": 3,
    //   "link": "https://www.tripadvisor.com/Hotel_Review-g14133673-d304289-Reviews-Hilton_Tokyo-Nishishinjuku_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html?m=66827",
    //   "itinerary": 1,
    //   "image_thumb": "https://media-cdn.tripadvisor.com/media/photo-t/2d/e6/4f/88/exterior.jpg",
    //   "image_main": "https://media-cdn.tripadvisor.com/media/photo-m/1280/2d/e6/4f/88/exterior.jpg",
    //   "location_id": 304289
    // }
    // setStays([stay1, stay2, stay3])

  }

  useEffect(() => {
    fetchItineraries()
    fetchStays()
  }, [])

  return (
    <div className="flex flex-col h-dvh items-center justify-center p-4 mb-0">
      {
        error || isLoading
        ? error
          ? <p>{error}</p>
          : <p>Loading.......</p>
        : <>
            <div className="h-1/9">
              <p>
                Trip Name: Chugnus trip
              </p>
              <p>
                Destination: big lungus
              </p>
            </div>
            <div className="flex items-center justify-center w-full h-4/9 border-2">
              <div className="flex flex-col items-center h-full w-full border-2 ">
                <p>
                  Stays
                </p>
                {
                  stays
                  ? stays.map((stay) => {
                    return (
                      <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center h-36 relative">
                          <img src={stay.image_main} className="overflow-hidden h-20 w-20" />
                          <div className="flex flex-col">
                            <p>{stay.name}</p>
                            <p>{stay.location}</p>
                            <a href={stay.link}>Link to place</a>
                          </div>
                        </div>
                      </div>
                    )
                  })
                  : <p>No stays added, add some by exploring the explore page</p>
                }
              </div>
              <div className="flex flex-col items-center h-full w-full border-2 ">
                <p>
                  POI
                </p>
              </div>
              <div className="flex flex-col items-center h-full w-full border-2 ">
                <p>
                  Activities
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full h-4/9 border-1 p-4">
                itniery stuff
            </div>
          </>
      }
      
    </div>
  )
}
