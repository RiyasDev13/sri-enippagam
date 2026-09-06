import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import { protectCustomer } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-order",
  protectCustomer,
  createPaymentOrder
);

router.post(
  "/verify",
  protectCustomer,
  verifyPayment
);

export default router;