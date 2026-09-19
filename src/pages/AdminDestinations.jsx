import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDestinations, deleteDestination } from "../lib/storage";
import "./Dashboard.css";

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDestinations();
  }, []);

  async function loadDestinations() {
    try {
      const data = await getAllDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this destination?")) return;
    try {
      await deleteDestination(id);
      setDestinations(destinations.filter((d) => d.id !== id));
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
            <h1>Manage Destinations</h1>
          </div>
          <Link to="/admin/destinations/new" className="btn btn--gold">
            + Add destination
          </Link>
        </div>

        {error && (
          <div className="card" style={{ color: "red" }}>
            {error}
          </div>
        )}

        {destinations.length === 0 ? (
          <div className="card dash__empty">
            <p>No destinations found.</p>
            <Link to="/admin/destinations/new" className="btn btn--primary">
              Create first destination
            </Link>
          </div>
        ) : (
          <div className="dash__list">
            {destinations.map((dest) => (
              <div key={dest.id} className="card dash__row">
                <div>
                  <h3>{dest.name}</h3>
                  <p>
                    {dest.country} · {dest.region}
                  </p>
                  <p style={{ fontSize: "0.9em", color: "#666" }}>
                    {dest.blurb}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    to={`/admin/destinations/${dest.id}`}
                    className="btn btn--outline btn--sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn--outline btn--sm"
                    style={{ borderColor: "#d32f2f", color: "#d32f2f" }}
                    onClick={() => handleDelete(dest.id)}
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
