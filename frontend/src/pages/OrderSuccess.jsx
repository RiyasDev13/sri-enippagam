import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomerOrder } from "../services/api.js";
import { downloadReceipt } from "../utils/receipt.js";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getCustomerOrder(id).then(setOrder).catch(() => setOrder(null));
  }, [id]);

  return (
    <section className="section">
      <div className="container empty-state">
        <i className="bi bi-check-circle-fill order-success-icon"></i>
        <h2>Thank you! Your order has been placed.</h2>
        <p>Your order reference number is:</p>
        <p className="order-id">{id}</p>
        {order && (
          <button className="btn btn-secondary receipt-button" onClick={() => downloadReceipt(order)}>
            <i className="bi bi-download"></i> Download receipt
          </button>
        )}
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
