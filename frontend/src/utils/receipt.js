const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export function downloadReceipt(order) {
  const paymentLabel =
    order.paymentMethod === "RAZORPAY"
      ? "Online payment (UPI / Card / Net Banking)"
      : "Cash on delivery";
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : new Date().toLocaleString();
  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${item.quantity}</td>
          <td>₹${Number(item.price).toFixed(2)}</td>
          <td>₹${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
        </tr>`
    )
    .join("");
  const subtotal = Number(order.totalAmount) - Number(order.deliveryCharge || 0);

  const receipt = `<!doctype html>
<html><head><meta charset="utf-8"><title>sri Receipt</title>
<style>
body{font:14px Arial,sans-serif;color:#202a34;max-width:760px;margin:40px auto;padding:0 24px}
header{display:flex;justify-content:space-between;align-items:start;border-bottom:3px solid #1977cc;padding-bottom:18px}
h1{margin:0;color:#1977cc;font-size:24px}h2{margin:28px 0 8px;font-size:16px}
p{margin:6px 0;line-height:1.5}.meta{text-align:right;color:#687582}
table{width:100%;border-collapse:collapse;margin-top:12px}th,td{padding:11px 8px;border-bottom:1px solid #dce5ec;text-align:left}th{background:#f1f7fd}
.amount{text-align:right}.total{font-size:17px;font-weight:bold;color:#1977cc}.status{display:inline-block;padding:5px 9px;background:#e7f5eb;color:#237a3b;border-radius:4px}
</style></head><body>
<header><div><h1>sri</h1><p>Order receipt</p></div><div class="meta"><p><strong>Order #${escapeHtml(order._id)}</strong></p><p>${escapeHtml(createdAt)}</p></div></header>
<h2>Customer</h2><p><strong>${escapeHtml(order.customer.name)}</strong></p><p>${escapeHtml(order.customer.email)} · ${escapeHtml(order.customer.phone)}</p><p>${escapeHtml(order.customer.address)}</p>
<h2>Payment</h2><p>${escapeHtml(paymentLabel)} · <span class="status">${escapeHtml(order.paymentStatus || "Pending")}</span></p>
<h2>Items</h2><table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>${itemRows}</tbody></table>
<p class="amount">Subtotal: ₹${subtotal.toFixed(2)}</p><p class="amount">Delivery: ₹${Number(order.deliveryCharge || 0).toFixed(2)}</p><p class="amount total">Total: ₹${Number(order.totalAmount).toFixed(2)}</p>
</body></html>`;

  const blob = new Blob([receipt], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sri-enippagam-receipt-${String(order._id).slice(-8)}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}