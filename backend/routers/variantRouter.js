// routers/variantRouter.js
import express from "express";
import {
  getVariantByProduk,
  getVariantByProdukPublic,
  createVariant,
  bulkCreateVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/variantController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ========================
// PUBLIC - tanpa login
// ========================
router.get("/produk/:productId/variant/public", getVariantByProdukPublic);

// ========================
// PROTECTED - harus login
// ========================
router.get("/produk/:productId/variant", verifyToken, getVariantByProduk);

// ← bulk harus di atas single!
router.post("/produk/:productId/variant/bulk", verifyToken, bulkCreateVariant);

router.post("/produk/:productId/variant", verifyToken, createVariant);

router.patch("/produk/:productId/variant/:variantId", verifyToken, updateVariant);
router.delete("/produk/:productId/variant/:variantId", verifyToken, deleteVariant);

export default router;