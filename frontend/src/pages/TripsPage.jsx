import { useOutletContext } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AutocompleteTripComponent } from "../components/AutocompleteComponent"

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTripData, setNewTripData] = useState({
    name: '',
    location:'',
    duration: ''
  })

  // userTrips is now loaded upon login in App.jsx so whole app can access the trips
  const { userTrips, fetchTrips } = useOutletContext();

  // use effect runs the loading text for 1 second before setting it to false
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  
  const handleNewTrip = () => {
    console.log("creating new trip!");
  };

  useEffect(() => {
    console.log(newTripData)
  }, [newTripData])

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
        <AutocompleteTripComponent 
        value={newTripData.location}
        setNewTripData={setNewTripData}/>        
      </div>
    </div>
  );
};

export default TripsPage;
