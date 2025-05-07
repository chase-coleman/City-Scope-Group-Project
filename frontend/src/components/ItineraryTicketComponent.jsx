

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

  return (
    <div className="flex flex-col border-2 h-full items-center w-48 rounded-lg overflow-y-auto">
      <div>{ticket.date}</div>
      {
        ticket.stay
        ? <div>
            {ticket.stay.name}
            <button onClick={(e) => {e.stopPropagation(), stayRemover()}}className="text-red-500">X</button>
          </div>
        : <div>Choose a stay</div>
      }
      <div>Activities Planned:</div>
      {
        ticket.activities
        ? ticket.activities.map((item) => {
          return (
            <div>
              {item.name}
            </div>
          )
        })
        : <p>No activities planned</p>
      }
    </div>
  )
}
