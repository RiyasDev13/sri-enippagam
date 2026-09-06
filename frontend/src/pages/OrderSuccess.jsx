import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <section className="section">
      <div className="container empty-state">
        <i className="bi bi-check-circle-fill order-success-icon"></i>
        <h2>Thank you! Your order has been placed.</h2>
        <p>Your order reference number is:</p>
        <p className="order-id">{id}</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
