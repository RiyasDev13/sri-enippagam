import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const statusClass = (value) => `status-${String(value || "pending").replace(/\s/g, "-").toLowerCase()}`;

function ReceiptPrint({ orders }) {
  const print = () => {
    const windowRef = window.open("", "_blank", "width=420,height=720");
    if (!windowRef) return;
    const receipts = orders.map((order) => `<section class="receipt"><h1>Sri Enippagam</h1><p>Pending order bill</p><hr><b>Order:</b> ${order._id}<br><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}<p><b>${order.customer?.name || "Customer"}</b><br>${order.customer?.phone || ""}<br>${order.customer?.address || ""}</p><table>${(order.items || []).map((item) => `<tr><td>${item.name} x ${item.quantity}</td><td>₹${item.price * item.quantity}</td></tr>`).join("")}</table><hr><strong>Total: ${money(order.totalAmount)}</strong><p>Payment: ${order.paymentMethod} / ${order.paymentStatus}</p></section>`).join("");
    windowRef.document.write(`<html><head><title>Pending bills</title><style>@page{size:80mm auto;margin:4mm}body{font:12px monospace;color:#111}.receipt{width:72mm;margin:0 auto 12mm;break-after:page}.receipt:last-child{break-after:auto}h1,p{text-align:center}table{width:100%}td:last-child{text-align:right}hr{border:0;border-top:1px dashed #111}</style></head><body>${receipts}</body></html>`);
    windowRef.document.close(); windowRef.focus(); windowRef.print();
  };
  return <button className="dashboard-action-button" onClick={print}><i className="bi bi-printer"></i><span><strong>Print pending bills</strong><small>Print {orders.length} pending receipt{orders.length === 1 ? "" : "s"}</small></span></button>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("7d");
  const [customDates, setCustomDates] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true); setError("");
    getDashboardSummary({ range, ...(range === "custom" ? customDates : {}) })
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || "Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, [range, customDates.from, customDates.to]);

  const maxChartValue = useMemo(() => Math.max(...(data?.chart || []).map((item) => item.revenue), 1), [data]);
  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <div className="admin-page"><p className="error-state">{error}</p></div>;

  const pendingBills = data.attention.codPending;
  const attentionCount = data.attention.pendingOrders.length + pendingBills.length + data.attention.lowStock.length + data.attention.unreadEnquiries.length;

  return <div className="admin-page dashboard-page">
    <div className="dashboard-filter-row"><div><p className="admin-eyebrow">Store overview</p><h2 className="admin-section-title">Dashboard</h2></div><div className="dashboard-range-controls"><select value={range} onChange={(e) => setRange(e.target.value)}><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="month">This month</option><option value="custom">Custom range</option></select>{range === "custom" && <><input type="date" value={customDates.from} onChange={(e) => setCustomDates({ ...customDates, from: e.target.value })} /><input type="date" value={customDates.to} onChange={(e) => setCustomDates({ ...customDates, to: e.target.value })} /></>}</div></div>

    <div className="dashboard-section-label"><span>Revenue</span><small>Paid orders only</small></div>
    <div className="admin-stats-grid dashboard-revenue-grid">{[["Today", data.revenue.today, "bi-sunrise", "blue"], ["Last 7 days", data.revenue.sevenDays, "bi-calendar-week", "lime"], ["Last 30 days", data.revenue.thirtyDays, "bi-calendar3", "purple"], ["Total revenue", data.revenue.total, "bi-graph-up-arrow", "green"], ["COD pending", data.revenue.codPending, "bi-cash-stack", "orange"]].map(([label, value, icon, tone]) => <div className={`admin-stat-card stat-${tone}`} key={label}><div className="admin-stat-icon"><i className={`bi ${icon}`}></i></div><div><span>{label}</span><h3>{money(value)}</h3></div><small>{label === "COD pending" ? "Awaiting collection" : "Collected revenue"}</small></div>)}</div>

    <div className="dashboard-section-label"><span>Orders</span><small>{data.orderStats.total} all-time orders</small></div>
    <div className="dashboard-order-stats">{[["Total", data.orderStats.total, "blue"], ["Pending", data.orderStats.Pending, "orange"], ["Processing", data.orderStats.Processing, "lime"], ["Delivered", data.orderStats.Delivered, "green"], ["Cancelled", data.orderStats.Cancelled, "red"]].map(([label, value, tone]) => <div className={`dashboard-order-stat ${tone}`} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>

    <div className="dashboard-content-grid"><section className="admin-panel dashboard-chart-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Performance</p><h2>Revenue and orders</h2></div><span className="dashboard-chart-legend"><i></i> Revenue</span></div><div className="dashboard-chart">{data.chart.map((item) => <div className="dashboard-chart-column" key={item.label}><div className="dashboard-chart-bar" title={`${item.label}: ${money(item.revenue)}`} style={{ height: `${Math.max((item.revenue / maxChartValue) * 100, item.revenue ? 8 : 2)}%` }}></div><small>{item.label}</small><em>{item.orders} order{item.orders === 1 ? "" : "s"}</em></div>)}</div></section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Needs attention</p><h2>{attentionCount} items</h2></div></div><div className="dashboard-attention-list"><Link to="/admin/orders?status=Pending"><i className="bi bi-hourglass-split"></i><span><strong>{data.attention.pendingOrders.length} pending orders</strong><small>Review order workflow</small></span></Link><Link to="/admin/orders?paymentStatus=Pending&paymentMethod=COD"><i className="bi bi-cash"></i><span><strong>{pendingBills.length} COD payments</strong><small>Awaiting collection</small></span></Link><Link to="/admin/products"><i className="bi bi-box-seam"></i><span><strong>{data.attention.lowStock.length} low-stock products</strong><small>Check inventory</small></span></Link><Link to="/admin/enquiries"><i className="bi bi-chat-left-text"></i><span><strong>{data.attention.unreadEnquiries.length} unread enquiries</strong><small>Respond to customers</small></span></Link></div></section></div>

    <div className="dashboard-content-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Latest activity</p><h2>Recent orders</h2></div><Link to="/admin/orders" className="admin-text-link">View all <i className="bi bi-arrow-right"></i></Link></div>{data.recentOrders.length === 0 ? <p className="admin-empty-inline">No orders placed yet.</p> : <div className="dashboard-recent-orders">{data.recentOrders.map((order) => <div className="dashboard-recent-order" key={order._id}><span className="dashboard-row-icon"><i className="bi bi-receipt"></i></span><span className="dashboard-recent-order-main"><strong>#{order._id.slice(-8)}</strong><small>{order.customer?.name} · {new Date(order.createdAt).toLocaleDateString()}</small></span><span className="dashboard-recent-order-customer">{order.customer?.email || order.customer?.phone}</span><strong>{money(order.totalAmount)}</strong><span><em className={`status-badge ${statusClass(order.paymentStatus)}`}>{order.paymentStatus}</em><em className={`status-badge ${statusClass(order.status)}`}>{order.status}</em></span><Link className="dashboard-view-action" to={`/admin/orders/${order._id}`}>View</Link></div>)}</div>}</section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Customer demand</p><h2>Top-selling products</h2></div></div>{data.topProducts.length === 0 ? <p className="admin-empty-inline">Sales data will appear here after orders.</p> : <div className="dashboard-ranked-list">{data.topProducts.map((product, index) => <div key={product.productId}><b>{index + 1}</b><span><strong>{product.name}</strong><small>{product.quantity} units sold</small></span><em>{money(product.revenue)}</em></div>)}</div>}</section></div>

    <div className="dashboard-content-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Inventory</p><h2>Low-stock products</h2></div><Link to="/admin/products" className="admin-text-link">Inventory <i className="bi bi-arrow-right"></i></Link></div>{data.lowStock.length === 0 ? <p className="admin-empty-inline">Inventory levels look healthy.</p> : <div className="dashboard-ranked-list">{data.lowStock.map((product) => <div key={product._id}><i className="bi bi-exclamation-triangle dashboard-warning-icon"></i><span><strong>{product.name}</strong><small>{product.available === false ? "Unavailable" : `${product.stock ?? "No quantity"} units remaining`}</small></span><em>{product.available === false ? "Out" : "Low"}</em></div>)}</div>}</section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Customer messages</p><h2>Enquiries</h2></div><Link to="/admin/enquiries" className="admin-text-link">View all <i className="bi bi-arrow-right"></i></Link></div><div className="dashboard-enquiry-stats">{[["Total", data.enquirySummary.total], ["Unread", data.enquirySummary.unread], ["Replied", data.enquirySummary.replied], ["Resolved", data.enquirySummary.resolved]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section></div>

    <section className="admin-panel dashboard-quick-actions"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Shortcuts</p><h2>Quick actions</h2></div></div><div className="dashboard-action-grid"><Link className="dashboard-action-button" to="/admin/products/new"><i className="bi bi-plus-circle"></i><span><strong>Add product</strong><small>Create a new listing</small></span></Link><Link className="dashboard-action-button" to="/admin/orders"><i className="bi bi-receipt"></i><span><strong>Review orders</strong><small>Track customer orders</small></span></Link><ReceiptPrint orders={pendingBills} /><Link className="dashboard-action-button" to="/admin/products"><i className="bi bi-box-seam"></i><span><strong>Inventory</strong><small>Manage stock</small></span></Link><Link className="dashboard-action-button" to="/admin/enquiries"><i className="bi bi-chat-left-text"></i><span><strong>Enquiries</strong><small>Read customer messages</small></span></Link><Link className="dashboard-action-button" to="/admin/orders"><i className="bi bi-bar-chart"></i><span><strong>Sales reports</strong><small>Review order performance</small></span></Link><Link className="dashboard-action-button" to="/"><i className="bi bi-globe2"></i><span><strong>Visit website</strong><small>Open storefront</small></span></Link></div></section>
  </div>;
}
