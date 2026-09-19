import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTrips, deleteTrip } from "../lib/storage";
import "./Dashboard.css";

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await getAllTrips();
      setTrips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this trip?")) return;
    try {
      await deleteTrip(id);
      setTrips(trips.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading)
    return (
      <div className="container section">
        <p>Loading...</p>
      </div>
    );

  return (
    <section className="section">
      <div className="container">
        <div className="dash__head">
          <div>
            <span className="eyebrow">Admin</span>
            <h1>Manage Trips</h1>
          </div>
          <Link to="/admin/trips/new" className="btn btn--gold">
            + Add trip
          </Link>
        </div>

        {error && (
          <div className="card" style={{ color: "red" }}>
            {error}
          </div>
        )}

        {trips.length === 0 ? (
          <div className="card dash__empty">
            <p>No trips found.</p>
            <Link to="/admin/trips/new" className="btn btn--primary">
              Create first trip
            </Link>
          </div>
        ) : (
          <div className="dash__list">
            {trips.map((trip) => (
              <div key={trip.id} className="card dash__row">
                <div>
                  <h3>{trip.title}</h3>
                  <p>
                    {formatDate(trip.departure)} · {trip.duration} · $
                    {trip.price} per person
                  </p>
                  <p style={{ fontSize: "0.9em", color: "#666" }}>
                    {trip.country} · {trip.seatsLeft} seats available
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    to={`/admin/trips/${trip.id}`}
                    className="btn btn--outline btn--sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn--outline btn--sm"
                    style={{ borderColor: "#d32f2f", color: "#d32f2f" }}
                    onClick={() => handleDelete(trip.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <Link to="/admin" className="btn btn--outline">
            ← Back to admin
          </Link>
        </div>
      </div>
    </section>
  );
}
