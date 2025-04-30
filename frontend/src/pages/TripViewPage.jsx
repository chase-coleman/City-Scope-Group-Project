import { useState } from "react"

import ItineraryTicketComponent from "../components/ItineraryTicketComponent"

export default function TripViewPage() {

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


  return (
    <div className="flex flex-col h-dvh items-center justify-center p-4">
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
              <div onclick={() => setSelected(ticket)}>
                <ItineraryTicketComponent ticket={ticket} />
              </div>
            )
          })
          : <p>No days planned out yet</p>
        }
      </div>
    </div>
  )
}
