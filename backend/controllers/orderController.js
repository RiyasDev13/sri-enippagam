import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import razorpay from "../services/razorpayService.js";
import Product from "../models/Product.js";
import Contact from "../models/Contact.js";

import {
  sendAdminNewOrderMessage,
  sendOrderPlacedMessage,
  sendOrderStatusMessage,
} from "../services/whatsappService.js";

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const getRangeStart = (range, customFrom) => {
  const today = startOfDay(new Date());

  if (range === "today") return today;
  if (range === "7d") {
    return new Date(today.getTime() - 6 * 86400000);
  }
  if (range === "30d") {
    return new Date(today.getTime() - 29 * 86400000);
  }
  if (range === "month") {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return customFrom
    ? startOfDay(customFrom)
    : new Date(today.getTime() - 6 * 86400000);
};

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
    const pattern = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    filter.$or = [
      { "customer.name": pattern },
      { "customer.email": pattern },
      { "customer.phone": pattern },
    ];

    if (/^[a-f\d]{24}$/i.test(search)) {
      filter.$or.push({ _id: search });
    }
  }

  if (from || to) {
    filter.createdAt = {};

    if (from) {
      filter.createdAt.$gte = new Date(`${from}T00:00:00.000Z`);
    }

    if (to) {
      filter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
    }
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { totalAmount: -1 },
    lowest: { totalAmount: 1 },
  };

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const [orders, total, allOrders] = await Promise.all([
    Order.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),

    Order.countDocuments(filter),

    Order.find({}, { status: 1 }),
  ]);

  const summary = allOrders.reduce(
    (counts, order) => {
      counts.total += 1;

      if (counts[order.status] !== undefined) {
        counts[order.status] += 1;
      }

      return counts;
    },
    {
      total: 0,
      Pending: 0,
      Processing: 0,
      Delivered: 0,
      Cancelled: 0,
    }
  );

  res.json({
    orders,
    summary,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    },
  });
});

// @desc    Get orders for the logged-in customer
// @route   GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    customerId: req.user._id,
  }).sort({
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
    whatsappOptIn = false,
  } = req.body;

  if (
    !customer ||
    !items ||
    !items.length ||
    totalAmount === undefined
  ) {
    res.status(400);
    throw new Error(
      "customer, items and totalAmount are required"
    );
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * Number(item.quantity),
    0
  );

  const expectedTotal =
    subtotal -
    Number(discount) +
    Number(deliveryCharge) +
    Number(tax);

  if (
    !items.every(
      (item) =>
        item.name &&
        Number(item.price) >= 0 &&
        Number(item.quantity) > 0
    ) ||
    Math.abs(
      expectedTotal - Number(totalAmount)
    ) > 0.01
  ) {
    res.status(400);
    throw new Error(
      "Order items and total do not match"
    );
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
    if (
      !razorpayOrderId ||
      !razorpayPaymentId
    ) {
      res.status(400);
      throw new Error(
        "Razorpay payment details are required"
      );
    }

    // Get the payment directly from Razorpay
    const payment =
      await razorpay.payments.fetch(
        razorpayPaymentId
      );

    // Make sure this payment belongs to the Razorpay order
    if (
      payment.order_id !== razorpayOrderId
    ) {
      res.status(400);
      throw new Error(
        "Payment does not match the Razorpay order"
      );
    }

    // Only accept a successful payment
    if (payment.status !== "captured") {
      res.status(400);
      throw new Error(
        "Payment has not been captured"
      );
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

    whatsappOptIn: whatsappOptIn === true,

    notes: notes || "",

    statusHistory: [
      {
        status: "Pending",
        changedBy: req.user._id,
      },
    ],
  });

  void sendAdminNewOrderMessage(order);
  void sendOrderPlacedMessage(order);

  res.status(201).json(order);
});

// @desc    Update an order's status
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = asyncHandler(
  async (req, res) => {
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error("status is required");
    }

    const allowed = [
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

    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error("Invalid order status");
    }

    const existing = await Order.findById(
      req.params.id
    );

    if (!existing) {
      res.status(404);
      throw new Error("Order not found");
    }

    const previousStatus = existing.status;

    existing.status = status;

    existing.statusHistory.push({
      status,
      changedBy: req.user._id,
    });

    const updated = await existing.save();

    if (
      previousStatus !== status &&
      [
        "Confirmed",
        "Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ].includes(status)
    ) {
      void sendOrderStatusMessage(updated);
    }

    res.json(updated);
  }
);

export const updatePaymentStatus =
  asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;

    if (
      ![
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ].includes(paymentStatus)
    ) {
      res.status(400);
      throw new Error(
        "Invalid payment status"
      );
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { paymentStatus },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      res.status(404);
      throw new Error(
        "Order not found"
      );
    }

    res.json(order);
  });

export const bulkUpdateOrderStatus =
  asyncHandler(async (req, res) => {
    const {
      ids = [],
      status,
    } = req.body;

    if (
      !Array.isArray(ids) ||
      !ids.length ||
      !status
    ) {
      res.status(400);
      throw new Error(
        "ids and status are required"
      );
    }

    const allowed = [
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

    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error(
        "Invalid order status"
      );
    }

    const orders = await Order.find({
      _id: { $in: ids },
    });

    await Promise.all(
      orders.map((order) => {
        order.status = status;

        order.statusHistory.push({
          status,
          changedBy: req.user._id,
        });

        return order.save();
      })
    );

    res.json({
      updated: orders.length,
      orders,
    });
  });

