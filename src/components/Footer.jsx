import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="var(--gold)" />
              <path
                d="M6 22 L16 8 L26 22 L20 22 L16 15 L12 22 Z"
                fill="var(--forest)"
              />
            </svg>
            <span>VoxVoyager</span>
          </div>
          <p>
            Harare, Zimbabwe — trips run locally and across the region since
            2018.
          </p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/trips">Upcoming trips</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/past-trips">Past trips</Link>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <Link to="/about">About us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer__col">
          <h4>Reach us</h4>
          <p>+263 777 032 377</p>
          <p>voxvoyager@gmail.com</p>
          <p>
            Office 13, First Floor, Bothwell House, 66 Jason Moyo Ave, Harare
          </p>
        </div>
      </div>
      <div className="footer__bottom container">
        <span className="footer-credit">
          © {new Date().getFullYear()} VoxVoyager Travel (Pvt) Ltd.
        </span>
        {/* <span className="footer-credit">
          Made by{" "}
          <a className="footer-link" href="https://www.infobytsolutions.xyz">
            InfoByte Solutions
          </a>
        </span> */}
      </div>
    </footer>
  );
}
