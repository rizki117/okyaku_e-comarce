import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import TokenModel from "../models/userSession.js";
import asyncHandler from "../middleware/asyncHandler.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ========================
// GOOGLE LOGIN
// ========================
export const googleLogin = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    const error = new Error("Token Google tidak ditemukan");
    error.status = 400;
    throw error;
  }

  // verify Google token
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub, name, email, picture } = ticket.getPayload();

  if (!email) {
    const error = new Error("Email tidak ditemukan dari Google");
    error.status = 400;
    throw error;
  }

  // ========================
  // FIND OR CREATE USER
  // ========================
  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({
      google_id: sub,
      name,
      email,
      photo: picture,
      password: null,
      role: "buyer",
      is_active: true,
    });
  } else {
    if (!user.google_id) {
      await user.update({
        google_id: sub,
        photo: picture,
      });
    }
  }

  // ========================
  // CHECK ACTIVE USER
  // ========================
  if (!user.is_active) {
    const error = new Error("Akun tidak aktif");
    error.status = 403;
    throw error;
  }

  // ========================
  // JWT PAYLOAD
  // ========================
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

  // ========================
  // 1 USER 1 DEVICE
  // ========================
  await TokenModel.destroy({ where: { userId: user.id } });

  await TokenModel.create({
    userId: user.id,
    token: refreshToken,
    expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // ========================
  // COOKIE
  // ========================
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // ========================
  // RESPONSE
  // ========================
  res.json({
    success: true,
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
    },
  });
});