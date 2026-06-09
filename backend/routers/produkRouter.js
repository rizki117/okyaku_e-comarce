// routers/produkRouter.js
import express from "express";
import {
  getAllProduk,
  getActiveProduk,
  getProdukByKategori,
  getProdukWithVariant,
  getProdukByUser,
  getProdukById,
  searchProduk,
  toggleProdukStatus,
} from "../controllers/produkController.js";



import { verifyToken, requireRole } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ========================
// PUBLIC - tanpa login
// ========================
router.get("/produk/active", getActiveProduk);
router.get("/produk/search", searchProduk);
router.get("/produk/user/:userId", getProdukByUser);
router.get("/produk/kategori/:categoryId", getProdukByKategori);
router.get("/produk/:id/detail", getProdukWithVariant);

// ========================
// PROTECTED - harus login
// ========================
router.get("/produk", verifyToken, getAllProduk);
router.get("/produk/:id", verifyToken, getProdukById);

router.patch(
  "/produk/:id/toggle-status",
  verifyToken,
  requireRole("admin", "seller"),
  toggleProdukStatus
);

export default router;