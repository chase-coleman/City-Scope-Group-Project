import { AutocompleteTripComponent } from "../components/AutocompleteComponent"
import { useOutletContext } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import "../App.css";
import { getTripDuration } from "../Utilities/TripPageUtils";

const TripsPage = () => {
  const { userTrips, fetchTrips } = useOutletContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTripData, setNewTripData] = useState({
    name: '',
    location:'',
    dates: '',
  })

  // duration: getTripDuration(newTripData.dates)


  // use effect runs the loading text for 1 second before setting it to false
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  
  const handleNewTrip = () => {
    console.log("creating new trip!");
    console.log(newTripData)
  };


  if (loading) return <span>loading...</span>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <h1>All Trips</h1>
      <button onClick={handleNewTrip}>Start new trip</button>
      {trips.length === 0 ? (
        <p>No trips available.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
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
      <div className="new-trip-info border-2 w-[50%] h-[50vh]">
        <input type="text" className="border-2" 
        placeholder="Trip Name" value={newTripData.name}
        onChange={(e) => setNewTripData(prev => ({...prev, name:e.target.value}))}
        />
        <div className="border-2">
        <AutocompleteTripComponent 
        value={newTripData.location}
        setNewTripData={setNewTripData}/>
        </div>
        <div className="border-2">
        <Calendar value={newTripData.dates} placeholder="Dates" selectionMode="range" 
        readOnlyInput hideOnRangeSelection 
        onChange={(e) => setNewTripData(prev => ({...prev, dates: e.value}))}/>  
        </div>
        <Button variant="primary" onClick={handleNewTrip}>Create Trip</Button>
      </div>
    </div>
  );
};

export default TripsPage;