export const getDashboardSummary =
  asyncHandler(async (req, res) => {
    const {
      range = "7d",
      from = "",
      to = "",
    } = req.query;

    const rangeStart = getRangeStart(
      range,
      from
    );

    const rangeEnd = to
      ? new Date(`${to}T23:59:59.999`)
      : new Date();

    const [
      orders,
      products,
      contacts,
    ] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .lean(),

      Product.find().lean(),

      Contact.find()
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const paidOrders = orders.filter(
      (order) =>
        order.paymentStatus === "Paid"
    );

    const revenueBetween = (
      start,
      end
    ) =>
      paidOrders
        .filter(
          (order) =>
            new Date(order.createdAt) >=
              start &&
            new Date(order.createdAt) <=
              end
        )
        .reduce(
          (sum, order) =>
            sum +
            Number(
              order.totalAmount || 0
            ),
          0
        );

    const rangeOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >=
          rangeStart &&
        new Date(order.createdAt) <=
          rangeEnd
    );

    const orderStats = orders.reduce(
      (stats, order) => {
        stats.total += 1;

        if (
          stats[order.status] !==
          undefined
        ) {
          stats[order.status] += 1;
        }

        return stats;
      },
      {
        total: 0,
        Pending: 0,
        Processing: 0,
        Delivered: 0,
        Cancelled: 0,
      }
    );

    const enquirySummary =
      contacts.reduce(
        (summary, contact) => {
          summary.total += 1;

          if (
            contact.status === "New"
          ) {
            summary.unread += 1;
          }

          if (
            contact.status === "Replied"
          ) {
            summary.replied += 1;
          }

          if (
            contact.status === "Resolved"
          ) {
            summary.resolved += 1;
          }

          return summary;
        },
        {
          total: 0,
          unread: 0,
          replied: 0,
          resolved: 0,
        }
      );

    const productSales = new Map();

    orders.forEach((order) =>
      (order.items || []).forEach(
        (item) => {
          const current =
            productSales.get(
              item.productId
            ) || {
              productId:
                item.productId,
              name: item.name,
              quantity: 0,
              revenue: 0,
            };

          current.quantity += Number(
            item.quantity || 0
          );

          current.revenue +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

          productSales.set(
            item.productId,
            current
          );
        }
      )
    );

    const chartDays =
      range === "today"
        ? 1
        : range === "7d"
        ? 7
        : range === "30d"
        ? 30
        : Math.min(
            Math.max(
              Math.floor(
                (startOfDay(rangeEnd) -
                  startOfDay(
                    rangeStart
                  )) /
                  86400000
              ) + 1,
              1
            ),
            31
          );

    const chart = Array.from(
      { length: chartDays },
      (_, index) => {
        const date = new Date(
          rangeStart.getTime() +
            index * 86400000
        );

        const next = new Date(
          date.getTime() +
            86400000
        );

        return {
          label:
            date.toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
              }
            ),

          orders:
            rangeOrders.filter(
              (order) =>
                new Date(
                  order.createdAt
                ) >= date &&
                new Date(
                  order.createdAt
                ) < next
            ).length,

          revenue:
            revenueBetween(
              date,
              next
            ),
        };
      }
    );

    const lowStock = products
      .filter(
        (product) =>
          product.available === false ||
          (product.stock !== undefined &&
            product.stock <= 10)
      )
      .slice(0, 8);

    res.json({
      range: {
        from: rangeStart,
        to: rangeEnd,
      },

      revenue: {
        today: revenueBetween(
          startOfDay(new Date()),
          new Date()
        ),

        sevenDays: revenueBetween(
          getRangeStart("7d"),
          new Date()
        ),

        thirtyDays: revenueBetween(
          getRangeStart("30d"),
          new Date()
        ),

        total: paidOrders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.totalAmount || 0
            ),
          0
        ),

        codPending: orders
          .filter(
            (order) =>
              order.paymentMethod ===
                "COD" &&
              order.paymentStatus ===
                "Pending"
          )
          .reduce(
            (sum, order) =>
              sum +
              Number(
                order.totalAmount || 0
              ),
            0
          ),
      },

      orderStats,

      chart,

      attention: {
        pendingOrders:
          orders
            .filter(
              (order) =>
                order.status ===
                "Pending"
            )
            .slice(0, 6),

        codPending:
          orders
            .filter(
              (order) =>
                order.paymentMethod ===
                  "COD" &&
                order.paymentStatus ===
                  "Pending"
            )
            .slice(0, 6),

        lowStock,

        unreadEnquiries:
          contacts
            .filter(
              (contact) =>
                contact.status ===
                "New"
            )
            .slice(0, 6),
      },

      lowStock,

      topProducts: [
        ...productSales.values(),
      ]
        .sort(
          (a, b) =>
            b.quantity - a.quantity
        )
        .slice(0, 6),

      enquirySummary,

      recentOrders:
        orders.slice(0, 6),
    });
  });