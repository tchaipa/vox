import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createTrip, updateTrip, getTripByIdFromDb } from "../lib/storage";
import "./Dashboard.css";

export default function AdminTripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState({
    id: "",
    title: "",
    region: "local",
    country: "",
    departure: "",
    duration: "",
    price: "",
    seatsLeft: "",
    difficulty: "Moderate",
    image: "",
    summary: "",
    highlights: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadTrip();
    }
  }, [id]);

  async function loadTrip() {
    try {
      const trip = await getTripByIdFromDb(id);
      setForm({
        ...trip,
        seatsLeft: trip.seatsLeft,
        highlights: trip.highlights.join("\n"),
      });
    } catch (err) {
      setError(err.message);
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const tripData = {
        id: form.id || form.title.toLowerCase().replace(/\s+/g, "-"),
        title: form.title,
        region: form.region,
        country: form.country,
        departure: form.departure,
        duration: form.duration,
        price: parseFloat(form.price),
        seatsLeft: parseInt(form.seatsLeft),
        difficulty: form.difficulty,
        image: form.image,
        summary: form.summary,
        highlights: form.highlights.split("\n").filter((h) => h.trim()),
      };

      if (isNew) {
        await createTrip(tripData);
      } else {
        await updateTrip(id, tripData);
      }

      navigate("/admin/trips");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="dash__head">
          <h1>{isNew ? "Add Trip" : "Edit Trip"}</h1>
        </div>

        {error && (
          <div className="card" style={{ color: "red" }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="card"
          style={{ maxWidth: "600px" }}
        >
          {isNew && (
            <div className="field">
              <label htmlFor="id">Trip ID (slug)</label>
              <input
                id="id"
                type="text"
                value={form.id}
                onChange={(e) => update("id", e.target.value)}
                placeholder="e.g., victoria-falls-rafting"
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="region">Region</label>
            <select
              id="region"
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
            >
              <option value="local">Local</option>
              <option value="international">International</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="departure">Departure Date</label>
            <input
              id="departure"
              type="date"
              value={form.departure}
              onChange={(e) => update("departure", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="text"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              placeholder="e.g., 4 days / 3 nights"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="price">Price (USD)</label>
            <input
              id="price"
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="seatsLeft">Seats Available</label>
            <input
              id="seatsLeft"
              type="number"
              value={form.seatsLeft}
              onChange={(e) => update("seatsLeft", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={form.difficulty}
              onChange={(e) => update("difficulty", e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              type="url"
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              rows="3"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="highlights">Highlights (one per line)</label>
            <textarea
              id="highlights"
              value={form.highlights}
              onChange={(e) => update("highlights", e.target.value)}
              rows="5"
              placeholder="Highlight 1&#10;Highlight 2&#10;Highlight 3"
              required
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save trip"}
            </button>
            <Link to="/admin/trips" className="btn btn--outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
