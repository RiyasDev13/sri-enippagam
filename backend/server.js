import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

if (process.env.USE_DB === "true") {
  connectDB();
} else {
  console.log("USE_DB is not 'true' - running on the in-memory data store (data/store.js).");
}

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => res.json({ message: "Sri Enippagam API is running" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
