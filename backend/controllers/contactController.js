import asyncHandler from "../utils/asyncHandler.js";
import Contact from "../models/Contact.js";

// @desc    Submit a contact enquiry
// @route   POST /api/contact
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, mobile, subject, message } = req.body;

  if (!name || !email || !mobile || !subject || !message) {
    res.status(400);
    throw new Error("All contact form fields are required");
  }

  const contact = await Contact.create({
    name,
    email,
    mobile,
    subject,
    message,
  });

  res.status(201).json({
    message: "Your enquiry has been submitted successfully",
    contact,
  });
});

// @desc    Get all contact enquiries
// @route   GET /api/contact
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.json(contacts);
});

// @desc    Update enquiry status
// @route   PATCH /api/contact/:id/status
export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = ["New", "Read", "Replied"];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid enquiry status");
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  res.json(contact);
});