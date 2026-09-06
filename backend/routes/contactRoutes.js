import express from "express";

import {
  createContact,
  getContacts,
  updateContactStatus,
} from "../controllers/contactController.js";

import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/", createContact);

// Admin only
router.get("/", protectAdmin, getContacts);
router.patch("/:id/status", protectAdmin, updateContactStatus);

export default router;