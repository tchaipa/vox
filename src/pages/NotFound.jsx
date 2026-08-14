import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>This departure doesn't exist.</h1>
        <p>The page you're looking for may have moved or been retired.</p>
        <Link to="/" className="btn btn--primary">Back to home</Link>
      </div>
    </section>
  );
}
