// controllers/Auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import TokenModel from "../models/userSession.js";
import asyncHandler from "../middleware/asyncHandler.js";


// ========================
// LOGIN EMAIL
// ========================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (!user.is_active) {
    const error = new Error("Akun tidak aktif");
    error.status = 403;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new Error("Password salah");
    error.status = 401;
    throw error;
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.AKSES_TOKEN, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "1d",
  });

  await TokenModel.destroy({ where: { userId: user.id } });

  await TokenModel.create({
    userId: user.id,
    token: refreshToken,
    expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ========================
// REFRESH TOKEN
// ========================
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    const error = new Error("Token tidak ditemukan");
    error.status = 401;
    throw error;
  }

  const session = await TokenModel.findOne({ where: { token } });

  if (!session) {
    const error = new Error("Session tidak valid");
    error.status = 403;
    throw error;
  }

  if (session.expiredAt < new Date()) {
    await TokenModel.destroy({ where: { id: session.id } });
    const error = new Error("Token expired");
    error.status = 403;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);

  const accessToken = jwt.sign(
    { userId: decoded.userId, role: decoded.role },
    process.env.AKSES_TOKEN,
    { expiresIn: "15m" }
  );

  res.json({ success: true, accessToken });
});

// ========================
// GET ME
// ========================
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: ["id", "name", "email", "phone", "role", "photo"],
  });

  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.status = 404;
    throw error;
  }

  res.json(user);
});

// ========================
// LOGOUT
// ========================
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await TokenModel.destroy({ where: { token } });
  }

  res.clearCookie("refreshToken");

  res.json({
    success: true,
    message: "Logout berhasil",
  });
});