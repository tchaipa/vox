import { useState } from "react";
import PageHero from "../components/PageHero";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a person, not a ticketing queue."
        description="Reach the Harare office directly, or send a message and we'll reply within one business day."
        image="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1800&q=80"
      />

      <section className="section">
        <div className="container contact__grid">
          <div className="contact__info">
            <h2>Visit or call</h2>
            <ul>
              <li>
                <span>Office</span>
                <strong>
                  Office 13, First Floor, Bothwell House, 66 Jason Moyo Ave,
                  Harare
                </strong>
              </li>
              <li>
                <span>Phone</span>
                <strong>+263 777 032 377</strong>
              </li>
              <li>
                <span>Email</span>
                <strong>voxvoyager@gmail.com</strong>
              </li>
              <li>
                <span>Hours</span>
                <strong>Mon–Fri, 8am–5pm CAT</strong>
              </li>
            </ul>
          </div>

          <div className="card contact__form">
            {sent ? (
              <div className="contact__sent">
                <span className="badge">Message sent</span>
                <h3>Thanks, {form.name.split(" ")[0] || "there"}.</h3>
                <p>
                  We'll get back to you at {form.email} within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="c-name">Name</label>
                  <input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-message">Message</label>
                  <textarea
                    id="c-message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn--primary btn--block">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
