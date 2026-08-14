import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getReservationsForUser, cancelReservation } from "../lib/storage";
import "./Dashboard.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState(() => getReservationsForUser(user.id));

  function handleCancel(id) {
    cancelReservation(id);
    setReservations(getReservationsForUser(user.id));
  }

  const upcoming = reservations.filter((r) => r.status === "confirmed");
  const cancelled = reservations.filter((r) => r.status === "cancelled");

  return (
    <section className="section">
      <div className="container">
        <div className="dash__head">
          <div>
            <span className="eyebrow">My account</span>
            <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          </div>
          <Link to="/trips" className="btn btn--gold">Book another trip</Link>
        </div>

        <div className="dash__profile card">
          <div><span>Name</span><strong>{user.name}</strong></div>
          <div><span>Email</span><strong>{user.email}</strong></div>
          <div><span>Phone</span><strong>{user.phone || "Not provided"}</strong></div>
        </div>

        <h2 className="dash__section-title">Your reservations</h2>
        {upcoming.length === 0 ? (
          <div className="card dash__empty">
            <p>You haven't reserved a trip yet.</p>
            <Link to="/trips" className="btn btn--primary">Browse trips</Link>
          </div>
        ) : (
          <div className="dash__list">
            {upcoming.map((r) => (
              <div key={r.id} className="card dash__row">
                <div>
                  <span className="badge">Confirmed</span>
                  <h3>{r.tripTitle}</h3>
                  <p>{formatDate(r.departure)} · {r.travelers} traveler{r.travelers > 1 ? "s" : ""} · ${r.total}</p>
                  {r.notes && <p className="dash__notes">Note: {r.notes}</p>}
                </div>
                <button className="btn btn--outline btn--sm" onClick={() => handleCancel(r.id)}>
                  Cancel reservation
                </button>
              </div>
            ))}
          </div>
        )}

        {cancelled.length > 0 && (
          <>
            <h2 className="dash__section-title">Cancelled</h2>
            <div className="dash__list">
              {cancelled.map((r) => (
                <div key={r.id} className="card dash__row dash__row--cancelled">
                  <div>
                    <span className="badge dash__badge-cancelled">Cancelled</span>
                    <h3>{r.tripTitle}</h3>
                    <p>{formatDate(r.departure)} · {r.travelers} traveler{r.travelers > 1 ? "s" : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
