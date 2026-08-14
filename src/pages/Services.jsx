import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import "./Services.css";

const services = [
  {
    title: "Group departures",
    desc: "Scheduled small-group trips, local and international, published with fixed dates, fixed prices and a public seat count.",
    items: ["Max 8–12 guests", "Fixed departure dates", "All-inclusive land pricing shown upfront"],
  },
  {
    title: "Custom itineraries",
    desc: "Tell us your dates, budget and interests and we'll build a private itinerary around them.",
    items: ["Private guide and vehicle", "Flexible dates", "Built around your budget"],
  },
  {
    title: "Adventure & rafting",
    desc: "Zambezi whitewater, canoe safaris and multi-day hikes, run by our own safety-certified guides.",
    items: ["Certified rafting guides", "Full safety briefing included", "Gear and permits handled"],
  },
  {
    title: "Corporate & group bookings",
    desc: "Team retreats, incentive trips and conference add-on excursions for companies based in or visiting Zimbabwe.",
    items: ["Dedicated coordinator", "Invoice billing available", "Custom group sizes"],
  },
  {
    title: "Airport & ground transfers",
    desc: "Transfers, in-country flights and border logistics booked as part of any VoxVoyager itinerary.",
    items: ["Harare & Vic Falls transfers", "Regional flight booking", "Border and permit assistance"],
  },
  {
    title: "Travel documentation help",
    desc: "Guidance on visas, park permits and travel insurance for every destination we run trips to.",
    items: ["Visa requirement checklists", "Park permit handling", "Insurance guidance"],
  },
];

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything between booking and boarding."
        description="From a single scheduled departure to a fully custom itinerary, here's what VoxVoyager handles for you."
        image="https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {services.map((s) => (
              <div key={s.title} className="card service-card">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container cta__inner">
          <div>
            <h2>Have something specific in mind?</h2>
            <p>Send us your dates and interests and we'll put a custom itinerary together.</p>
          </div>
          <Link to="/contact" className="btn btn--gold">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
