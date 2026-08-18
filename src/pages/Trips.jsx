import { useMemo, useState } from "react";
import { trips } from "../data/trips";
import TicketCard from "../components/TicketCard";
import PageHero from "../components/PageHero";
import "./Trips.css";

export default function Trips() {
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("date");

  const filtered = useMemo(() => {
    let list = trips.filter((t) => region === "all" || t.region === region);
    list = [...list].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      return new Date(a.departure) - new Date(b.departure);
    });
    return list;
  }, [region, sort]);

  return (
    <>
      <PageHero
        eyebrow="Upcoming trips"
        title="Every scheduled departure, one page."
        description="Fixed dates, fixed prices, published seat counts. Reserve online once you're logged in."
        image="https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=1800&q=80"
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
                All trips
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

            <label className="trips__sort">
              <span>Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date">Departure date</option>
                <option value="price">Price, low to high</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="trips__empty">
              No trips match that filter right now — check back soon or try
              another region.
            </p>
          ) : (
            <div className="grid grid--3">
              {filtered.map((t) => (
                <TicketCard key={t.id} trip={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
