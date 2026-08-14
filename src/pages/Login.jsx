import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(ev) {
    ev.preventDefault();
    setError("");
    try {
      login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section auth">
      <div className="container auth__wrap">
        <div className="card auth__card">
          <span className="eyebroww">Welcome back</span>
          <h1>Log in</h1>
          <p className="auth__intro">
            Log in to reserve trips and manage your bookings.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="field-error auth__form-error">{error}</p>}

            <button type="submit" className="btn btn--primary btn--block">
              Log in
            </button>
          </form>

          <p className="auth__switch">
            New to VoxVoyager? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
