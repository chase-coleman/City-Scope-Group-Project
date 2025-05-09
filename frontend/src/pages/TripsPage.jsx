import { AutocompleteTripComponent } from "../components/AutocompleteComponent";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../App.css";
import { formatTrip } from "../utilities/TripPageUtils";

// Get the user's auth token from localStorage
const token = localStorage.getItem("token");

export const TripsPage = () => {
  const navigate = useNavigate();

  // All trips for the current user
  const [userTrips, setUserTrips] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // New trip form state
  const [newTripData, setNewTripData] = useState({
    name: "",
    location: "",
    dates: "",
  });

  // State for trip deletion
  const [tripDelete, setTripDelete] = useState(null);

  // State for trip editing
  const [editingTripId, setEditingTripId] = useState(null);
  const [editedTripName, setEditedTripName] = useState("");

  // Fetch all trips for the user
  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/trip/", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setUserTrips(res.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to fetch trips. Please make sure you're logged in.");
    }
  };

  // Called when user confirms deletion in the modal
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/trip/${tripDelete.id}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      fetchTrips(); // Refresh list after deletion
      setShowModal(false);
      setTripDelete(null);
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  // Called on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      fetchTrips();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Begin trip creation form
  const handleNewTrip = () => {
    setShowNewTripForm(true);
  };

  // Submit new trip to backend
  const handleTripCreation = () => {
    const trip = formatTrip(newTripData);
    createTrip(trip);
    setShowNewTripForm(false);
  };

  const createTrip = async (newTrip) => {
    console.log(token)
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
      if (response.status === 201) {
        fetchTrips(); // Reload list
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  // Handle trip deletion click
  const handleDeleteClick = (trip) => {
    setTripDelete(trip);
    setShowModal(true);
  };

  // Begin editing a trip name
  const startEditing = (trip) => {
    setEditingTripId(trip.id);
    setEditedTripName(trip.name);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTripId(null);
    setEditedTripName("");
  };

  // Save the new trip name to backend
  const handleSaveEdit = async (tripId) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/trip/${tripId}/`,
        { name: editedTripName },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      cancelEdit();
      fetchTrips(); // Reload with updated name
    } catch (err) {
      console.error("Error updating trip name:", err);
    }
  };

  if (loading) return <span>Loading...</span>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>All Trips</h1>
      <button onClick={handleNewTrip}>Start new trip</button>

      {/* Trip List */}
      {userTrips.length === 0 ? (
        <p>No Trips available.</p>
      ) : (
        <ul>
          {userTrips.map((trip) => (
            <li key={trip.id}>
              {/* If editing this trip, show an input */}
              {editingTripId === trip.id ? (
                <>
                  <input
                    type="text"
                    value={editedTripName}
                    onChange={(e) => setEditedTripName(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(trip.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <h2>{trip.name}</h2>
                  <p>{trip.city}, {trip.country}</p>
                  <p>Duration: {trip.duration} days</p>
                  <button onClick={() => startEditing(trip)}>Edit Trip</button>
                  <button onClick={() => handleDeleteClick(trip)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Deletion Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              Are you sure you want to delete{" "}
              <strong>{tripDelete?.name}</strong>?
            </p>
            <button onClick={confirmDelete}>Yes, Delete</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* New Trip Form */}
      {showNewTripForm && (
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
      )}
    </div>
  );
};
