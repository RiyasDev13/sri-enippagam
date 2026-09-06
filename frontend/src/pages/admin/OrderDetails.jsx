import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder, updateOrderStatus } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

const statuses = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

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
      setError(err.response?.data?.message || "Failed to load order.");
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
        err.response?.data?.message || "Failed to update order status."
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
        <Link to="/admin/orders">&larr; Back to Orders</Link>
        <p className="error-state">{error}</p>
      </div>
    );
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
      <div className="admin-page">
        <Link className="admin-back-link" to="/admin/orders"><i className="bi bi-arrow-left"></i> Back to Orders</Link>

      <div className="admin-detail-heading"><div><p className="admin-eyebrow">Order #{order._id.slice(0, 8)}</p><h2 className="admin-section-title">Order details</h2></div><span className={`status-badge status-${order.status.replace(/\s/g, "-").toLowerCase()}`}>{order.status}</span></div>

      <div className="admin-order-details">
        <div className="order-info-block">
          <h4><i className="bi bi-person"></i> Customer information</h4>
          <strong>{order.customer.name}</strong><p>{order.customer.email}</p><p>{order.customer.phone}</p>
        </div>
        <div className="order-info-block">
          <h4><i className="bi bi-geo-alt"></i> Delivery address</h4>
          <p>{order.customer.address}</p>
        </div>

        <div className="order-info-block">
          <h4><i className="bi bi-credit-card"></i> Payment</h4>
          <strong>{order.paymentMethod === "RAZORPAY" ? "Online payment" : "Cash on delivery"}</strong>
          <p>
            Status: <span className={`status-badge status-${(order.paymentStatus || "Pending").toLowerCase()}`}>
              {order.paymentStatus || "Pending"}
            </span>
          </p>
          {order.razorpayPaymentId && <p>Payment ID: {order.razorpayPaymentId}</p>}
        </div>

        <div className="order-status-block">
          <h4><i className="bi bi-arrow-repeat"></i> Update status</h4>

          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-subheading"><h3>Order items</h3><span>{order.items.length} items</span></div>

      <div className="admin-table-wrap"><table className="admin-table">
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
            <tr key={`${item.productId}-${index}`}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table></div>

      <p className="admin-order-total">
        Total: ₹{order.totalAmount}
      </p>
    </div>
  );
}