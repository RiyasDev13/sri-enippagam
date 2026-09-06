import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty-state">
        <h2>404 - Page Not Found</h2>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
