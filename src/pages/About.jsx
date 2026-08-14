import PageHero from "../components/PageHero";
import "./About.css";

const team = [
  {
    name: "Tendai Murwira",
    role: "Founder & Lead Guide",
    note: "13 years guiding in Hwange and Mana Pools before starting VoxVoyager.",
  },
  {
    name: "Rutendo Chikafu",
    role: "Operations Manager",
    note: "Runs bookings, logistics and lodge partnerships out of the Harare office.",
  },
  {
    name: "Simba Nyoni",
    role: "Rafting & Adventure Lead",
    note: "Zambezi raft guide and safety lead for every whitewater departure.",
  },
  {
    name: "Farai Moyo",
    role: "International Trips Coordinator",
    note: "Builds and vets every itinerary outside Zimbabwe before it's sold.",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About VoxVoyager"
        title="Started by guides, not by a booking algorithm."
        description="We're a Harare-based travel agency that plans and personally runs small-group trips across Zimbabwe and the wider region."
        image="https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1800&q=80"
      />

      <section className="section">
        <div className="container about__story">
          <div>
            <span className="eyebroww">Our story</span>
            <h2>Founded on the Zambezi, built out from there.</h2>
            <p>
              VoxVoyager started in 2018 when a small group of Zimbabwean safari
              and rafting guides began organising trips directly for travellers,
              instead of subcontracting through overseas agencies. The idea was
              simple: guests get guides who've actually spent years in these
              places, and more of what a trip costs stays in the communities
              that host it.
            </p>
            <p>
              Since then we've grown from Zambezi rafting weekends into a full
              calendar of local and international departures — but we've kept
              every group small and every itinerary built by someone who has run
              it before.
            </p>
          </div>
          <div className="about__figures card">
            <div>
              <span className="about__figure-num">2018</span>
              <span>Founded in Harare</span>
            </div>
            <div>
              <span className="about__figure-num">60+</span>
              <span>Departures run per year</span>
            </div>
            <div>
              <span className="about__figure-num">9</span>
              <span>Countries visited</span>
            </div>
            <div>
              <span className="about__figure-num">12</span>
              <span>Max guests per group</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <span className="eyebrow">What we hold ourselves to</span>
          <h2>Three commitments</h2>
          <div className="grid grid--3 about__values">
            <div>
              <h4>Guides who've done it</h4>
              <p>
                Every trip is led by a guide with years of hands-on experience
                in that specific place.
              </p>
            </div>
            <div>
              <h4>Honest group sizes</h4>
              <p>
                We publish real seat counts and stop selling a departure once
                it's full — no overbooking.
              </p>
            </div>
            <div>
              <h4>Money that stays local</h4>
              <p>
                We work directly with regional lodges, guides and operators
                rather than international resellers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebroww">The team</span>
          <h2>Who you'll actually meet</h2>
          <div className="grid grid--3 about__team">
            {team.map((person) => (
              <div key={person.name} className="card about__person">
                <h4>{person.name}</h4>
                <span className="badge">{person.role}</span>
                <p>{person.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
