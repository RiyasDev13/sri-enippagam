import express from "express";
import {
  adminLogin,
  customerLogin,
  customerRegister,
  getCustomerProfile,
  saveCustomerDetails,
  deleteCustomerDetails,
} from "../controllers/authController.js";
import { protectAdmin, protectCustomer } from "../middleware/auth.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.get("/admin/profile", protectAdmin, (req, res) => {
  res.json({
    admin: req.user,
  });
});

router.post("/customer/register", customerRegister);
router.post("/customer/login", customerLogin);

router.get("/customer/profile", protectCustomer, getCustomerProfile);
router.post("/customer/saved-details", protectCustomer, saveCustomerDetails);
router.delete("/customer/saved-details/:detailId", protectCustomer, deleteCustomerDetails);

export default router;