import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPastTrips, deletePastTrip } from "../lib/storage";
import "./Dashboard.css";

export default function AdminPastTrips() {
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPastTrips();
  }, []);

  async function loadPastTrips() {
    try {
      const data = await getAllPastTrips();
      setPastTrips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this past trip?")) return;
    try {
      await deletePastTrip(id);
      setPastTrips(pastTrips.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
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
            <h1>Manage Past Trips</h1>
          </div>
          <Link to="/admin/past-trips/new" className="btn btn--gold">
            + Add past trip
          </Link>
        </div>

        {error && (
          <div className="card" style={{ color: "red" }}>
            {error}
          </div>
        )}

        {pastTrips.length === 0 ? (
          <div className="card dash__empty">
            <p>No past trips found.</p>
            <Link to="/admin/past-trips/new" className="btn btn--primary">
              Create first past trip
            </Link>
          </div>
        ) : (
          <div className="dash__list">
            {pastTrips.map((trip) => (
              <div key={trip.id} className="card dash__row">
                <div>
                  <h3>{trip.title}</h3>
                  <p>
                    {trip.date} · {trip.country} · {trip.travelers} travelers
                  </p>
                  <p style={{ fontSize: "0.9em", color: "#666" }}>
                    {trip.story}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    to={`/admin/past-trips/${trip.id}`}
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
