import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import razorpay from "../services/razorpayService.js";


// @desc    Get all orders
// @route   GET /api/orders
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Get orders for the logged-in customer
// @route   GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(orders);
});

// @desc    Get a single order
// @route   GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

// @desc    Place a new order
// @route   POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const {
    customer,
    items,
    totalAmount,
    notes,
    paymentMethod = "COD",
    razorpayOrderId = "",
    razorpayPaymentId = "",
    deliveryCharge = 0,
  } = req.body;

  if (!customer || !items || !items.length || totalAmount === undefined) {
    res.status(400);
    throw new Error("customer, items and totalAmount are required");
  }

  let paymentStatus = "Pending";

  // =========================
  // CASH ON DELIVERY
  // =========================
  if (paymentMethod === "COD") {
    paymentStatus = "Pending";
  }

  // =========================
  // RAZORPAY
  // =========================
  if (paymentMethod === "RAZORPAY") {
    if (!razorpayOrderId || !razorpayPaymentId) {
      res.status(400);
      throw new Error("Razorpay payment details are required");
    }

    // Get the payment directly from Razorpay
    const payment = await razorpay.payments.fetch(
      razorpayPaymentId
    );

    // Make sure this payment belongs to the Razorpay order
    if (payment.order_id !== razorpayOrderId) {
      res.status(400);
      throw new Error("Payment does not match the Razorpay order");
    }

    // Only accept a successful payment
    if (payment.status !== "captured") {
      res.status(400);
      throw new Error("Payment has not been captured");
    }

    paymentStatus = "Paid";
  }

  const order = await Order.create({
    customerId: req.user._id,

    customer,
    items,

    totalAmount: Number(totalAmount),

    paymentMethod,
    paymentStatus,

    razorpayOrderId,
    razorpayPaymentId,

    deliveryCharge: Number(deliveryCharge),

    notes: notes || "",
  });

  res.status(201).json(order);
});
// @desc    Update an order's status
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("status is required");
  }

  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!updated) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(updated);
});