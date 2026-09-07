import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};

  const products = await Product.find(filter).sort({ createdAt: -1 });

  res.json(products);
});

// @desc    Get a single product
// @route   GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, available, stock } = req.body;

  if (!name || price === undefined || !category) {
    res.status(400);
    throw new Error("name, price and category are required");
  }

  // If an image file was uploaded, create its URL
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : image || "";

  const product = await Product.create({
    name,
    description: description || "",
    price: Number(price),
    category,
    stock: stock === undefined ? 100 : Number(stock),
    image: imageUrl,
    available:
      available === undefined
        ? true
        : available === true || available === "true",
  });

  res.status(201).json(product);
});

// @desc    Update an existing product
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, description, price, category, available, stock } = req.body;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.category = category ?? product.category;
  if (stock !== undefined) product.stock = Number(stock);

  if (available !== undefined) {
    product.available = available === true || available === "true";
  }

  // Only replace the image if a new file was uploaded
  if (req.file) {
    product.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const updated = await product.save();

  res.json(updated);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.json({ message: "Product deleted" });
});