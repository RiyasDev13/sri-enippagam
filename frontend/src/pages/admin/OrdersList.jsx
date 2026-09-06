import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading orders..." />;

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><p className="admin-eyebrow">Store activity</p><h2 className="admin-section-title">All orders</h2></div><span className="admin-count-badge">{orders.length} total</span></div>

      {orders.length === 0 ? (
        <div className="admin-empty-state"><i className="bi bi-receipt"></i><h3>No orders yet</h3><p>Orders will appear here when customers place them.</p></div>
      ) : (
        <div className="admin-table-wrap"><table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Placed On</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(0, 8)}...</td>

                <td>{o.customer.name}</td>

                <td>{o.items.length}</td>

                <td>₹{o.totalAmount}</td>

                <td>
                  <span
                    className={`status-badge status-${(o.paymentStatus || "Pending")
                      .replace(/\s/g, "-")
                      .toLowerCase()}`}
                  >
                    {o.paymentMethod === "RAZORPAY" ? "Online" : "Cash on delivery"} - {o.paymentStatus || "Pending"}
                  </span>
                </td>

                <td>
                  <span
                    className={`status-badge status-${o.status
                      .replace(/\s/g, "-")
                      .toLowerCase()}`}
                  >
                    {o.status}
                  </span>
                </td>

                <td>
                  {new Date(o.createdAt).toLocaleString()}
                </td>

                <td>
                  <Link to={`/admin/orders/${o._id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </div>
  );
}