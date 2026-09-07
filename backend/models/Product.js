import mongoose from "mongoose";

/**
 * Mongoose schema for a Product.
 * Not used by default (the app runs on the in-memory store in data/store.js),
 * but ready to go as soon as USE_DB=true is set in .env.
 */
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["sweets", "snacks", "chats", "namkeens", "other"],
      default: "other",
    },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
    stock: { type: Number, min: 0, default: 100 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
