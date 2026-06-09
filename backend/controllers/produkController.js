//controllers/produkController.js

import fs from "fs";
import path from "path";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/produkModel.js";
import User from "../models/userModel.js";
import Category from "../models/kategoriModel.js";
import ProductVariant from "../models/productVariants.js";
import { Op } from "sequelize";

// ============================================
// TAMPIL SEMUA PRODUK
// Admin  : semua produk (aktif & nonaktif)
// Seller : hanya produk miliknya
// ============================================
export const getAllProduk = asyncHandler(async (req, res) => {
  let whereCondition = {};

  if (req.user.role === "seller") {
    whereCondition.userId = req.user.userId;
  }

  const response = await Product.findAll({
    attributes: ["id", "name", "description", "price", "image", "is_active"],
    where: whereCondition,
    include: [
      { model: User, attributes: ["id", "name", "email", "phone"] },
      { model: Category, attributes: ["id", "name"] },
      {
        model: ProductVariant,
        attributes: ["id", "size", "color", "stock", "price"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // ← TAMBAH INI
  const formatted = response.map((p) => ({
    ...p.toJSON(),
    image: p.image ? JSON.parse(p.image) : [],
  }));

  res.status(200).json({ success: true, data: formatted }); // ← ganti response → formatted
});

// ============================================
// TAMPIL SEMUA PRODUK AKTIF (PUBLIC / BUYER)
// ============================================
export const getActiveProduk = asyncHandler(async (req, res) => {
  const response = await Product.findAll({
    attributes: [
      "id",
      "name",
      "description",
      "price",
      "image",
    ],
    where: {
      is_active: true,
    },
    include: [
      {
        model: User,
        attributes: [
          "id",
          "name",
          "phone",
        ],
      },
      {
        model: Category,
        attributes: [
          "id",
          "name",
        ],
      },
      {
        model: ProductVariant,
        attributes: [
          "id",
          "size",
          "color",
          "stock",
          "price",
        ],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // =========================
  // FORMAT IMAGE
  // =========================
  const formatted = response.map((p) => ({
    ...p.toJSON(),
    image: p.image
      ? JSON.parse(p.image)
      : [],
  }));

  res.status(200).json({
    success: true,
    data: formatted,
  });
});

// ============================================
// TAMPIL PRODUK BERDASARKAN KATEGORI (PUBLIC)
// ============================================
export const getProdukByKategori = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({
    where: { id: categoryId, is_active: true },
  });

  if (!category) {
    const error = new Error("Kategori tidak ditemukan");
    error.status = 404;
    throw error;
  }

  const response = await Product.findAll({
    attributes: ["id", "name", "description", "price", "image"],
    where: { categoryId, is_active: true },
    include: [
      { model: User, attributes: ["id", "name", "phone"] },
      { model: Category, attributes: ["id", "name"] },
      {
        model: ProductVariant,
        attributes: ["id", "size", "color", "stock", "price"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    category: category.name,
    data: response,
  });
});

// ============================================
// TAMPIL PRODUK BERDASARKAN SELLER (PUBLIC)
// ============================================
export const getProdukByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const response = await Product.findAll({
    attributes: ["id", "name", "description", "price", "image"],
    where: { userId, is_active: true },
    include: [
      { model: User, attributes: ["id", "name", "photo"] },
      { model: Category, attributes: ["id", "name"] },
      {
        model: ProductVariant,
        attributes: ["id", "size", "color", "stock", "price"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (response.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Seller ini belum punya produk",
      data: [],
    });
  }

  res.status(200).json({ success: true, data: response });
});

// ============================================
// SEARCH PRODUK
// Admin  : semua produk
// Seller : produk miliknya
// Buyer/Public : produk aktif saja
// ============================================
export const searchProduk = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const role = req.user?.role; // ← fix: aman kalau tidak login

  let whereCondition = {};

  if (role === "admin") {
    whereCondition = {};
  } else if (role === "seller") {
    whereCondition.userId = req.user.userId;
  } else {
    whereCondition.is_active = true; // buyer / public
  }

  if (keyword) {
    whereCondition.name = { [Op.like]: `%${keyword}%` };
  }

  const response = await Product.findAll({
    attributes: ["id", "name", "description", "price", "image", "is_active"],
    where: whereCondition,
    include: [
      { model: User, attributes: ["id", "name", "photo"] },
      { model: Category, attributes: ["id", "name"] },
      {
        model: ProductVariant,
        attributes: ["id", "size", "color", "stock", "price"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (response.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Produk tidak ditemukan",
      data: [],
    });
  }

  res.status(200).json({ success: true, data: response });
});

// ============================================
// DETAIL PRODUK + VARIANT (PUBLIC / BUYER)
// ============================================
export const getProdukWithVariant = asyncHandler(async (req, res) => {
  const produk = await Product.findOne({
    attributes: ["id", "name", "description", "price", "image", "is_active"],
    where: { id: req.params.id, is_active: true },
    include: [
      { model: User, attributes: ["id", "name", "phone"] },
      { model: Category, attributes: ["id", "name"] },
      {
        model: ProductVariant,
        attributes: ["id", "size", "color", "stock", "price"],
        required: false,
      },
    ],
  });

  if (!produk) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: produk });
});

// ============================================
// AMBIL PRODUK BY ID
// Admin  : semua produk
// Seller : hanya produk miliknya
// Buyer  : hanya produk aktif
// ============================================
export const getProdukById = asyncHandler(async (req, res) => {
  const produk = await Product.findOne({
    attributes: ["id", "name", "description", "price", "image", "is_active", "userId"],
    where: { id: req.params.id },
    include: [
      { model: User, attributes: ["id", "name", "email", "phone"] },
      { model: Category, attributes: ["id", "name"] },
      {
        model: ProductVariant,
        attributes: ["id", "size", "color", "stock", "price"],
        required: false,
      },
    ],
  });

  if (!produk) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (req.user.role === "seller" && produk.userId !== req.user.userId) {
    const error = new Error("Akses terlarang");
    error.status = 403;
    throw error;
  }

  if (req.user.role === "buyer" && !produk.is_active) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: produk });
});

// ============================================
// BUAT PRODUK
// Admin  : bisa buat atas nama siapapun
// Seller : atas namanya sendiri
// Buyer  : tidak bisa → 403
// ============================================






// ============================================
// TOGGLE STATUS PRODUK
// Admin  : semua produk
// Seller : hanya produk miliknya
// Buyer  : tidak bisa → 403
// ============================================
export const toggleProdukStatus = asyncHandler(async (req, res) => {
  if (req.user.role === "buyer") {
    const error = new Error("Buyer tidak bisa mengubah status produk");
    error.status = 403;
    throw error;
  }

  const produk = await Product.findOne({ where: { id: req.params.id } });

  if (!produk) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (req.user.role === "seller" && produk.userId !== req.user.userId) {
    const error = new Error("Akses terlarang: bukan produk milikmu");
    error.status = 403;
    throw error;
  }

  await Product.update(
    { is_active: !produk.is_active },
    { where: { id: req.params.id } }
  );

  res.status(200).json({
    success: true,
    message: `Produk berhasil ${produk.is_active ? "dinonaktifkan" : "diaktifkan"}`,
  });
});
