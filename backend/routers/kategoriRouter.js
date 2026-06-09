import express from "express";
import {
  getAllKategori,
  getActiveKategori,
  createKategori,
  getKategoriById,
  updateKategori,
  deleteKategori,
  toggleKategoriStatus
} from "../controllers/kategoriController.js";

import { verifyToken, requireRole } from "../middleware/AuthMiddleware.js"; 




const router = express.Router();

// Public - siapa saja bisa lihat kategori aktif
router.get('/kategori/active', verifyToken, requireRole("admin", "seller", "buyer"), getActiveKategori);

// Protected - hanya admin
router.get('/kategori', verifyToken, requireRole("admin"), getAllKategori);
router.post('/kategori', verifyToken, requireRole("admin"), createKategori);
router.get('/kategori/:id', verifyToken, requireRole("admin"), getKategoriById);
router.patch('/kategori/:id', verifyToken, requireRole("admin"), updateKategori);
router.delete('/kategori/:id', verifyToken, requireRole("admin"), deleteKategori);
router.patch('/kategori/:id/toggle', verifyToken, requireRole("admin"), toggleKategoriStatus);

export default router;
