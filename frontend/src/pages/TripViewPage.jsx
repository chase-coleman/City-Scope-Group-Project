import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import ItineraryTicketComponent from "../components/ItineraryTicketComponent"
import PotluckPlacardComponent from "../components/PotluckPlacardComponent"

export default function TripViewPage() {

  const { trip_id } = useParams()

  // Which itinerary is currently selected(yellow border for now)
  const [selected, setSelected] = useState(null)
  // All itinieraries for a specific trip
  const [itineraries, setItineraries] = useState(null)
  // All stays user chose to add to potluck
  const [stays, setStays] = useState(null)
  // All restaurants user chose to add to potluck
  const [restaurants, setRestaurants] = useState([])
  // All activities user chose to add to potluck
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  // Mini error is for activities and stay removers to notify useres if they failed to remove a stay or activity
  const [miniError, setMiniError] = useState(null)
  // Mini note is for activities and stay adders
  const [miniNote, setMiniNote] = useState(null)

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
    let data = await response.json()
    // Sort itinerary days by date lowest => highest
    data = data.sort((a, b) => a.date.localeCompare(b.date))
    setIsLoading(false)
    setItineraries(data)
    console.log(data)
  }

  async function fetchAll() {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/stay/itinerary/${trip_id}/`, {
        headers: {
          "Authorization": `Token ${localStorage.getItem("token")}`
        }
      })
      const data = await response.json()
      setStays(data.stays)
    } catch(err) {
      setError(err)
      setIsLoading(false)
      console.log("failed to fetch stays for itinerary")
    }

    try {
      const response2 = await fetch(`http://localhost:8000/api/v1/activity/all/${trip_id}/`, {
        headers: {
          "Authorization": `Token ${localStorage.getItem("token")}`
        }
      })
      const data2 = await response2.json()
      console.log(data2)
  
      setRestaurants([])
      setActivities([])
  
      // Decipher activity category for usestate
      data2.forEach((item) => {
        if(item.category === "restaurants") {
          setRestaurants((prev) => [...prev, item])
        } else if(item.category === "attractions") {
          setActivities((prev) => [...prev, item])
        }
      })
    } catch(err) {
      setError(err)
      setIsLoading(false)
      console.log("Failed to grab restaurants and activities from acitvity api")
    }

  }

  // Setter function to add stuff to currently selected itinerary date
  async function setterSelector(currentSelectedObj) {
    if(selected === currentSelectedObj) {
      setSelected(null)
    } else if(!selected) {
      setSelected(currentSelectedObj)
    } else if(selected) {
      setSelected(currentSelectedObj)
    } 
  }


  
  // Setter function to update currently selected itinerary's stay(hotel)
  async function stayAdder(stayObject) {
    setMiniError(null)
    setMiniNote(null)
    if(!selected && stayObject) {
      setMiniError("Please select an itinerary in order to update your stay")
      return
    }
    let temp = [...itineraries]
    let adjusted 
    temp.forEach((item) => {
      if(item.id === selected.id) {
        item.stay = stayObject
        adjusted = item.id
      }
    })
  
    try {
      const response = await fetch(`http://localhost:8000/api/v1/itinerary/${adjusted}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          "type": "stay",
          "new_stay_id": stayObject.id
        })
      })
      if(!response.ok){
        throw new Error("Failed to update Stay")
      }
      setMiniNote("Successfully changed/added stay to itinerary")
      setItineraries(temp)
    } catch(err) {
      setMiniError(err.message)
      console.log(err)
    }

  }

  async function activityAdder() {
    null
  }

  useEffect(() => {
    fetchItineraries()
    fetchAll()
  }, [])

  return (
    <div className="flex flex-col h-dvh items-center justify-center p-4 mb-0">
      {
        error || isLoading
        ? error
          ? <div>{error}</div>
          : <div>Loading.......</div>
        : <>
            <div className="flex flex-col items-center justify-center h-1/9">
              <div className="mb-0">
                Trip Name: Chugnus trip
              </div>
              <div className="mb-0">
                Destination: big lungus
              </div>
              {
                miniError
                ? <div className="text-red-300 mb-0">{miniError}</div>
                : null
              }
              {
                miniNote
                ? <div className="text-green-300 mb-0">{miniNote}</div>
                : null
              }
            </div>
            <div className="flex items-center justify-center w-full h-4/9 border-2">

              <div className="flex flex-col items-center h-full w-full border-2 overflow-y-auto">
                <div className="">
                  Stays
                </div>
                {
                  stays
                  ? stays.map((stay) => {
                    return (
                      <PotluckPlacardComponent activityObject={stay} key={stay.id} stayAdder={stayAdder}/>
                    )
                  })
                  : <div>No stays added, add some by exploring the explore page</div>
                }
              </div>

              <div className="flex flex-col items-center h-full w-full border-2 overflow-y-auto">
                <div>
                  Resturants/Food
                </div>
                {
                  restaurants
                  ? restaurants.map((restaurant) => {
                    return (
                      <PotluckPlacardComponent activityObject={restaurant} activityAdder={activityAdder} key={restaurant.id}/>
                    )
                  })
                  : <div>No restaurants added, add some by exploring the explore page</div>
                }
              </div>

              <div className="flex flex-col items-center h-full w-full border-2 overflow-y-auto">
                <div>
                  Activities
                </div>
                {
                  activities
                  ? activities.map((activity) => {
                    return (
                      <PotluckPlacardComponent activityObject={activity} activityAdder={activityAdder} key={activity.id}/>
                    )
                  })
                  : <div>No activities added, add some by exploring the explore page</div>
                }
              </div>

            </div>
            <div className="flex gap-2 w-full h-4/9 border-1 p-4 overflow-x-auto">
                {
                  itineraries
                  ? itineraries.map((item) => {
                    return (
                      <div className={`border-2 ${selected===item ? "border-yellow-200" : ""}`} onClick={() => setterSelector(item)} key={item.id}>
                        <ItineraryTicketComponent ticket={item} itineraries={itineraries} setItineraries={setItineraries} setMiniError={setMiniError} setMiniNote={setMiniNote}/>
                      </div>
                    )
                  })
                  : <div>No itineries/days</div>
                }
            </div>
          </>
      }
      
    </div>
  )
}
