import mongoose from "mongoose";

const savedDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store a hashed password when auth is implemented
    phone: { type: String },
    savedDetails: {
      type: [savedDetailSchema],
      validate: {
        validator: (details) => details.length <= 5,
        message: "A customer can save up to 5 checkout details",
      },
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
