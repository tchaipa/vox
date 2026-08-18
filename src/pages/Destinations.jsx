import { useState } from "react";
import { destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import PageHero from "../components/PageHero";
import "./Trips.css";

export default function Destinations() {
  const [region, setRegion] = useState("all");
  const filtered = destinations.filter(
    (d) => region === "all" || d.region === region,
  );

  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="Where VoxVoyager actually operates."
        description="Every place on this list is somewhere we run repeat trips to, not a country we're testing out."
        image="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="trips__toolbar">
            <div
              className="trips__filters"
              role="group"
              aria-label="Filter by region"
            >
              <button
                className={region === "all" ? "is-active" : ""}
                onClick={() => setRegion("all")}
              >
                All
              </button>
              <button
                className={region === "local" ? "is-active" : ""}
                onClick={() => setRegion("local")}
              >
                Local
              </button>
              <button
                className={region === "international" ? "is-active" : ""}
                onClick={() => setRegion("international")}
              >
                International
              </button>
            </div>
          </div>

          <div className="grid grid--3">
            {filtered.map((d) => (
              <div id={d.id} key={d.id}>
                <DestinationCard destination={d} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
