import { Link } from "react-router-dom";
import "./DestinationCard.css";

export default function DestinationCard({ destination }) {
  return (
    <Link to={`/destinations#${destination.id}`} className="dest-card">
      <div className="dest-card__photo">
        <img src={destination.image} alt="" loading="lazy" />
      </div>
      <div className="dest-card__body">
        <span className="eyebroww">{destination.country}</span>
        <h3>{destination.name}</h3>
        <p>{destination.blurb}</p>
      </div>
    </Link>
  );
}
