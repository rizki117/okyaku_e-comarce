// routers/cartRouter.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/cart", verifyToken, getCart);
router.post("/cart", verifyToken, addToCart);
router.patch("/cart/item/:itemId", verifyToken, updateCartItem);
router.delete("/cart/item/:itemId", verifyToken, removeCartItem);
router.delete("/cart", verifyToken, clearCart);

export default router;