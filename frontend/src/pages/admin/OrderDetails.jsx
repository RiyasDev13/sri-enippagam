import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../services/api.js";

import { downloadReceipt } from "../../utils/receipt.js";

import Loader from "../../components/common/Loader.jsx";

const statuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
];

const paymentStatuses = ["Pending", "Paid", "Failed", "Refunded"];

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrder(id);
      setOrder(data);
    } catch (err) {
      console.error("Failed to load order:", err);
      setError(
        err.response?.data?.message || "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleStatusChange = async (e) => {
    try {
      setUpdating(true);
      setError("");

      await updateOrderStatus(id, e.target.value);
      await load();
    } catch (err) {
      console.error("Failed to update order:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentChange = async (e) => {
    try {
      setUpdating(true);
      setError("");

      await updatePaymentStatus(id, e.target.value);
      await load();
    } catch (err) {
      console.error("Failed to update payment status:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update payment status."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loader label="Loading order..." />;
  }

  if (error) {
    return (
      <div>
        <Link to="/admin/orders">
          &larr; Back to Orders
        </Link>

        <p className="error-state">{error}</p>
      </div>
    );
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="admin-page">
      <Link
        className="admin-back-link"
        to="/admin/orders"
      >
        <i className="bi bi-arrow-left"></i> Back to Orders
      </Link>

      <div className="admin-detail-heading">
        <div>
          <p className="admin-eyebrow">
            Order #{order._id.slice(0, 8)}
          </p>

          <h2 className="admin-section-title">
            Order details
          </h2>
        </div>

        <div className="admin-detail-actions">
          <button
            className="admin-secondary-btn"
            onClick={() => downloadReceipt(order)}
          >
            <i className="bi bi-download"></i>{" "}
            Download receipt
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer"></i>{" "}
            Print / Reprint
          </button>

          <span
            className={`status-badge status-${order.status
              .replace(/\s/g, "-")
              .toLowerCase()}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="admin-order-details">
        <div className="order-info-block">
          <h4>
            <i className="bi bi-person"></i>{" "}
            Customer information
          </h4>

          <strong>{order.customer.name}</strong>

          <p>{order.customer.email}</p>
          <p>{order.customer.phone}</p>
        </div>

        <div className="order-info-block">
          <h4>
            <i className="bi bi-geo-alt"></i>{" "}
            Delivery address
          </h4>

          <p>{order.customer.address}</p>
        </div>

        <div className="order-info-block">
          <h4>
            <i className="bi bi-credit-card"></i>{" "}
            Payment
          </h4>

          <strong>
            {order.paymentMethod === "RAZORPAY"
              ? "Online payment"
              : "Cash on delivery"}
          </strong>

          <p>
            Status:{" "}
            <select
              value={order.paymentStatus || "Pending"}
              onChange={handlePaymentChange}
              disabled={updating}
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </p>

          {order.razorpayPaymentId && (
            <p>
              Payment ID: {order.razorpayPaymentId}
            </p>
          )}
        </div>

        <div className="order-status-block">
          <h4>
            <i className="bi bi-arrow-repeat"></i>{" "}
            Update status
          </h4>

          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating}
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-subheading">
        <h3>Order items</h3>
        <span>{order.items.length} items</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr
                key={`${item.productId}-${index}`}
              >
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="admin-order-total">
        Subtotal: ₹
        {order.subtotal ??
          order.items.reduce(
            (sum, item) =>
              sum + item.price * item.quantity,
            0
          )}{" "}
        · Delivery: ₹{order.deliveryCharge || 0} ·
        Tax: ₹{order.tax || 0} · Discount: ₹
        {order.discount || 0}
        <br />
        <strong>
          Total: ₹{order.totalAmount}
        </strong>
      </p>

      <section className="admin-timeline">
        <div className="admin-subheading">
          <h3>Order timeline</h3>

          <span>
            {order.statusHistory?.length || 0} updates
          </span>
        </div>

        {(order.statusHistory || [])
          .slice()
          .reverse()
          .map((event, index) => (
            <div
              className="admin-timeline-item"
              key={`${event.changedAt}-${index}`}
            >
              <span className="admin-timeline-dot"></span>

              <div>
                <strong>{event.status}</strong>

                <small>
                  {new Date(
                    event.changedAt
                  ).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}