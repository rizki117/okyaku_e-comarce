import express from "express";
import {
  login,
  getMe,
  refreshToken,
  logout,
} from "../controllers/Auth.js";

import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// AUTH
router.post("/login", login);
router.get("/token", refreshToken);

// USER
router.get("/me", verifyToken, getMe);

// LOGOUT
router.delete("/logout", verifyToken, logout);

export default router;
