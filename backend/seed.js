import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import seedProducts from "./data/seedProducts.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Remove existing products
    await Product.deleteMany({});

    // Remove the `id` field because MongoDB creates its own `_id`
    const products = seedProducts.map(({ id, ...product }) => product);

    // Insert all seed products
    await Product.insertMany(products);

    console.log(`${products.length} products successfully added to MongoDB`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();