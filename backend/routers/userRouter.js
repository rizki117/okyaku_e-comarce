//routers/userRouter.js

import express from "express";
import {uploadAvatar} from "../middleware/multiUpload.js";

import cleanBodyMiddleware from "../middleware/cleanBodyMiddleware.js";

import {
  getAllUser,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  getUserStats,
} from "../controllers/userController.js";
import { verifyToken, requireRole } from "../middleware/AuthMiddleware.js"; // ← ganti

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


// userRouter.js
router.get("/user/stats", verifyToken, requireRole("admin", "seller"), getUserStats);


// ========================
// ADMIN ONLY
// ========================
router.post("/user", verifyToken, requireRole("admin"), createUser);
router.get("/user", verifyToken, requireRole("admin"), getAllUser);
router.get("/user/:id", verifyToken, requireRole("admin"), getUserById);

router.patch("/user/:id", verifyToken, requireRole("admin", "seller"), multerHandler(uploadAvatar.array("image", 1)),
  cleanBodyMiddleware, updateUser);
  
router.delete("/user/:id", verifyToken, requireRole("admin"), deleteUser);

export default router;
