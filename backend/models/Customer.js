import mongoose from "mongoose";

/**
 * Placeholder Customer model for when customer authentication is added later.
 * Not wired up yet - see middleware/auth.js and routes/authRoutes.js.
 */
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store a hashed password when auth is implemented
    phone: { type: String },
    addresses: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
