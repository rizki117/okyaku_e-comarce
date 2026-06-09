// controllers/produkImgController.js

import fs from "fs";
import path from "path";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/produkModel.js";
import Category from "../models/kategoriModel.js";
import {
  emitProdukCreated,
  emitProdukUpdated,
  emitProdukDeleted,
  emitGambarAdded,
} from "../utils/emitCrudProduk.js";

// helper hapus file
const deleteFiles = (files) => {
  if (files && files.length > 0) {
    files.forEach((file) => {
      const filePath = path.join("public", "gambarproduk", file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  }
};

// ============================================
// CREATE PRODUK
// ============================================
export const createProduk = asyncHandler(async (req, res) => {
  const { name, description, price, categoryId } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Gambar produk wajib diupload",
    });
  }

  if (!name || !price || !categoryId) {
    deleteFiles(req.files);
    return res.status(400).json({
      success: false,
      message: "Nama, harga, dan kategori wajib diisi",
    });
  }

  if (Number(price) < 0) {
    deleteFiles(req.files);
    return res.status(400).json({
      success: false,
      message: "Harga tidak boleh negatif",
    });
  }

  const category = await Category.findOne({
    where: { id: categoryId, is_active: true },
  });

  if (!category) {
    deleteFiles(req.files);
    return res.status(400).json({
      success: false,
      message: "Kategori tidak valid atau tidak aktif",
    });
  }

  const image = JSON.stringify(req.files.map((f) => f.filename));

  try {
    const produk = await Product.create({
      userId: req.user.userId,
      categoryId,
      name,
      description: description || null,
      price: Number(price),
      image,
      is_active: true,
    });

    // ── SOCKET EMIT ──────────────────────────────
    const io = req.app.get("io");
    emitProdukCreated(io, produk, req.user.userId);
    // ─────────────────────────────────────────────

    res.status(201).json({
      success: true,
      message: "Produk berhasil dibuat",
      data: produk,
    });
  } catch (err) {
    deleteFiles(req.files);
    throw err;
  }
});

// ============================================
// TAMBAH GAMBAR PRODUK (append, tidak replace)
// ============================================
export const addGambarProduk = asyncHandler(async (req, res) => {
  const produk = await Product.findOne({ where: { id: req.params.id } });

  if (!produk) {
    deleteFiles(req.files);
    return res.status(404).json({
      success: false,
      message: "Produk tidak ditemukan",
    });
  }

  if (req.user.role === "seller" && produk.userId !== req.user.userId) {
    deleteFiles(req.files);
    return res.status(403).json({
      success: false,
      message: "Akses terlarang: bukan produk milikmu",
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada gambar yang diupload",
    });
  }

  let existingImages = [];
  if (produk.image) {
    try {
      existingImages = JSON.parse(produk.image);
    } catch {
      existingImages = [produk.image];
    }
  }

  const newImages = req.files.map((f) => f.filename);
  const mergedImages = [...existingImages, ...newImages];
  const mergedImagesJSON = JSON.stringify(mergedImages);

  try {
    await Product.update(
      { image: mergedImagesJSON },
      { where: { id: req.params.id } }
    );

    // ── SOCKET EMIT ──────────────────────────────
    const io = req.app.get("io");
    emitGambarAdded(io, req.params.id, mergedImages, req.user.userId);
    // ─────────────────────────────────────────────

    res.status(200).json({
      success: true,
      message: "Gambar berhasil ditambahkan",
      data: { images: mergedImages },
    });
  } catch (err) {
    deleteFiles(req.files);
    throw err;
  }
});

