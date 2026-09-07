import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api.js";
import { downloadReceipt } from "../utils/receipt.js";

export default function Account() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    const savedCustomer = localStorage.getItem("customer");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }

    getMyOrders()
      .then(setOrders)
      .catch((error) => {
        setOrdersError(
          error.response?.data?.message || "Could not load your orders."
        );
      })
      .finally(() => setOrdersLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    navigate("/", { replace: true });
  };

  if (!customer) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="account-card">
            <p>Loading account...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="account-page section">
      <div className="container">
        <div className="account-header">
          <div className="account-header-copy">
            <p className="eyebrow">Customer account</p>
            <h1>Welcome back, {customer.name}</h1>
            <p>Keep track of your details and every sweet delivery.</p>
          </div>
          <div className="account-header-avatar" aria-hidden="true">
            {(customer.name || "C").charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="account-grid">
          <div className="account-card">
            <div className="account-card-heading">
              <div className="account-icon">
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <p className="account-card-kicker">Your profile</p>
                <h2>Personal Information</h2>
              </div>
            </div>

            <div className="account-info">
              <div>
                <i className="bi bi-person"></i>
                <span>Name</span>
                <strong>{customer.name || "Not available"}</strong>
              </div>

              <div>
                <i className="bi bi-envelope"></i>
                <span>Email</span>
                <strong>{customer.email || "Not available"}</strong>
              </div>

              <div>
                <i className="bi bi-phone"></i>
                <span>Phone</span>
                <strong>{customer.phone || "Not available"}</strong>
              </div>
            </div>
          </div>

          <div className="account-card account-orders-card">
            <div className="account-card-heading">
              <div className="account-icon">
                <i className="bi bi-bag-check-fill"></i>
              </div>
              <div>
                <p className="account-card-kicker">Order activity</p>
                <h2>My Orders</h2>
              </div>
            </div>

            {ordersLoading && <p>Loading your orders...</p>}

            {!ordersLoading && ordersError && (
              <p className="error-state">{ordersError}</p>
            )}

            {!ordersLoading && !ordersError && orders.length === 0 && (
              <p>Your orders will appear here after you place an order.</p>
            )}

            {!ordersLoading && !ordersError && orders.length > 0 && (
              <div className="account-order-list">
                {orders.map((order) => (
                  <article className="account-order" key={order._id}>
                    <div className="account-order-heading">
                      <strong>Order #{order._id.slice(-8)}</strong>
                      <span className={`account-order-status account-order-status-${order.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        <i className="bi bi-circle-fill"></i>
                        {order.status}
                      </span>
                    </div>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                    <div className="account-order-summary">
                      <span>{order.items.length} item{order.items.length === 1 ? "" : "s"}</span>
                      <strong>₹{order.totalAmount}</strong>
                    </div>
                    <button className="account-receipt-button" onClick={() => downloadReceipt(order)}>
                      <i className="bi bi-download"></i> Download receipt
                    </button>
                  </article>
                ))}
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={() => navigate("/products/all")}
            >
              <i className="bi bi-shop"></i>
              Continue Shopping
            </button>
          </div>
        </div>

        <div className="account-logout">
          <button className="btn btn-primary" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}