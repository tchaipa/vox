import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTrips, getAllDestinations } from "../lib/storage";
import TicketCard from "../components/TicketCard";
import DestinationCard from "../components/DestinationCard";
import "./Home.css";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    Promise.all([getAllTrips(), getAllDestinations()])
      .then(([tripsData, destinationsData]) => {
        setTrips(tripsData);
        setDestinations(destinationsData);
      })
      .catch(() => {
        setTrips([]);
        setDestinations([]);
      });
  }, []);

  const featured = trips.slice(0, 3);
  const spotlightDestinations = destinations.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero__scrim" />
        <div className="container hero__content">
          <span className="eyebrow">Harare, Zimbabwe · Est. 2018</span>
          <h1>Departures written by people who've made the trip.</h1>
          <p>
            VoxVoyager plans and runs small-group travel out of Zimbabwe —
            Zambezi rapids and highland trails at home, and a shortlist of trips
            abroad we'd stand behind ourselves.
          </p>
          <div className="hero__actions">
            <Link to="/trips" className="btn btn--gold">
              See upcoming trips
            </Link>
            <Link to="/about" className="btn btn--outline-light">
              Our story
            </Link>
          </div>

          <dl className="hero__stats">
            <div>
              <dt>8</dt>
              <dd>years running trips</dd>
            </div>
            <div>
              <dt>60+</dt>
              <dd>departures a year</dd>
            </div>
            <div>
              <dt>12</dt>
              <dd>guests, max group size</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <span className="eyebroww">Boarding soon</span>
              <h2>Next departures</h2>
            </div>
            <Link to="/trips" className="btn btn--outline btn--sm">
              All trips
            </Link>
          </div>
          <div className="grid grid--3">
            {featured.map((t) => (
              <TicketCard key={t.id} trip={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark why">
        <div className="container grid grid--2 why__grid">
          <div>
            <span className="eyebrow">Why VoxVoyager</span>
            <h2>Zimbabwean-run, region-wide reach.</h2>
            <p>
              We're based in Harare and most of our guides grew up within a
              day's drive of the parks we work in. That's the difference between
              a trip built off a brochure and one built off years of actually
              being there.
            </p>
          </div>
          <ul className="why__list">
            <li>
              <span className="why__num">01</span>
              <div>
                <h4>Small groups by design</h4>
                <p>
                  Most departures cap at 8–12 guests — enough for company, not a
                  crowd.
                </p>
              </div>
            </li>
            <li>
              <span className="why__num">02</span>
              <div>
                <h4>Local guides, local margins</h4>
                <p>
                  Guides and lodges are Zimbabwean and regional wherever the
                  itinerary allows it.
                </p>
              </div>
            </li>
            <li>
              <span className="why__num">03</span>
              <div>
                <h4>Fixed, transparent pricing</h4>
                <p>
                  The price you book at is the price you pay — no add-on
                  surprises at check-in.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <span className="eyebroww">Where we go</span>
              <h2>Destinations</h2>
            </div>
            <Link to="/destinations" className="btn btn--outline btn--sm">
              All destinations
            </Link>
          </div>
          <div className="grid grid--3">
            {spotlightDestinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight cta">
        <div className="container cta__inner">
          <div>
            <h2>Ready to put a date on it?</h2>
            <p>
              Create an account, pick a departure, and reserve your seat in a
              few minutes.
            </p>
          </div>
          <div className="hero__actions">
            <Link to="/register" className="btn btn--gold">
              Create an account
            </Link>
            <Link to="/trips" className="btn btn--outline">
              Browse trips
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
