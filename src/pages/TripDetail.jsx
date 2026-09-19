import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTripByIdFromDb } from "../lib/storage";
import { useAuth } from "../context/AuthContext";
import "./TripDetail.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getTripByIdFromDb(id)
      .then(setTrip)
      .catch(() => setTrip(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container section">
        <p>Loading trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container section">
        <h2>Trip not found</h2>
        <p>That departure may have been renamed or retired.</p>
        <Link to="/trips" className="btn btn--gold">
          Back to all trips
        </Link>
      </div>
    );
  }

  function handleReserve() {
    if (!user) {
      navigate("/login", { state: { from: `/trips/${trip.id}` } });
      return;
    }
    navigate(`/book/${trip.id}`);
  }

  return (
    <>
      <div
        className="trip-detail__hero"
        style={{ backgroundImage: `url(${trip.image})` }}
      >
        <div className="trip-detail__scrim" />
        <div className="container trip-detail__hero-content">
          <span className="eyebrow">
            {trip.region === "local" ? "Zimbabwe" : trip.country}
          </span>
          <h1>{trip.title}</h1>
          <p>{trip.summary}</p>
        </div>
      </div>

      <section className="section">
        <div className="container trip-detail__grid">
          <div>
            <h2>What's included</h2>
            <ul className="trip-detail__highlights">
              {trip.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <h2>Good to know</h2>
            <p>
              This departure runs as a small group of up to {trip.seatsLeft + 4}{" "}
              guests, led by a VoxVoyager guide throughout. Difficulty is rated{" "}
              <strong>{trip.difficulty}</strong> — reach out on the{" "}
              <Link to="/contact">contact page</Link> if you'd like more detail
              before booking.
            </p>
          </div>

          <aside className="trip-detail__ticket card">
            <div className="trip-detail__ticket-row">
              <span className="ticket__label">Departs</span>
              <span className="ticket__value">
                {formatDate(trip.departure)}
              </span>
            </div>
            <div className="trip-detail__ticket-row">
              <span className="ticket__label">Duration</span>
              <span className="ticket__value">{trip.duration}</span>
            </div>
            <div className="trip-detail__ticket-row">
              <span className="ticket__label">Difficulty</span>
              <span className="ticket__value">{trip.difficulty}</span>
            </div>
            <div className="trip-detail__ticket-row">
              <span className="ticket__label">Seats left</span>
              <span className="ticket__value">{trip.seatsLeft}</span>
            </div>
            <div className="trip-detail__price">
              <span>From</span>
              <strong>${trip.price}</strong>
              <span>per person</span>
            </div>
            <button
              className="btn btn--primary btn--block"
              onClick={handleReserve}
            >
              {user ? "Reserve this trip" : "Log in to reserve"}
            </button>
            {!user && (
              <p className="trip-detail__note">
                New here? <Link to="/register">Create an account</Link> — it
                takes under a minute.
              </p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
