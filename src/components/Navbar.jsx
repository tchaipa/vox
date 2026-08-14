import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import logo from "./../assets/vox_logo.png";

const links = [
  { to: "/trips", label: "Trips" },
  { to: "/destinations", label: "Destinations" },
  { to: "/past-trips", label: "Past Trips" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          {/* <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="6" fill="var(--forest)" />
            <path d="M6 22 L16 8 L26 22 L20 22 L16 15 L12 22 Z" fill="var(--gold)" />
          </svg>
          <span>VoxVoyager</span> */}
          <img
            alt=""
            src={logo}
            width="120"
            height="120"
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="nav-logo d-inline-block align-top"
          />
        </Link>

        <button
          className="navbar__toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          <div className="navbar__auth">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn--outline btn--sm"
                  onClick={() => setOpen(false)}
                >
                  {user.name.split(" ")[0]}'s trips
                </Link>
                <button
                  className="btn btn--gold btn--sm"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn--outline btn--sm"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn btn--gold btn--sm"
                  onClick={() => setOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
