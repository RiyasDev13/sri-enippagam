import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";

// @desc    Admin login
// @route   POST /api/auth/admin/login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// @desc    Customer registration
// @route   POST /api/auth/customer/register
export const customerRegister = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingCustomer = await Customer.findOne({ email });

  if (existingCustomer) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const customer = await Customer.create({
    name,
    email,
    password: hashedPassword,
    phone: phone || "",
    savedDetails: [],
  });

  const token = jwt.sign(
    {
      id: customer._id,
      role: "customer",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.status(201).json({
    token,
    customer: {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      savedDetails: customer.savedDetails,
    },
  });
});

// @desc    Customer login
// @route   POST /api/auth/customer/login
export const customerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const customer = await Customer.findOne({ email });

  if (!customer) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    customer.password
  );

  if (!passwordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: customer._id,
      role: "customer",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({
    token,
    customer: {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      savedDetails: customer.savedDetails,
    },
  });
});

export const getCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user._id).select("-password");
  res.json({ customer });
});

export const saveCustomerDetails = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email || !phone || !address) {
    res.status(400);
    throw new Error("Full name, email, mobile number and delivery address are required");
  }

  const customer = await Customer.findById(req.user._id);
  if (customer.savedDetails.length >= 5) {
    res.status(409);
    throw new Error("You can save a maximum of 5 checkout details");
  }

  customer.savedDetails.push({ name, email, phone, address });
  await customer.save();
  res.status(201).json({ savedDetails: customer.savedDetails });
});

export const deleteCustomerDetails = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user._id);
  const detail = customer.savedDetails.id(req.params.detailId);
  if (!detail) {
    res.status(404);
    throw new Error("Saved checkout details not found");
  }
  detail.deleteOne();
  await customer.save();
  res.json({ savedDetails: customer.savedDetails });
});