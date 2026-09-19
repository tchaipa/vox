import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createPastTrip,
  updatePastTrip,
  getPastTripByIdFromDb,
} from "../lib/storage";
import "./Dashboard.css";

export default function AdminPastTripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState({
    id: "",
    title: "",
    date: "",
    country: "",
    travelers: "",
    image: "",
    story: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadPastTrip();
    }
  }, [id]);

  async function loadPastTrip() {
    try {
      const trip = await getPastTripByIdFromDb(id);
      setForm(trip);
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
        date: form.date,
        country: form.country,
        travelers: parseInt(form.travelers),
        image: form.image,
        story: form.story,
      };

      if (isNew) {
        await createPastTrip(tripData);
      } else {
        await updatePastTrip(id, tripData);
      }

      navigate("/admin/past-trips");
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
          <h1>{isNew ? "Add Past Trip" : "Edit Past Trip"}</h1>
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
                placeholder="e.g., victoria-falls-2026-04"
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="title">Trip Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="text"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              placeholder="e.g., April 2026"
              required
            />
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
            <label htmlFor="travelers">Number of Travelers</label>
            <input
              id="travelers"
              type="number"
              value={form.travelers}
              onChange={(e) => update("travelers", e.target.value)}
              required
            />
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
            <label htmlFor="story">Trip Story</label>
            <textarea
              id="story"
              value={form.story}
              onChange={(e) => update("story", e.target.value)}
              rows="5"
              required
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save past trip"}
            </button>
            <Link to="/admin/past-trips" className="btn btn--outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
