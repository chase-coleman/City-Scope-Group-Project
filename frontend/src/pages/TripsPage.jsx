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

export const TripsPage = () => {
  const token = localStorage.getItem("token");
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
    geometry:{}
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
    if(!token) return
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
        console.log(response)
        createItineraries(response)
        fetchTrips(); // Reload list
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  // this function will auto create an itinerary for Day #1 of the trip so that the user doesn't have to
  const createItineraries = async (newTrip) => {
    const tripId = newTrip.data.id
    const response = await axios.post("http://localhost:8000/api/v1/itinerary/", 
      {"trip_id": tripId,
        "date": newTrip.data.start_date
      }, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      console.log(response)
  }

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

  const visitTripView = (trip) => {
    navigate(`/tripview/${trip.id}`, { replace: true });
  };

  if (loading) return <span>Loading...</span>;
  if (error) return <p>{error}</p>;

  return (
    <div className="py-2">
      <div className="flex w-full justify-center">
      <button  className="button-background text-center text-white p-1 " onClick={handleNewTrip}>Start New Trip</button>
      </div>
      {/* Trip List */}
        <div className="flex flex-wrap gap-4 p-3 w-full">
          {userTrips.length === 0 ? (
            <p>No Trips available.</p>
          ) : (
            <div className="flex flex-wrap w-full justify-center gap-2 list-none p-0">
              {userTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="trip-card bg-[#00005A] !text-white flex flex-col w-64 border border-gray-300 p-2 rounded-lg shadow-sm"
                >
                  {editingTripId === trip.id ? (
                    <>
                      <input
                        type="text"
                        value={editedTripName}
                        onChange={(e) => setEditedTripName(e.target.value)}
                        className="border p-2 rounded"
                      />
                      
                      <div className="flex justify-center gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(trip.id)}
                          className="button-background px-4 py-2 bg-blue-500 text-white rounded"
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
                          <Pencil size={10} color="white"/>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trip)}
                          className="del-trip w-[15%] h-[100%] mb-1 text-white text-sm rounded flex items-center justify-center"
                        >
                          <Trash2 size={10} color="white"/>
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
                          className="button-background w-[40%] h-[50%] p-2 rounded flex items-center justify-center"
                        >
                          <span className="visit-trip-page text-[.75em] text-white whitespace-nowrap">
                            Trip Details
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-[#00005A] p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl text-white font-bold mb-4 text-center">Create New Trip</h2>
            <input
              type="text"
              className="border w-full p-2 mb-3 bg-white"
              placeholder="Trip Name"
              value={newTripData.name}
              onChange={(e) => setNewTripData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <div className="mb-3">
              <AutocompleteTripComponent value={newTripData.location} setNewTripData={setNewTripData} />
            </div>
            <div className="mb-3">
              <Calendar
                value={newTripData.dates}
                placeholder="Select a start date"
                readOnlyInput
                hideOnRangeSelection
                onChange={(e) => setNewTripData((prev) => ({ ...prev, dates: e.value }))}
                className="w-full bg-white"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={handleTripCreation} className=" button-background px-4 py-2 bg-green-600 text-white rounded">Create Trip</button>
              <button onClick={() => setShowNewTripForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};