
// Fetch the information for this trip
export const fetchTrip = async (trip_id, setError, setTrip) => {
  setError(null);
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/trip/${trip_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("failed to retrieve Trip");
    }
    const data = await response.json();
    console.log(data);
    setTrip(data);
  } catch (err) {
    setError(err.message);
    console.log(err);
  }
  }