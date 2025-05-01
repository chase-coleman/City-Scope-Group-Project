import React, { useEffect, useState } from "react";
import axios from "axios";


const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  
  useEffect(() => {
    const fetchTrips = async () => {
      console.log("fetching trips!")
      try {
        const response = await axios.get("http://localhost:8000/api/v1/trip/");
        setTrips(response.data);
        setLoading(false); // end loading on success
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Unable to load trips.");
        setLoading(false); // end loading on error
      }
    };
    fetchTrips();
  }, []);
  
  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>{error}</p>;
  
  
  return (
    <div>
      <h1>All Trips</h1>
      {trips.length === 0 ? (
        <p>No trips available.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <h2>{trip.name}</h2>
              <p>{trip.city}, {trip.country}</p>
              <p>Duration: {trip.duration} days</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TripsPage;