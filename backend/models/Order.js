import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderStatusValues = [
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

/**
 * Mongoose schema for an Order.
 * Ready for MongoDB once you set USE_DB=true - see data/store.js for the
 * in-memory equivalent currently used by the controllers.
 */
const orderSchema = new mongoose.Schema(
  {
      customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: orderStatusValues,
      default: "Pending",
    },
    statusHistory: [{
      status: { type: String, enum: orderStatusValues },
      changedAt: { type: Date, default: Date.now },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
