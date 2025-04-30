import { useState } from "react"

import { Button } from "react-bootstrap"

export default function TripViewPage() {

  let fake_itinerary = [
    {
      id: 1,
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
          <Button>BUTTON</Button>
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
              <div className="flex flex-colborder-2 w-48 rounded-lg">
                {ticket.id}
              </div>
            )
          })
          : <p>No days planned out yet</p>
        }
      </div>
    </div>
  )
}
