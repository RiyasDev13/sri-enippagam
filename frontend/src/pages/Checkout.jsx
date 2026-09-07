import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import {
  createOrder,
  createPaymentOrder,
  verifyPayment,
  getCustomerProfile,
  saveCustomerDetails,
} from "../services/api.js";
import SubBanner from "../components/common/SubBanner.jsx";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD");
<<<<<<< ours
  const [savedDetails, setSavedDetails] = useState([]);
  const [selectedDetailsId, setSelectedDetailsId] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);
  const [detailsMessage, setDetailsMessage] = useState("");
=======
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
>>>>>>> theirs

  const navigate = useNavigate();

  // Delivery charge
  const deliveryCharge = 40;

  // Final amount including delivery
  const finalAmount = Number(totalAmount) + deliveryCharge;

  useEffect(() => {
    if (!localStorage.getItem("customerToken")) return;
    getCustomerProfile()
      .then(({ customer }) => {
        const details = customer?.savedDetails || [];
        setSavedDetails(details);
        if (details.length) {
          setSelectedDetailsId(String(details[0]._id));
          setForm(details[0]);
        } else {
          setForm((current) => ({
            ...current,
            name: current.name || customer?.name || "",
            email: current.email || customer?.email || "",
            phone: current.phone || customer?.phone || "",
          }));
        }
      })
      .catch(() => setDetailsMessage("Could not load your saved details."));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavedDetailsChange = (e) => {
    const detail = savedDetails.find((item) => item._id === e.target.value);
    setSelectedDetailsId(e.target.value);
    if (detail) {
      setForm({ name: detail.name, email: detail.email, phone: detail.phone, address: detail.address });
    } else {
      setForm({ name: "", email: "", phone: "", address: "" });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitting(true);
  setError(null);

  try {
    if (saveDetails) {
      const result = await saveCustomerDetails(form);
      setSavedDetails(result.savedDetails || []);
      setSaveDetails(false);
      setDetailsMessage("Details saved for your next checkout.");
    }

    // =========================
    // CASH ON DELIVERY
    // =========================
    if (paymentMethod === "COD") {
      const order = await createOrder({
        customer: form,
        items: items.map((item) => ({
          productId: String(item.id),
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        totalAmount: finalAmount,
        paymentMethod: "COD",
        deliveryCharge,
        whatsappOptIn,
      });

      clearCart();

      navigate(`/order-success/${order._id}`);
      return;
    }

    // =========================
    // RAZORPAY PAYMENT
    // =========================

    const razorpayOrder = await createPaymentOrder({
      amount: Number(totalAmount),
      deliveryCharge,
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      name: "Sri Enippagam",

      description: "Sri Enippagam Order",

      order_id: razorpayOrder.id,

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },

      theme: {
        color: "#1977CC",
      },

      handler: async function (response) {
        console.log("Razorpay payment response:", response);

        try {
          // First verify the payment with our backend
          const verification = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!verification.success) {
            throw new Error("Payment verification failed");
          }

          // Only create the order after payment is verified
          const order = await createOrder({
            customer: form,

            items: items.map((item) => ({
              productId: String(item.id),
              name: item.name,
              price: Number(item.price),
              quantity: Number(item.quantity),
            })),

            totalAmount: finalAmount,

            paymentMethod: "RAZORPAY",

            

            deliveryCharge,

            whatsappOptIn,

            razorpayOrderId: response.razorpay_order_id,

            razorpayPaymentId: response.razorpay_payment_id,
          });

          clearCart();

          navigate(`/order-success/${order._id}`);
        } catch (err) {
          console.error("Payment verification error:", err);

          setError(
            err.response?.data?.message ||
              "Payment verification failed. Please contact us if money was deducted."
          );
          setSubmitting(false);
        }
      },

      modal: {
        ondismiss: function () {
          setSubmitting(false);
          setError("Payment was cancelled.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (err) {
    console.error("Payment error:", err);

    setError(
      err.response?.data?.message ||
        "Could not start the payment. Please try again."
    );

    setSubmitting(false);
  }
};
  if (items.length === 0) {
    return (
      <>
        <SubBanner title="Checkout" />

        <div className="container section empty-state">
          <p>Your cart is empty.</p>

          <Link to="/products/sweets" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SubBanner title="Checkout" />

      <section className="section">
        <div className="container checkout-grid">

          {/* =========================
              CUSTOMER DETAILS
          ========================== */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h4>Your Details</h4>

            {savedDetails.length > 0 && (
              <div className="saved-details-picker">
                <label htmlFor="saved-details">Use saved details</label>
                <select id="saved-details" value={selectedDetailsId} onChange={handleSavedDetailsChange}>
                  <option value="">Enter new checkout details</option>
                  {savedDetails.map((detail, index) => <option key={detail._id} value={detail._id}>{index + 1}. {detail.name} - {detail.phone}</option>)}
                </select>
                <small>{savedDetails.length}/5 saved details</small>
              </div>
            )}

            <label>Full Name *</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email *</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Mobile Number *</label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label>Delivery Address *</label>

            <textarea
              name="address"
              rows="4"
              value={form.address}
              onChange={handleChange}
              required
            />

            {localStorage.getItem("customerToken") && savedDetails.length < 5 && (
              <label className="save-details-option"><input type="checkbox" checked={saveDetails} onChange={(e) => setSaveDetails(e.target.checked)} /> Save these details for next time</label>
            )}
            {detailsMessage && <p className="checkout-details-message">{detailsMessage}</p>}

            {/* =========================
                PAYMENT METHOD
            ========================== */}
            <h4>Payment Method</h4>

            <div className="payment-options" role="radiogroup" aria-label="Payment method">
              <label className={`payment-option ${paymentMethod === "RAZORPAY" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span className="payment-option-copy">
                  <strong><i className="bi bi-credit-card-2-front"></i> Online Payment</strong>
                  <small>UPI, credit/debit card or net banking</small>
                  <em>Secure checkout powered by Razorpay</em>
                </span>
                <i className="bi bi-check-circle-fill payment-option-check" aria-hidden="true"></i>
              </label>

              <label className={`payment-option ${paymentMethod === "COD" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span className="payment-option-copy">
                  <strong><i className="bi bi-box-seam"></i> Cash on Delivery</strong>
                  <small>Pay when your order is delivered</small>
                  <em>Keep cash ready for the delivery partner</em>
                </span>
                <i className="bi bi-check-circle-fill payment-option-check" aria-hidden="true"></i>
              </label>

            </div>

            <label className="whatsapp-opt-in">
              <input
                type="checkbox"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
              />
              <span>
                <strong><i className="bi bi-whatsapp"></i> Send me order updates on WhatsApp</strong>
                <small>We will use the mobile number above for order notifications.</small>
              </span>
            </label>

            {/* =========================
                ERROR MESSAGE
            ========================== */}
            {error && (
              <p className="error-state">
                {error}
              </p>
            )}

            {/* =========================
                SUBMIT BUTTON
            ========================== */}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Placing Order..."
                : paymentMethod === "RAZORPAY"
                ? `Pay ₹${finalAmount}`
                : "Place COD Order"}
            </button>
          </form>

          {/* =========================
              ORDER SUMMARY
          ========================== */}
          <div className="checkout-summary">

            <h4>Order Summary</h4>

            {items.map((item) => (
              <div
                className="checkout-summary-row"
                key={item.id}
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            {/* Subtotal */}
            <div className="checkout-summary-row">
              <span>Subtotal</span>

              <span>
                ₹{totalAmount}
              </span>
            </div>

            {/* Delivery */}
            <div className="checkout-summary-row">
              <span>Delivery</span>

              <span>
                ₹{deliveryCharge}
              </span>
            </div>

            {/* Final Total */}
            <div className="checkout-summary-total">
              <span>Total</span>

              <strong>
                ₹{finalAmount}
              </strong>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}