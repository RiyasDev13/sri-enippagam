import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  getOrders,
  getContacts,
} from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getOrders(), getContacts()])
      .then(([products, orderResult, contacts]) => {
        const orders = orderResult.orders || orderResult;
        const pending = orders.filter(
          (o) => o.status === "Pending"
        ).length;

        const paidRevenue = orders
          .filter((order) => order.paymentStatus === "Paid")
          .reduce((sum, order) => sum + order.totalAmount, 0);

        const newEnquiries = contacts.filter(
          (contact) => contact.status === "New"
        ).length;

        setStats({
          productCount: products.length,
          orderCount: orders.length,
          pending,
          paidRevenue,
          newEnquiries,
          recentOrders: orders.slice(0, 4),
          recentEnquiries: contacts.slice(0, 3),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader label="Loading dashboard..." />;
  }

  return (
    <div className="admin-page dashboard-page">
      <div className="admin-stats-grid">
        {[
          ["Total Products", stats.productCount, "bi-box-seam", "/admin/products", "Manage products", "blue"],
          ["Total Orders", stats.orderCount, "bi-receipt", "/admin/orders", "Manage orders", "lime"],
          ["Pending Orders", stats.pending, "bi-hourglass-split", null, "Needs attention", "orange"],
          ["Paid Revenue", `₹${stats.paidRevenue}`, "bi-graph-up-arrow", null, "Paid orders only", "green"],
          ["New Enquiries", stats.newEnquiries, "bi-chat-left-text", "/admin/enquiries", "View enquiries", "purple"],
        ].map(([label, value, icon, href, action, tone]) => (
          <div className={`admin-stat-card stat-${tone}`} key={label}>
            <div className="admin-stat-icon"><i className={`bi ${icon}`}></i></div>
            <div><span>{label}</span><h3>{value}</h3></div>
            {href ? <Link to={href}>{action}<i className="bi bi-arrow-up-right"></i></Link> : <small>{action}</small>}
          </div>
        ))}
      </div>

      <div className="dashboard-lower-grid">
        <section className="admin-panel dashboard-activity-panel">
          <div className="admin-panel-heading"><div><p className="admin-eyebrow">Latest activity</p><h2>Recent orders</h2></div><Link to="/admin/orders" className="admin-text-link">View all <i className="bi bi-arrow-right"></i></Link></div>
          {stats.recentOrders.length === 0 ? <p className="admin-empty-inline">No orders placed yet.</p> : <div className="dashboard-order-list">
            {stats.recentOrders.map((order) => <Link className="dashboard-order-row" to={`/admin/orders/${order._id}`} key={order._id}><span className="dashboard-row-icon"><i className="bi bi-receipt"></i></span><span><strong>{order.customer.name}</strong><small>{order.items.length} items · {new Date(order.createdAt).toLocaleDateString()}</small></span><span className="dashboard-row-total">₹{order.totalAmount}<em className={`status-badge status-${order.status.replace(/\s/g, "-").toLowerCase()}`}>{order.status}</em></span></Link>)}
          </div>}
        </section>
        <section className="admin-panel quick-actions-panel">
          <div className="admin-panel-heading"><div><p className="admin-eyebrow">Shortcuts</p><h2>Quick actions</h2></div></div>
          <div className="quick-actions"><Link to="/admin/products/new"><i className="bi bi-plus-circle"></i><span><strong>Add product</strong><small>Create a new listing</small></span><i className="bi bi-arrow-up-right"></i></Link><Link to="/admin/orders"><i className="bi bi-receipt"></i><span><strong>Review orders</strong><small>Track customer orders</small></span><i className="bi bi-arrow-up-right"></i></Link><Link to="/admin/enquiries"><i className="bi bi-chat-left-text"></i><span><strong>Read enquiries</strong><small>Respond to customers</small></span><i className="bi bi-arrow-up-right"></i></Link><Link to="/"><i className="bi bi-globe2"></i><span><strong>Visit website</strong><small>Open customer storefront</small></span><i className="bi bi-arrow-up-right"></i></Link></div>
        </section>
      </div>
    </div>
  );
}