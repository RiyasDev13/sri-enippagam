import express from "express";
import {
  getOrders,
  getMyOrders,
  getOrderById,
  getCustomerOrderById,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protectAdmin, protectCustomer } from "../middleware/auth.js";

const router = express.Router();

// Customer route
// Logged-in customers can place an order
router.route("/").post(protectCustomer, createOrder);

// Admin-only routes
router.route("/").get(protectAdmin, getOrders);

// Customer-only route
router.route("/my").get(protectCustomer, getMyOrders);

router.route("/customer/:id").get(protectCustomer, getCustomerOrderById);

router.route("/:id").get(protectAdmin, getOrderById);

router.route("/:id/status").patch(protectAdmin, updateOrderStatus);

export default router;