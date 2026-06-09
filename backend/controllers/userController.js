// controllers/userController.js
// controllers/userController.js
import fs from "fs";
import path from "path";

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllUser = asyncHandler(async (req, res) => {
  const response = await User.findAll({
    attributes: ["id", "name", "email", "role", "phone", "photo", "is_active"],
  });
  res.status(200).json(response);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, confPassword, role, phone } = req.body;

  if (password !== confPassword) {
    const error = new Error("Konfirmasi password tidak sesuai");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error("Email sudah terdaftar");
    error.status = 400;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashPassword,
    role: role || "seller",
    phone,
  });

  res.status(201).json({ msg: "Registrasi Berhasil" });
});

export const getUserById = asyncHandler(async (req, res) => {
  const response = await User.findOne({
    attributes: ["id", "name", "email", "role", "phone", "photo", "is_active"],
    where: { id: req.params.id },
  });

  if (!response) {
    const error = new Error("User tidak ditemukan");
    error.status = 404;
    throw error;
  }

  res.status(200).json(response);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.status = 404;
    throw error;
  }
  
  // ✅ Hapus foto dari folder jika ada
  if (user.photo) {
    const photoPath = path.join(process.cwd(), "public", "avatar", user.photo);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  }

  await User.destroy({ where: { id: user.id } });

  res.status(200).json({ msg: "User berhasil dihapus" });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, confPassword, role, phone, is_active } = req.body;

  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // ── Handle password ──────────────────────────────────────────
  let hashPassword = user.password;

  if (password || confPassword) {
    if (password !== confPassword) {
      if (req.files?.length > 0) {
        fs.unlinkSync(req.files[0].path);
      }
      const error = new Error("Konfirmasi password tidak sesuai");
      error.status = 400;
      throw error;
    }
    hashPassword = await bcrypt.hash(password, 10);
  }

  // ── Handle foto ──────────────────────────────────────────────
  let photo = user.photo;

  if (req.files && req.files.length > 0) {
    if (user.photo) {
      const oldPath = path.join(process.cwd(), "public", "avatar", user.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    photo = req.files[0].filename;
  }

  // ── Update database ──────────────────────────────────────────
  await User.update(
    {
      name: name || user.name,
      email: email || user.email,
      password: hashPassword,
      role: role || user.role,
      phone: phone ?? user.phone,
      photo,
      // ✅ Toggle is_active — hanya diupdate jika dikirim dari frontend
      ...(is_active !== undefined && { is_active }),
    },
    { where: { id: req.params.id } }
  );

  res.status(200).json({ msg: "User berhasil diperbarui" });
});




export const getUserStats = asyncHandler(async (req, res) => {
  const sellers   = await User.count({ where: { role: "seller" } });
  const buyers    = await User.count({ where: { role: "buyer" } });
  res.status(200).json({ sellers, buyers });
});