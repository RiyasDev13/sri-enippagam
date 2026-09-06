import mongoose from "mongoose";

/**
 * Placeholder Admin model for when admin authentication is added later.
 * Not wired up yet - see middleware/auth.js and routes/authRoutes.js.
 */
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store a hashed password when auth is implemented
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
