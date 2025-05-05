import { AutocompleteTripComponent } from "../components/AutocompleteComponent";
import { useOutletContext } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../App.css";
import { formatTrip } from "../Utilities/TripPageUtils";
const token = localStorage.getItem("token");

export const TripsPage = () => {
  const { userTrips, fetchTrips } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewTripForm, setShowNewTripForm] = useState(false)
  const [newTripData, setNewTripData] = useState({
    name: "",
    location: "",
    dates: "",
  });

  // use effect runs the loading text for 1 second before setting it to false
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // when start new trip button pressed, render the new trip form
  const handleNewTrip = () => {
    setShowNewTripForm(true);
  };
  
  // handle the getting of data and processing formatting
  const handleTripCreation = () => {
    const trip = formatTrip(newTripData); // in the util's file
    createTrip(trip);
    setShowNewTripForm(false)
  }



  // make the axios call to create the trip in the backend
  const createTrip = async (newTrip) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/trip/",
        newTrip,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        fetchTrips();
      }
    } catch (error) {
      console.error("Error:".error);
    }
  };

  if (loading) return <span>loading...</span>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <h1>All Trips</h1>
      <button onClick={handleNewTrip}>Start new trip</button>
      {userTrips.length === 0 ? (
        <p>No Trips available.</p>
      ) : (
        <ul>
          {userTrips.map((trip) => (
            <li key={trip.id}>
              <h2>{trip.name}</h2>
              <p>
                {trip.city}, {trip.country}
              </p>
              <p>Duration: {trip.duration} days</p>
            </li>
          ))}
        </ul>
      )}
      {showNewTripForm ?
      <div className="new-trip-info border-2 w-[50%] h-[50vh]">
        <input
          type="text"
          className="border-2"
          placeholder="Trip Name"
          value={newTripData.name}
          onChange={(e) =>
            setNewTripData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <div className="border-2">
          <AutocompleteTripComponent
            value={newTripData.location}
            setNewTripData={setNewTripData}
          />
        </div>
        <div className="border-2">
          <Calendar
            value={newTripData.dates}
            placeholder="Dates"
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            onChange={(e) =>
              setNewTripData((prev) => ({ ...prev, dates: e.value }))
            }
          />
        </div>
        <Button variant="primary" onClick={handleTripCreation}>
          Create Trip
        </Button>
      </div>
        : null }
    </div>
  );
};

