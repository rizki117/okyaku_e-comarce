// routers/addressRouter.js
import express from "express";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Semua route address harus login
router.get("/address", verifyToken, getAddresses);
router.get("/address/:id", verifyToken, getAddressById);
router.post("/address", verifyToken, createAddress);
router.patch("/address/:id", verifyToken, updateAddress);
router.delete("/address/:id", verifyToken, deleteAddress);
router.patch("/address/:id/default", verifyToken, setDefaultAddress);

export default router;