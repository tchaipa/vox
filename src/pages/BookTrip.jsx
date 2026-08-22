import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTripById } from "../data/trips";
import { useAuth } from "../context/AuthContext";
import { createReservation } from "../lib/storage";
import "./BookTrip.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BookTrip() {
  const { id } = useParams();
  const trip = getTripById(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  if (!trip) {
    return (
      <div className="container section">
        <h2>Trip not found</h2>
        <Link to="/trips" className="btn btn--gold">
          Back to all trips
        </Link>
      </div>
    );
  }

  const maxTravelers = Math.min(trip.seatsLeft, 6);
  const total = travelers * trip.price;

  async function handleSubmit(ev) {
    ev.preventDefault();
    const reservation = await createReservation({
      userId: user.id,
      tripId: trip.id,
      tripTitle: trip.title,
      departure: trip.departure,
      travelers,
      pricePerPerson: trip.price,
      total,
      notes: notes.trim(),
    });
    setConfirmed(reservation);
  }

  if (confirmed) {
    return (
      <section className="section">
        <div className="container">
          <div className="card confirm">
            <span className="badge">Reservation confirmed</span>
            <h1>You're booked on {trip.title}.</h1>
            <p>
              A confirmation has been saved to your account. Reference:{" "}
              <strong>{confirmed.id}</strong>
            </p>
            <div className="confirm__details">
              <div>
                <span>Departs</span>
                <strong>{formatDate(trip.departure)}</strong>
              </div>
              <div>
                <span>Travelers</span>
                <strong>{travelers}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>${total}</strong>
              </div>
            </div>
            <div className="confirm__actions">
              <Link to="/dashboard" className="btn btn--primary">
                View my trips
              </Link>
              <Link to="/trips" className="btn btn--outline">
                Browse more trips
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container booking">
        <div className="booking__form">
          <span className="eyebroww">Reserve your seat</span>
          <h1>{trip.title}</h1>
          <p className="booking__intro">
            Departing {formatDate(trip.departure)} · {trip.duration}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="travelers">Number of travelers</label>
              <select
                id="travelers"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
              >
                {Array.from({ length: maxTravelers }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="field">
              <label htmlFor="name">Booking under</label>
              <input id="name" value={user.name} disabled />
            </div>

            <div className="field">
              <label htmlFor="email">Contact email</label>
              <input id="email" value={user.email} disabled />
            </div>

            <div className="field">
              <label htmlFor="notes">
                Dietary needs or special requests (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn--primary btn--block">
              Confirm reservation — ${total}
            </button>
          </form>
        </div>

        <aside className="card booking__summary">
          <img src={trip.image} alt="" className="booking__summary-image" />
          <div className="booking__summary-body">
            <h3>{trip.title}</h3>
            <div className="booking__summary-row">
              <span>Price per person</span>
              <span>${trip.price}</span>
            </div>
            <div className="booking__summary-row">
              <span>Travelers</span>
              <span>{travelers}</span>
            </div>
            <div className="booking__summary-row booking__summary-total">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