// ============================================
// UPDATE PRODUK
// ============================================
export const updateProduk = asyncHandler(async (req, res) => {


  const produk = await Product.findOne({ where: { id: req.params.id } });

  if (!produk) {
    deleteFiles(req.files);
    return res.status(404).json({
      success: false,
      message: "Produk tidak ditemukan",
    });
  }

  if (req.user.role === "seller" && produk.userId !== req.user.userId) {
    deleteFiles(req.files);
    return res.status(403).json({
      success: false,
      message: "Akses terlarang: bukan produk milikmu",
    });
  }

  const { name, description, price, categoryId, is_active } = req.body;

  if (price !== undefined && Number(price) < 0) {
    deleteFiles(req.files);
    return res.status(400).json({
      success: false,
      message: "Harga tidak boleh negatif",
    });
  }

  if (categoryId) {
    const category = await Category.findOne({
      where: { id: categoryId, is_active: true },
    });
    if (!category) {
      deleteFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid atau tidak aktif",
      });
    }
  }

  let image = produk.image;

  if (req.files && req.files.length > 0) {
    // Hapus file lama dulu
    if (produk.image) {
      try {
        const oldImages = JSON.parse(produk.image);
        oldImages.forEach((file) => {
          const oldPath = path.join("public", "gambarproduk", file);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        });
      } catch {
        const oldPath = path.join("public", "gambarproduk", produk.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    image = JSON.stringify(req.files.map((f) => f.filename));
  }

  const updatedFields = {
    name: name || produk.name,
    description: description !== undefined ? description : produk.description,
    price: price !== undefined ? Number(price) : produk.price,
    image,
    categoryId: categoryId || produk.categoryId,
    is_active: is_active !== undefined ? is_active : produk.is_active,
  };

  try {
    await Product.update(updatedFields, { where: { id: req.params.id } });

    // ── SOCKET EMIT ──────────────────────────────
    const updatedProduk = {
      ...produk.dataValues,
      ...updatedFields,
      updatedAt: new Date(),
    };
    const io = req.app.get("io");
    emitProdukUpdated(io, updatedProduk, req.user.userId);
    // ─────────────────────────────────────────────

    res.status(200).json({
      success: true,
      message: "Produk berhasil diupdate",
    });
  } catch (err) {
    deleteFiles(req.files);
    throw err;
  }
});


// ============================================
// DELETE PRODUK
// ============================================
export const deleteProduk = asyncHandler(async (req, res) => {
  const produk = await Product.findOne({ where: { id: req.params.id } });

  if (!produk) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
  }

  if (req.user.role === "seller" && produk.userId !== req.user.userId) {
    return res.status(403).json({ success: false, message: "Akses terlarang: bukan produk milikmu" });
  }

  try {
    // Coba hapus dari DB dulu
    await Product.destroy({ where: { id: req.params.id } });

    // Baru hapus file gambar (hanya jika destroy berhasil)
    if (produk.image) {
      try {
        const gambarList = JSON.parse(produk.image);
        gambarList.forEach((filename) => {
          const filePath = path.join("public", "gambarproduk", filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      } catch {
        const filePath = path.join("public", "gambarproduk", produk.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    const io = req.app.get("io");
    emitProdukDeleted(io, req.params.id, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Produk berhasil dihapus",
      deactivated: false,
    });

  } catch (err) {
    // Foreign key → nonaktifkan, gambar TIDAK dihapus
    if (err.name === "SequelizeForeignKeyConstraintError") {
      await Product.update(
        { is_active: false },
        { where: { id: req.params.id } }
      );

      return res.status(200).json({
        success: true,
        message: "Produk ada di order, status diubah menjadi Nonaktif",
        deactivated: true,
      });
    }

    throw err;
  }
});



// ============================================
// REPLACE 1 GAMBAR BERDASARKAN INDEX
// ============================================
export const replaceGambarProduk = asyncHandler(async (req, res) => {
  const produk = await Product.findOne({ where: { id: req.params.id } });

  if (!produk) {
    deleteFiles(req.files);
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
  }

  if (req.user.role === "seller" && produk.userId !== req.user.userId) {
    deleteFiles(req.files);
    return res.status(403).json({ success: false, message: "Akses terlarang" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "Tidak ada gambar" });
  }

  const index = parseInt(req.params.index);
  let images = [];

  try {
    images = JSON.parse(produk.image);
  } catch {
    images = [produk.image];
  }

  if (index < 0 || index >= images.length) {
    deleteFiles(req.files);
    return res.status(400).json({ success: false, message: "Index gambar tidak valid" });
  }

  // Hapus gambar lama pada index tersebut
  const oldPath = path.join("public", "gambarproduk", images[index]);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

  // Replace gambar pada index tersebut
  images[index] = req.files[0].filename;

  await Product.update(
    { image: JSON.stringify(images) },
    { where: { id: req.params.id } }
  );

  return res.status(200).json({
    success: true,
    message: "Gambar berhasil diganti",
    data: { images },
  });
});