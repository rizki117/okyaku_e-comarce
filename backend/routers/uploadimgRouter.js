//routers/uploadimgRouter.js

import express from "express";
import {uploadProduk} from "../middleware/multiUpload.js";

import {
  createProduk,
  updateProduk,
  deleteProduk,
  addGambarProduk,
  replaceGambarProduk,
} from "../controllers/produkImgController.js";

import { verifyToken, requireRole } from "../middleware/AuthMiddleware.js";
import cleanBodyMiddleware from "../middleware/cleanBodyMiddleware.js";

const router = express.Router();

// ✅ Helper wrapper untuk handle error multer
const multerHandler = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};


// CREATE PRODUK
router.post(
  "/produk",
  verifyToken,
  requireRole("admin", "seller"),
  multerHandler(uploadProduk.array("image", 5)), // ✅
  cleanBodyMiddleware,
  createProduk
);

// UPDATE PRODUK
router.patch(
  "/produk/:id",
  verifyToken,
  requireRole("admin", "seller"),
  multerHandler(uploadProduk.array("image", 5)), // ✅
  cleanBodyMiddleware,
  updateProduk
);


// TAMBAH GAMBAR (append)
router.patch(
  "/produk/:id/gambar",
  verifyToken,
  requireRole("admin", "seller"),
  multerHandler(uploadProduk.array("image", 5)), // ✅
  cleanBodyMiddleware,
  addGambarProduk
);


// DELETE PRODUK
router.delete(
  "/produk/:id",
  verifyToken,
  requireRole("admin", "seller"),
  deleteProduk
);


// REPLACE 1 GAMBAR BERDASARKAN INDEX
router.patch(
  "/produk/:id/gambar/:index",
  verifyToken,
  requireRole("admin", "seller"),
  multerHandler(uploadProduk.array("image", 1)),
  cleanBodyMiddleware,
  replaceGambarProduk
);

export default router;
