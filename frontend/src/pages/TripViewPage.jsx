import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import ItineraryTicketComponent from "../components/ItineraryTicketComponent"

export default function TripViewPage() {

  const { trip_id } = useParams()

  let fake_itinerary = [
    {
      id: 1,
      date: "2025-04-23",
      Morning: [
        'eat food',
        'lugma a chugma'
      ],
      Afternoon: [
        'sleep',
        'drink drugs'
      ],
      Evening: [
        'perish'
      ]
    },
    {
      id: 2,
      date: "2025-04-23",
      Morning: [
        'eat food',
        'lugma a chugma'
      ],
      Afternoon: [
        'sleep',
        'drink drugs'
      ],
      Evening: [
        'perish'
      ]
    },
    {
      id: 3,
      date: "2025-04-23",
      Morning: [
        'eat food',
        'lugma a chugma'
      ],
      Afternoon: [
        'sleep',
        'drink drugs'
      ],
      Evening: [
        'perish'
      ]
    }
  ]

  const [selected, setSelected] = useState(null)
  // All itinieraries for a specific trip
  const [itineraries, setItineraries] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchItineraries() {
      setIsLoading(true)
      const response = await fetch(`http://localhost:8000/api/v1/itinerary/all/${trip_id}`, {
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
    fetchItineraries()
  }, [])

  return (
    <div className="flex flex-col h-dvh items-center justify-center p-4">
      {
        error || isLoading
        ? error
          ? <p>error</p>
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
            <div className="w-full h-4/9 border-2">
              {
                selected
                ? <div>Selected ticket: {selected.id}</div>
                : <p>Nothing selected</p>
              }
            </div>
            <div className="flex flex-wrap gap-2 w-full h-4/9 border-1 p-4">
              {
                fake_itinerary
                ? fake_itinerary.map((ticket) => {
                  return (
                    <div onClick={() => setSelected(ticket)}>
                      <ItineraryTicketComponent ticket={ticket} />
                    </div>
                  )
                })
                : <p>No days planned out yet</p>
              }
            </div>
          </>
      }
      
    </div>
  )
}
