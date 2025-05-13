import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css"
import ItineraryTicketComponent from "../components/ItineraryTicketComponent";
import PotluckPlacardComponent from "../components/PotluckPlacardComponent";
import { fetchTrip } from "../utilities/TripViewPageUtils";

import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

export default function TripViewPage() {
  function addOneDay(dateString) {
    const date = new Date(dateString); // Convert the string to a Date object
    date.setDate(date.getDate() + 1); // Add 1 day
    return date.toISOString().split("T")[0]; // Return in yyyy-mm-dd format
  }

  const navigate = useNavigate();
  const { trip_id } = useParams();

  const [trip, setTrip] = useState(null);
  // Which itinerary is currently selected(yellow border for now)
  const [selected, setSelected] = useState(null);
  // All itinieraries for a specific trip
  const [itineraries, setItineraries] = useState(null);
  // All stays user chose to add to potluck
  const [stays, setStays] = useState(null);
  // All restaurants user chose to add to potluck
  const [restaurants, setRestaurants] = useState([]);
  // All activities user chose to add to potluck
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Mini error is for activities and stay removers to notify useres if they failed to remove a stay or activity
  const [miniError, setMiniError] = useState(null);
  // Mini note is for activities and stay adders
  const [miniNote, setMiniNote] = useState(null);

  // useEffect(() => {
  //   console.log(trip)
  // }, [trip])
  
  async function fetchItineraries() {
    const response = await fetch(
      `http://localhost:8000/api/v1/itinerary/all/${trip_id}/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      setItineraries(null);
      setError(`Had troubles fetching trip itineraries`);
    }
    let data = await response.json();
    // Add a uuid to each activity for React Key
    data = data.map((item) => {
      return {
        ...item,
        activities: item.activities.map((activity) => ({
          ...activity,
          uuid: crypto.randomUUID(),
        })),
      };
    });
    // Sort itinerary days by date lowest => highest
    data = data.sort((a, b) => a.date.localeCompare(b.date));
    setItineraries(data);
  };

  // Fetch activities and stays for potluck stuff(top triple bar)
  async function fetchAll() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/stay/all/${trip_id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setStays(data.stays);
    } catch (err) {
      setError(err);
      console.log("failed to fetch stays for itinerary");
    }

    try {
      const response2 = await fetch(
        `http://localhost:8000/api/v1/activity/all/${trip_id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      const data2 = await response2.json();
      console.log(data2);

      setRestaurants([]);
      setActivities([]);

      // Decipher activity category for usestate
      data2.forEach((item) => {
        if (item.category === "restaurant") {
          setRestaurants((prev) => [...prev, item]);
        } else if (item.category === "attraction") {
          setActivities((prev) => [...prev, item]);
        }
      });
    } catch (err) {
      setError(err);
      console.log(
        "Failed to grab restaurants and activities from acitvity api"
      );
    }
  }

  // Setter function to add stuff to currently selected itinerary date
  async function setterSelector(currentSelectedObj) {
    if (selected === currentSelectedObj) {
      setSelected(null);
    } else if (!selected) {
      setSelected(currentSelectedObj);
    } else if (selected) {
      setSelected(currentSelectedObj);
    }
  }

  // Setter function to update currently selected itinerary's stay(hotel)
  async function stayAdder(stayObject) {
    setMiniError(null);
    setMiniNote(null);
    if (!selected && stayObject) {
      setMiniError("Please select an itinerary in order to update your stay");
      return;
    }
    let temp = [...itineraries];
    let adjusted;
    temp.forEach((item) => {
      if (item.id === selected.id) {
        item.stay = stayObject;
        adjusted = item.id;
      }
    });

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/itinerary/${adjusted}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: "stay",
            new_stay_id: stayObject.id,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update Stay");
      }
      setMiniNote("Successfully changed/added stay to itinerary");
      setItineraries(temp);
    } catch (err) {
      setMiniError(err.message);
      console.log(err);
    }
  }

  async function activityAdder(activityObject) {
    // activityObject is the object referring to itself when called inside a potluckcomponent card for restaurants or actvities//
    setMiniError(null);
    setMiniNote(null);
    if (!selected && activityObject) {
      setMiniError("Please select an itinerary in order add this item");
      return;
    }

    // activities are serialized, and they need to be reduced to only an array full of the activity's ID
    let arrayIdMap = selected.activities.map((item) => item.id);
    arrayIdMap.push(activityObject.id);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/itinerary/${selected.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: "activities",
            new_activity_array: arrayIdMap,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add activity to itinerary");
      }
      // temp is all itineraries, but with the selected itinerary being modified with the new activity being added along with a random uuid
      let temp = itineraries.map((itin) => {
        if (itin.id === selected.id) {
          itin.activities.push({
            ...activityObject,
            uuid: crypto.randomUUID(),
          });
          return itin;
        } else {
          return itin;
        }
      });
      console.log(itineraries);
      setItineraries(temp);
      setMiniNote("Activity added to itinerary");
    } catch (err) {
      setMiniError(err.message);
    }
  }

  async function stayDeleter(stayObject) {
    setMiniError(null);
    setMiniNote(null);
    console.log(stayObject)
    itineraries.forEach((itin) => {
      if(itin.stay && stayObject.id === itin.stay.id) {
        setMiniError("Cannot delete this item as its tied to an itinerary")
        throw new Error("Failed to delete as stay is associated with an itinerary")
      }
    })
    try {
      const response = await fetch(`http://localhost:8000/api/v1/stay/${stayObject.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
      })
      if(!response.ok) {
        throw new Error("Failed to api call to delete stay from trip")
      }
      let tempStays = stays.filter((stay) => {
        return stay.id !== stayObject.id
      })

      setMiniNote("Sucessfully deleted stay")
      setStays(tempStays)
    } catch(err) {
      setMiniError(err.message)
      console.log(err)
    }
  }

  async function activityDeleter(activityObject) {
    setMiniError(null);
    setMiniNote(null);
    for(const itinerary of itineraries) {
      const activities = itinerary.activities || []
      const found = activities.find(activity => activity.id === activityObject.id)
      if(found) {
        setMiniError("Cannot delete this item as its tied to an itinerary")
        throw new Error("Failed to delete as activity is associated with an itinerary")
      } 
    }
    try {
      const response = await fetch(`http://localhost:8000/api/v1/activity/${activityObject.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
      })
      if(!response.ok) {
        throw new Error("Failed to api call to delete stay from trip")
      }
      let tempActivities = activities.filter((activity) => {
        return activity.id !== activityObject.id
      })
      setMiniNote("Sucessfully deleted activity")
      setActivities(tempActivities)
    } catch(err) {
      setMiniError(err.message)
      console.log(err)
    }
  }

  async function restaurantDeleter(activityObject) {
    setMiniError(null);
    setMiniNote(null);
    for(const itinerary of itineraries) {
      const activities = itinerary.activities || []
      const found = activities.find(activity => activity.id === activityObject.id)
      if(found) {
        setMiniError("Cannot delete this item as its tied to an itinerary")
        throw new Error("Failed to delete as activity is associated with an itinerary")
      } 
    }
    try {
      const response = await fetch(`http://localhost:8000/api/v1/activity/${activityObject.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
      })
      if(!response.ok) {
        throw new Error("Failed to api call to delete stay from trip")
      }
      let tempRestaurants = restaurants.filter((rest) => {
        return rest.id !== activityObject.id
      })
      setMiniNote("Sucessfully deleted rest")
      setRestaurants(tempRestaurants)
    } catch(err) {
      setMiniError(err.message)
      console.log(err)
    }
  }

  async function dayAdder() {
    setMiniError(null);
    setMiniNote(null);
    // This will add an itinerary object instance
    try {
      const prevDate = itineraries[itineraries.length - 1].date;
      const newDate = addOneDay(prevDate);
      const response = await fetch(`http://localhost:8000/api/v1/itinerary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: newDate,
          trip_id: trip_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add itinerary day");
      }
      // After sucessfully adding an itinerary, need to update trip
      // +1 to duration and edit end_date on trip model to reflect the newly created itinerary instance date
      const response2 = await fetch(
        `http://localhost:8000/api/v1/trip/${trip_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            end_date: newDate,
            duration: itineraries.length + 1,
          }),
        }
      );
      if (!response2.ok) {
        throw new Error("Failed to update trip dates or duration");
      }
      // Data should be the object that was just created to append to frontend reactivity
      const data = await response.json();
      setItineraries((prev) => [...prev, data]);
      setMiniNote(`Sucessfully added itinerary on date: ${newDate}`);
    } catch (err) {
      setMiniError(err.message);
      console.log(err.message);
    }
  }

  async function dayRemover() {
    setMiniError(null);
    setMiniNote(null);
    // Remove from Itinerary_app
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/itinerary/${
          itineraries[itineraries.length - 1].id
        }/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove itinerary day");
      }
      // Update Trip_App to match correct end_date and duration after sucessfull above response
      const response2 = await fetch(
        `http://localhost:8000/api/v1/trip/${trip_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            end_date: itineraries[itineraries.length - 2].date,
            duration: itineraries.length - 1,
          }),
        }
      );
      if (!response2.ok) {
        throw new Error("Failed to update trip dates or duration");
      }
      setItineraries((prev) => prev.slice(0, -1));
      setMiniNote(`Sucessfully removed last itinerary`);
    } catch (err) {
      setMiniError(err.message);
      console.log(err.message);
    }
  }

  // redirects a user to the explore page for that trip
  const handleRedirect = () => {
    navigate(`/explore/${trip_id}`, { replace: true });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      // fetchTrip is in TripViewPageUtils
      await Promise.all([fetchTrip(trip_id, setError, setTrip), fetchItineraries(), fetchAll()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  return (
    <div className="flex flex-col h-dvh items-center justify-center px-2 select-none text-[#00005A]">
      {isLoading ? (
        <Grid size="75" speed="1.5" color="black" />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center rounded-xl h-16 text-5xl bg-white text-[#00005A]">
                {trip.name}
              </div>
              <div className="flex justify-center items-center h-10">
                <button onClick={() => handleRedirect()} className="h-10 w-36 button-background text-center border-2 border-black text-white hover:bg-[#091A55] transition">
                  <div className="flex justify-center items-center">Explore {trip.city}</div>
                </button>
              </div>
              <div className="flex justify-center items-center h-8">
                {miniError ? (
                  <div className="text-red-400 mb-0">{miniError}</div>
                ) : null}
                {miniNote ? (
                  <div className="text-green-400 mb-0">{miniNote}</div>
                ) : null}
              </div>
            </div>
          </div>
          <div className=" flex items-center justify-center w-full h-84">
            <div className="flex flex-col items-center h-full w-full border-l-4 border-t-4 border-b-4 border-[#B2A9CF] rounded-l-md overflow-y-auto">
              <div className="text-xl font-semibold text-[#00005A] border-b border-[#B2A9CF] mb-2">
                Stays
              </div>
              {stays ? (
                stays.map((stay) => {
                  return (
                    <PotluckPlacardComponent
                      activityObject={stay}
                      stayDeleter={stayDeleter}
                      key={stay.id}
                      stayAdder={stayAdder}
                    />
                  );
                })
              ) : (
                <div className="text-[#091A55]">
                  No stays added, add some by exploring the explore page
                </div>
              )}
            </div>

            <div className="flex flex-col items-center h-full w-full border-4 border-[#B2A9CF] overflow-y-auto">
              <div className="text-xl font-semibold text-[#00005A] border-b border-[#B2A9CF] mb-2">
                Restaurants/Food
              </div>
              {restaurants ? (
                restaurants.map((restaurant) => {
                  return (
                    <PotluckPlacardComponent
                      activityObject={restaurant}
                      activityAdder={activityAdder}
                      activityDeleter={restaurantDeleter}
                      key={restaurant.uuid}
                    />
                  );
                })
              ) : (
                <div className="text-[#091A55]">
                  No restaurants added, add some by exploring the explore page
                </div>
              )}
            </div>

            <div className="flex flex-col items-center h-full w-full border-r-4 border-t-4 border-b-4 border-[#B2A9CF] rounded-r-md overflow-y-auto">
              <div className="text-xl font-semibold text-[#00005A] border-b border-[#B2A9CF] mb-2">
                Activities
              </div>
              {activities ? (
                activities.map((activity) => {
                  return (
                    <PotluckPlacardComponent
                      activityObject={activity}
                      activityAdder={activityAdder}
                      activityDeleter={activityDeleter}
                      key={activity.uuid}
                    />
                  );
                })
              ) : (
                <div className="text-[#00005A]">
                  No activities added, add some by exploring the explore page
                </div>
              )}
            </div>
          </div>
          <div className="flex h-16 items-center justify-center">
            {/* Day Remover button DISABLED when only 1 ticket left */}
            <button
              onClick={() => dayRemover()}
              disabled={itineraries.length > 1 ? false : true}
              className="flex items-center justify-center add-sub-button shrink-0 hover:cursor-pointer h-12 w-12"
            >
              <img
                src="/subtractCircle.svg"
                alt="circle"
                className="rounded-full h-12 w-12"
              />
            </button>
            <button
              onClick={() => dayAdder()}
              className="flex items-center justify-center add-sub-button shrink-0 hover:cursor-pointer h-12 w-12"
            >
              <img 
                src="/addCircle.svg" 
                alt="circle" 
                className="rounded-full h-12 w-12" 
              />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 w-full h-84 border-2 rounded-md p-1 border-[#B2A9CF] overflow-y-auto">
            {itineraries ? (
              <>
                {itineraries.map((item) => {
                  return (
                    <div
                      className={`border-3 rounded-xl ${
                        selected === item
                          ? "border-[#0DCAF0]"
                          : "border-[#00005A]"
                        } h-full`}
                      onClick={() => setterSelector(item)}
                      key={item.id}
                    >
                      <ItineraryTicketComponent
                        ticket={item}
                        itineraries={itineraries}
                        setItineraries={setItineraries}
                        setMiniError={setMiniError}
                        setMiniNote={setMiniNote}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-[#00005A]">No itineraries/days</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
