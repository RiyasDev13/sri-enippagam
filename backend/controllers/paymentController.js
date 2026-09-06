import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import razorpay from "../services/razorpayService.js";

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, deliveryCharge = 0 } = req.body;

  if (!amount || Number(amount) <= 0) {
    res.status(400);
    throw new Error("Valid amount is required");
  }

  if (Number(deliveryCharge) < 0) {
    res.status(400);
    throw new Error("Invalid delivery charge");
  }

  const options = {
    amount: Math.round(
      (Number(amount) + Number(deliveryCharge)) * 100
    ),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  res.status(201).json(order);
});


// Verify Razorpay payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    res.status(400);
    throw new Error("Payment verification details are required");
  }

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
  });
});