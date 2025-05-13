export default function ItineraryTicketComponent({
  ticket,
  itineraries,
  setItineraries,
  setMiniError,
  setMiniNote,
}) {
  async function stayDeleter() {
    setMiniError(null);
    setMiniNote(null);

    let temp = [...itineraries];
    temp.forEach((item) => {
      if (item.id === ticket.id) {
        item.stay = null;
      }
    });
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/itinerary/${ticket.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: "stay",
            new_stay_id: null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("failed to remove stay from itinerary");
      }
      setMiniNote("Sucessfully removed stay from itinerary");
      setItineraries(temp);
    } catch (err) {
      setMiniError(err.message);
      console.log(err);
    }
  }

  async function activityDeleter(activityObject) {
    setMiniError(null);
    setMiniNote(null);

    console.log("ticket", ticket);
    console.log("activityObject", activityObject);
    // new array of activities without the designated activity that needs to be removed
    const adjustedArray = ticket.activities.filter((activity) => {
      if (activity.uuid !== activityObject.uuid) {
        return activity;
      }
    });
    const payloadArray = adjustedArray.map((activity) => {
      return activity.id;
    });
    console.log(payloadArray);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/itinerary/${ticket.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: "activities",
            new_activity_array: payloadArray,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove activity from itinerary");
      }

      let temp = itineraries.map((itin) => {
        if (itin.id === ticket.id) {
          itin.activities = adjustedArray;
          return itin;
        } else {
          return itin;
        }
      });
      setItineraries(temp);
    } catch (err) {
      setMiniError("Failed to remove activity from itinerary");
      console.log(err.message);
    }
  }
  return (
    <div className="flex flex-col bg-[#00005A] h-full items-center w-36 overflow-y-auto rounded-lg gap-1 px-1">
      <div className="text-white text-xl">{ticket.date}</div>
      {ticket.stay ? (
        <div className="text-white">
          {ticket.stay.name}
          <button
            onClick={(e) => {
              e.stopPropagation(), stayDeleter();
            }}
            className="text-red-500"
          >
            X
          </button>
        </div>
      ) : (
        <div className="text-white">Choose a stay</div>
      )}
      <div className="flex flex-col items-center justify-center text-white">Activities Planned:</div>
      {ticket.activities.length ? (
        ticket.activities.map((item) => {
          return (
            <div key={item.uuid} className="flex items-center w-full justify-center text-white border-1 rounded-lg p-1">
              <div className="text-center">
                {item.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(), activityDeleter(item);
                }}
                className="text-red-500"
              >
                X
              </button>
            </div>
          );
        })
      ) : (
        <div className="text-center text-white border-1 border-red-500 rounded-md">No activities planned</div>
      )}
    </div>
  );
}
