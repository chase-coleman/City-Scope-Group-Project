

export default function ItineraryTicketComponent({ ticket, itineraries, setItineraries, setMiniError, setMiniNote }) {
  
  async function stayRemover() {
    setMiniError(null)
    setMiniNote(null)

    let temp = [...itineraries]
    temp.forEach((item) => {
      if(item.id === ticket.id) {
        item.stay = null
      }
    })
    try {
      const response = await fetch(`http://localhost:8000/api/v1/itinerary/${ticket.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          "type": "stay",
          "new_stay_id": null
        })
      })

      if(!response.ok) {
        throw new Error("failed to remove stay from itinerary")
      }
      setMiniNote("Sucessfully removed stay from itinerary")
      setItineraries(temp)
    } catch(err) {
      setMiniError(err.message)
      console.log(err)
    }
  }

  async function activityRemover(activityObject) {
    setMiniError(null)
    setMiniNote(null)

    console.log("ticket", ticket)
    console.log("activityObject", activityObject)
    // new array of activities without the designated activity that needs to be removed
    const adjustedArray = ticket.activities.filter((activity) => {
      if(activity.uuid !== activityObject.uuid) {
        return activity
      }
    })
    const payloadArray = adjustedArray.map((activity) => {
      return activity.id
    })
    console.log(payloadArray)

    try {
      const response = await fetch(`http://localhost:8000/api/v1/itinerary/${ticket.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          "type": "activities",
          "new_activity_array": payloadArray
        })
      })
      if(!response.ok) {
        throw new Error("Failed to remove activity from itinerary")
      }

      let temp = itineraries.map((itin) => {
        if(itin.id === ticket.id) {
          itin.activities = adjustedArray
          return itin
        } else {
          return itin
        }
      })
      setItineraries(temp)

    } catch(err) {
      setMiniError("Failed to remove activity from itinerary")
      console.log(err.message)
    }

  }
  return (
    <div className="flex flex-col bg-[#FFF9D0] h-full items-center w-36 overflow-y-auto">
      <div>{ticket.date}</div>
      {
        ticket.stay
        ? <div>
            {ticket.stay.name}
            <button onClick={(e) => {e.stopPropagation(), stayRemover()}} className="text-red-500">X</button>
          </div>
        : <div>Choose a stay</div>
      }
      <div>Activities Planned:</div>
      {
        ticket.activities
        ? ticket.activities.map((item) => {
          return (
            <div key={item.uuid}>
              {item.name}
              <button onClick={(e) => {e.stopPropagation(), activityRemover(item)}} className="text-red-500">X</button>
            </div>
          )
        })
        : <p>No activities planned</p>
      }
    </div>
  )
}
