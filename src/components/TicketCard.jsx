import { Link } from "react-router-dom";
import "./TicketCard.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TicketCard({ trip }) {
  const code = trip.id.slice(0, 3).toUpperCase();
  const low = trip.seatsLeft <= 5;

  return (
    <Link to={`/trips/${trip.id}`} className="ticket">
      <div className="ticket__photo">
        <img src={trip.image} alt="" loading="lazy" />
        <span className="ticket__region">
          {trip.region === "local" ? "Zimbabwe" : trip.country}
        </span>
      </div>

      <div className="ticket__stub">
        <div className="ticket__stub-main">
          <span className="eyebroww">{trip.duration}</span>
          <h3>{trip.title}</h3>
          <p className="ticket__summary">{trip.summary}</p>
        </div>

        <div className="ticket__perf" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className="ticket__data">
          <div>
            <span className="ticket__label">Code</span>
            <span className="ticket__value">
              {code}-{trip.duration.split(" ")[0]}
            </span>
          </div>
          <div>
            <span className="ticket__label">Departs</span>
            <span className="ticket__value">{formatDate(trip.departure)}</span>
          </div>
          <div>
            <span className="ticket__label">From</span>
            <span className="ticket__value ticket__value--price">
              ${trip.price}
            </span>
          </div>
        </div>

        {low && (
          <span className="ticket__low">Only {trip.seatsLeft} seats left</span>
        )}
      </div>
    </Link>
  );
}
