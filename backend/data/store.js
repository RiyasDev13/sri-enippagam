import { v4 as uuidv4 } from "uuid";
import seedProducts from "./seedProducts.js";

/**
 * Simple in-memory data store.
 *
 * This exists so the app runs immediately with `npm install && npm run dev`
 * without requiring MongoDB to be installed. The functions below mirror what
 * you'd write with Mongoose queries (models/Product.js, models/Order.js).
 *
 * TO SWITCH TO MONGODB:
 *   1. Set USE_DB=true and MONGODB_URI in backend/.env
 *   2. In controllers/productController.js and controllers/orderController.js,
 *      replace the `store.*` calls with the equivalent Mongoose model calls
 *      (e.g. Product.find(), Product.findById(id), Product.create(data), etc.)
 *
 * Data resets whenever the server restarts, since nothing is persisted to disk.
 */

let products = [...seedProducts];
let orders = [];

export const store = {
  // ----- Products -----
  getProducts: () => products,
  getProductById: (id) => products.find((p) => p.id === id),
  createProduct: (data) => {
    const product = { id: uuidv4(), available: true, ...data };
    products.push(product);
    return product;
  },
  updateProduct: (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id };
    return products[index];
  },
  deleteProduct: (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  // ----- Orders -----
  getOrders: () => orders,
  getOrderById: (id) => orders.find((o) => o.id === id),
  createOrder: (data) => {
    const order = {
      id: uuidv4(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      ...data,
    };
    orders.push(order);
    return order;
  },
  updateOrderStatus: (id, status) => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    orders[index].status = status;
    return orders[index];
  },
};
