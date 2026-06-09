// routers/orderRouter.js
import express from "express";
import {
  getUserOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  updateOrderStatusSeller,
  getSellerOrders,
} from "../controllers/orderController.js";
import { verifyToken, requireRole } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// buyer
router.get("/order", verifyToken, getUserOrders);
router.get("/order/:id", verifyToken, getOrderById);
// buyer batalkan pesanan
router.delete("/order/:id/cancel", verifyToken, cancelOrder);

// Seller
router.get("/seller/order", verifyToken, requireRole("seller"), getSellerOrders);
router.patch("/seller/order/:id/status", verifyToken, requireRole("seller"), updateOrderStatusSeller);

// Admin
router.get("/admin/order", verifyToken, requireRole("admin"), getAllOrders);
router.patch("/admin/order/:id/status", verifyToken, requireRole("admin"), updateOrderStatus);

export default router;
