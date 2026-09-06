import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import razorpay from "../services/razorpayService.js";


// @desc    Get all orders
// @route   GET /api/orders
export const getOrders = asyncHandler(async (req, res) => {
  const {
    search = "",
    status = "",
    paymentStatus = "",
    paymentMethod = "",
    from = "",
    to = "",
    sort = "newest",
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (search) {
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { "customer.name": pattern },
      { "customer.email": pattern },
      { "customer.phone": pattern },
    ];
    if (/^[a-f\d]{24}$/i.test(search)) filter.$or.push({ _id: search });
  }
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to) filter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { totalAmount: -1 },
    lowest: { totalAmount: 1 },
  };
  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const [orders, total, allOrders] = await Promise.all([
    Order.find(filter).sort(sortMap[sort] || sortMap.newest).skip((pageNumber - 1) * pageSize).limit(pageSize),
    Order.countDocuments(filter),
    Order.find({}, { status: 1 }),
  ]);

  const summary = allOrders.reduce((counts, order) => {
    counts.total += 1;
    if (counts[order.status] !== undefined) counts[order.status] += 1;
    return counts;
  }, { total: 0, Pending: 0, Processing: 0, Delivered: 0, Cancelled: 0 });

  res.json({ orders, summary, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
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

// @desc    Get a single order for the logged-in customer
// @route   GET /api/orders/customer/:id
export const getCustomerOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customerId: req.user._id,
  });

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
    discount = 0,
    tax = 0,
  } = req.body;

  if (!customer || !items || !items.length || totalAmount === undefined) {
    res.status(400);
    throw new Error("customer, items and totalAmount are required");
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const expectedTotal = subtotal - Number(discount) + Number(deliveryCharge) + Number(tax);
  if (!items.every((item) => item.name && Number(item.price) >= 0 && Number(item.quantity) > 0) || Math.abs(expectedTotal - Number(totalAmount)) > 0.01) {
    res.status(400);
    throw new Error("Order items and total do not match");
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
    subtotal,
    discount: Number(discount),
    tax: Number(tax),

    paymentMethod,
    paymentStatus,

    razorpayOrderId,
    razorpayPaymentId,

    deliveryCharge: Number(deliveryCharge),

    notes: notes || "",
    statusHistory: [{ status: "Pending", changedBy: req.user._id }],
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

  const allowed = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.status = status;
  order.statusHistory.push({ status, changedBy: req.user._id });
  const updated = await order.save();

  if (!updated) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(updated);
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  if (!["Pending", "Paid", "Failed", "Refunded"].includes(paymentStatus)) {
    res.status(400);
    throw new Error("Invalid payment status");
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true, runValidators: true });
  if (!order) { res.status(404); throw new Error("Order not found"); }
  res.json(order);
});

export const bulkUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { ids = [], status } = req.body;
  if (!Array.isArray(ids) || !ids.length || !status) { res.status(400); throw new Error("ids and status are required"); }
  const allowed = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded"];
  if (!allowed.includes(status)) { res.status(400); throw new Error("Invalid order status"); }
  const orders = await Order.find({ _id: { $in: ids } });
  await Promise.all(orders.map((order) => {
    order.status = status;
    order.statusHistory.push({ status, changedBy: req.user._id });
    return order.save();
  }));
  res.json({ updated: orders.length, orders });
});