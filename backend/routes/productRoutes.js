import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protectAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

// Admin-only routes
router
  .route("/")
  .post(protectAdmin, upload.single("image"), createProduct);

router
  .route("/:id")
  .put(protectAdmin, upload.single("image"), updateProduct);

router.route("/:id").delete(protectAdmin, deleteProduct);

export default router;