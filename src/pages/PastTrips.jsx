import { pastTrips } from "../data/pastTrips";
import PageHero from "../components/PageHero";
import "./PastTrips.css";

export default function PastTrips() {
  return (
    <>
      <PageHero
        eyebrow="Past trips"
        title="A running record, not a highlight reel."
        description="A selection of departures we've completed — proof the itineraries on this site actually happen."
        image="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="past-grid">
            {pastTrips.map((p) => (
              <article key={p.id} className="past-card card">
                <div className="past-card__photo">
                  <img src={p.image} alt="" loading="lazy" />
                  <span className="badge past-card__date">{p.date}</span>
                </div>
                <div className="past-card__body">
                  <span className="eyebroww">
                    {p.country} · {p.travelers} travelers
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.story}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
