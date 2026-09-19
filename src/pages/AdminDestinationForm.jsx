import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createDestination,
  updateDestination,
  getDestinationByIdFromDb,
} from "../lib/storage";
import "./Dashboard.css";

export default function AdminDestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState({
    id: "",
    name: "",
    country: "",
    region: "local",
    image: "",
    blurb: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadDestination();
    }
  }, [id]);

  async function loadDestination() {
    try {
      const dest = await getDestinationByIdFromDb(id);
      setForm(dest);
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
      const destData = {
        id: form.id || form.name.toLowerCase().replace(/\s+/g, "-"),
        name: form.name,
        country: form.country,
        region: form.region,
        image: form.image,
        blurb: form.blurb,
      };

      if (isNew) {
        await createDestination(destData);
      } else {
        await updateDestination(id, destData);
      }

      navigate("/admin/destinations");
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
          <h1>{isNew ? "Add Destination" : "Edit Destination"}</h1>
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
              <label htmlFor="id">Destination ID (slug)</label>
              <input
                id="id"
                type="text"
                value={form.id}
                onChange={(e) => update("id", e.target.value)}
                placeholder="e.g., victoria-falls"
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="name">Destination Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
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
            <label htmlFor="blurb">Description</label>
            <textarea
              id="blurb"
              value={form.blurb}
              onChange={(e) => update("blurb", e.target.value)}
              rows="4"
              required
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save destination"}
            </button>
            <Link to="/admin/destinations" className="btn btn--outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
