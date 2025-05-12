import { AutocompleteTripComponent } from "../components/AutocompleteComponent";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../App.css";
import { formatTrip } from "../utilities/TripPageUtils";
import { Pencil, Trash2 } from "lucide-react";

// Get the user's auth token from localStorage
const token = localStorage.getItem("token");

export const TripsPage = () => {
  const navigate = useNavigate();

  // All trips for the current user
  const [userTrips, setUserTrips] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      console.log(token)
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
    console.log(userTrips)
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
  const loadTrips = async () => {
    try {
      setLoading(true);
      await fetchTrips();
    } catch (err) {
      console.error("Failed to load trips:", err);
    } finally {
      setLoading(false);
    }
  };

  loadTrips();
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
    console.log(token);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/trip/",
        newTrip,
        {
          headers: {
            Authorization: `Token ${token}`,
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
      await axios.put(
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

  // CREATING TRIP COMMENT FOR TIM TO SYNC UP

  const visitTripView = (trip) => {
    navigate(`/tripview/${trip.id}`, { replace: true });
  };

  if (loading) return <span>Loading...</span>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <button onClick={handleNewTrip}>Start new trip</button>

      {/* Trip List */}
      <div className="flex justify-center">
        <div className="flex flex-row gap-4 p-3 w-[90vw]">
          {userTrips.length === 0 ? (
            <p>No Trips available.</p>
          ) : (
            <ul className="flex flex-wrap justify-center gap-4 list-none p-0">
              {userTrips.map((trip) => (
                <li
                  key={trip.id}
                  className="flex flex-col border border-gray-300 p-2 rounded-lg shadow-sm"
                >
                  {editingTripId === trip.id ? (
                    <>
                      <input
                        type="text"
                        value={editedTripName}
                        onChange={(e) => setEditedTripName(e.target.value)}
                        className="border p-2 rounded"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(trip.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-300 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <button
                          onClick={() => startEditing(trip)}
                          className="edit-trip w-[15%] h-[100%] rounded flex items-center justify-center"
                        >
                          <Pencil size={10} color="black"/>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trip)}
                          className="del-trip w-[15%] h-[100%] mb-1 text-white text-sm rounded flex items-center justify-center"
                        >
                          <Trash2 size={10} color="black"/>
                        </button>
                      </div>
                      <span className="trip-name text-center text-[1.75em] font-semibold">
                        {trip.name}
                      </span>
                      <span className="trip-location text-center text-[1em] font-semibold">
                        {trip.city}, {trip.country}
                      </span>
                      <span className="trip-duration text-center text-[.75em] font-semibold">
                        Duration: {trip.duration} days
                      </span>
                      <div className="flex justify-center items-center gap-2 mt-2">
                        <button
                          onClick={() => visitTripView(trip)}
                          className="w-[40%] h-[50%] px-4 py-2 bg-yellow-400 rounded flex items-center justify-center"
                        >
                          <span className="visit-trip-page text-[.75em] whitespace-nowrap">
                            Trip Details
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Deletion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md text-center">
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{tripDelete?.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
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