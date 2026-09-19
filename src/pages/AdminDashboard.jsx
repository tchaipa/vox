import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <section className="section">
      <div className="container">
        <div className="dash__head">
          <div>
            <span className="eyebrow">Admin Panel</span>
            <h1>Welcome, {user.name}</h1>
          </div>
        </div>

        <div className="dash__profile card">
          <p>
            You're logged in as an administrator. Use the tools below to manage
            site content.
          </p>
        </div>

        <h2 className="dash__section-title">Content Management</h2>
        <div className="dash__list">
          <div className="card dash__row">
            <div>
              <h3>Manage Trips</h3>
              <p>
                Create, edit, and delete upcoming trips. Update prices, dates,
                and availability.
              </p>
            </div>
            <Link to="/admin/trips" className="btn btn--primary btn--sm">
              Edit trips
            </Link>
          </div>

          <div className="card dash__row">
            <div>
              <h3>Manage Destinations</h3>
              <p>
                Add or update destination information, images, and descriptions.
              </p>
            </div>
            <Link to="/admin/destinations" className="btn btn--primary btn--sm">
              Edit destinations
            </Link>
          </div>

          <div className="card dash__row">
            <div>
              <h3>Manage Past Trips</h3>
              <p>Add trip reports and stories from completed tours.</p>
            </div>
            <Link to="/admin/past-trips" className="btn btn--primary btn--sm">
              Edit past trips
            </Link>
          </div>
        </div>

        <h2 className="dash__section-title">Quick Links</h2>
        <div className="dash__list">
          <div className="card dash__row">
            <div>
              <h3>View Site</h3>
              <p>
                Visit the main website to see how your changes look to
                customers.
              </p>
            </div>
            <Link to="/" className="btn btn--outline btn--sm">
              Go to site
            </Link>
          </div>

          <div className="card dash__row">
            <div>
              <h3>User Dashboard</h3>
              <p>View your account and reservations.</p>
            </div>
            <Link to="/dashboard" className="btn btn--outline btn--sm">
              My dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
