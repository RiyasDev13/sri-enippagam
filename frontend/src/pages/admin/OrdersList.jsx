import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bulkUpdateOrderStatus, getOrders, updateOrderStatus } from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";

const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded"];
const paymentStatuses = ["Pending", "Paid", "Failed", "Refunded"];

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const statusClass = (value) => `status-${String(value || "pending").replace(/\s/g, "-").toLowerCase()}`;

function printReceipts(orders) {
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
  const html = orders.map((order) => `<section class="receipt">
    <h1>Sri Enippagam</h1><p>Traditional sweets and snacks</p><hr>
    <div><b>Order:</b> ${escape(order._id)}<br><b>Date:</b> ${escape(new Date(order.createdAt).toLocaleString())}</div>
    <p><b>Customer:</b> ${escape(order.customer?.name)}<br>${escape(order.customer?.phone)}<br>${escape(order.customer?.email)}<br>${escape(order.customer?.address)}</p>
    <table><thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead><tbody>${(order.items || []).map((item) => `<tr><td>${escape(item.name)}<br><small>${money(item.price)} each</small></td><td>${item.quantity}</td><td>${money(item.price * item.quantity)}</td></tr>`).join("")}</tbody></table>
    <hr><div class="totals"><span>Subtotal</span><b>${money(order.subtotal || (order.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0))}</b><span>Discount</span><b>-${money(order.discount)}</b><span>Delivery</span><b>${money(order.deliveryCharge)}</b><span>Tax</span><b>${money(order.tax)}</b><strong>Total</strong><strong>${money(order.totalAmount)}</strong></div>
    <p>Payment: ${escape(order.paymentMethod)} / ${escape(order.paymentStatus)}<br>Order status: ${escape(order.status)}</p><p>Thank you for shopping with us.</p>
  </section>`).join("");
  const printWindow = window.open("", "_blank", "width=420,height=720");
  if (!printWindow) return;
  printWindow.document.write(`<html><head><title>Sri Enippagam Bills</title><style>@page{size:80mm auto;margin:4mm}body{font:12px monospace;color:#111;margin:0}.receipt{width:72mm;margin:0 auto 12mm;break-after:page}.receipt:last-child{break-after:auto}h1{text-align:center;font-size:18px;margin:0}.receipt p{text-align:center;line-height:1.45}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:3px 0;vertical-align:top}th:last-child,td:last-child{text-align:right}.totals{display:grid;grid-template-columns:1fr auto;gap:3px}.totals strong{font-size:14px}hr{border:0;border-top:1px dashed #111;margin:8px 0}small{font-size:10px}</style></head><body>${html}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ total: 0, Pending: 0, Processing: 0, Delivered: 0, Cancelled: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: "", status: "", paymentStatus: "", paymentMethod: "", from: "", to: "", sort: "newest", page: 1, limit: 10 });
  const [selected, setSelected] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("Processing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true); setError("");
      const result = await getOrders(filters);
      setOrders(result.orders || []); setSummary(result.summary || {}); setPagination(result.pagination || {});
      setSelected([]); setSelectedRecords([]);
    } catch (err) { setError(err.response?.data?.message || "Could not load orders."); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    load();
  }, [filters.search, filters.status, filters.paymentStatus, filters.paymentMethod, filters.from, filters.to, filters.sort, filters.page]);

  const selectedOrders = useMemo(() => selectedRecords.filter((order) => selected.includes(order._id)), [selectedRecords, selected]);
  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value, ...(name === "page" ? {} : { page: 1 }) }));
  const selectAll = async () => {
    if (selected.length === orders.length && selectedRecords.length === orders.length) { setSelected([]); setSelectedRecords([]); return; }
    if (pagination.total > orders.length) {
      const result = await getOrders({ ...filters, page: 1, limit: 100 });
      setSelected((result.orders || []).map((order) => order._id)); setSelectedRecords(result.orders || []);
    } else { setSelected(orders.map((order) => order._id)); setSelectedRecords(orders); }
  };
  const handleBulk = async () => {
    if (!selected.length || !window.confirm(`Update ${selected.length} order(s) to ${bulkStatus}?`)) return;
    await bulkUpdateOrderStatus(selected, bulkStatus); load();
  };
  const handleRowStatus = async (order, status) => {
    if (status === "Cancelled" && !window.confirm(`Cancel order ${order._id.slice(0, 8)}?`)) return;
    await updateOrderStatus(order._id, status); load();
  };
  const exportCsv = () => {
    const rows = [["Order ID", "Customer", "Email", "Phone", "Total", "Payment", "Payment Status", "Order Status", "Created"], ...selectedOrders.map((order) => [order._id, order.customer?.name, order.customer?.email, order.customer?.phone, order.totalAmount, order.paymentMethod, order.paymentStatus, order.status, order.createdAt])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "sri-enippagam-orders.csv"; link.click(); URL.revokeObjectURL(link.href);
  };

  if (loading) return <Loader label="Loading orders..." />;

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><p className="admin-eyebrow">Store activity</p><h2 className="admin-section-title">All orders</h2></div><span className="admin-count-badge">{pagination.total || 0} total</span></div>

      <div className="admin-order-summary">{[["Total", summary.total, "blue"], ["Pending", summary.Pending, "orange"], ["Processing", summary.Processing, "lime"], ["Delivered", summary.Delivered, "green"], ["Cancelled", summary.Cancelled, "red"]].map(([label, value, tone]) => <div className={`admin-order-summary-card ${tone}`} key={label}><span>{label}</span><strong>{value || 0}</strong></div>)}</div>
      <section className="admin-order-toolbar">
        <input aria-label="Search orders" placeholder="Search order ID, customer, phone or email" value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} />
        <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}><option value="">All order statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        <select value={filters.paymentStatus} onChange={(e) => updateFilter("paymentStatus", e.target.value)}><option value="">All payment statuses</option>{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</select>
        <select value={filters.paymentMethod} onChange={(e) => updateFilter("paymentMethod", e.target.value)}><option value="">All payment methods</option><option value="COD">Cash on delivery</option><option value="RAZORPAY">Razorpay</option></select>
        <input type="date" value={filters.from} onChange={(e) => updateFilter("from", e.target.value)} /><input type="date" value={filters.to} onChange={(e) => updateFilter("to", e.target.value)} />
        <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Highest total</option><option value="lowest">Lowest total</option></select>
      </section>
      {error && <p className="error-state">{error}</p>}
      <div className="admin-bulk-toolbar"><label><input type="checkbox" checked={orders.length > 0 && selected.length === orders.length} onChange={selectAll} /> Select all filtered</label><select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}><option value="">Bulk status...</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><button className="btn btn-secondary" disabled={!selected.length || !bulkStatus} onClick={handleBulk}>Update selected</button><button className="btn btn-secondary" disabled={!selected.length} onClick={() => printReceipts(selectedOrders)}>Print bills</button><button className="btn btn-secondary" disabled={!selected.length} onClick={exportCsv}>Export CSV</button></div>

      {orders.length === 0 ? (
        <div className="admin-empty-state"><i className="bi bi-receipt"></i><h3>No orders yet</h3><p>Orders will appear here when customers place them.</p></div>
      ) : (
        <div className="admin-table-wrap"><table className="admin-table">
          <thead>
            <tr>
              <th><span className="visually-hidden">Select</span></th>
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
                <td><input type="checkbox" checked={selected.includes(o._id)} onChange={() => { setSelected((current) => current.includes(o._id) ? current.filter((id) => id !== o._id) : [...current, o._id]); setSelectedRecords((current) => current.some((record) => record._id === o._id) ? current.filter((record) => record._id !== o._id) : [...current, o]); }} /></td>
                <td>{o._id.slice(0, 8)}...</td>

                <td>{o.customer.name}</td>

                <td>{o.items.length} <small>line items</small></td>

                <td>₹{o.totalAmount}</td>

                <td>
                  <span className={`status-badge ${statusClass(o.paymentStatus)}`}>{o.paymentStatus || "Pending"}</span><small className="admin-table-subtext">{o.paymentMethod === "RAZORPAY" ? "Razorpay" : "COD"}</small>
                </td>

                <td>
                  <span
                    className={`status-badge ${statusClass(o.status)}`}
                  >
                    {o.status}
                  </span>
                </td>

                <td>
                  {new Date(o.createdAt).toLocaleString()}
                </td>

                <td>
                  <details className="admin-row-menu"><summary className="icon-action" aria-label="Order actions"><i className="bi bi-three-dots-vertical"></i></summary><div className="admin-row-menu-popover"><Link to={`/admin/orders/${o._id}`}>View</Link><button onClick={() => printReceipts([o])}>Print / Reprint</button><label>Update status<select value={o.status} onChange={(e) => handleRowStatus(o, e.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><button className="danger-text" onClick={() => handleRowStatus(o, "Cancelled")} disabled={o.status === "Cancelled"}>Cancel order</button></div></details>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
        </div>
  );
      {orders.length > 0 && <div className="admin-pagination"><button className="btn btn-secondary" disabled={pagination.page <= 1} onClick={() => updateFilter("page", pagination.page - 1)}>Previous</button><span>Page {pagination.page} of {pagination.pages || 1}</span><button className="btn btn-secondary" disabled={pagination.page >= pagination.pages} onClick={() => updateFilter("page", pagination.page + 1)}>Next</button></div>}
}