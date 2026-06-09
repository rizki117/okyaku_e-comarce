// controllers/kategoriController.js
import Category from "../models/kategoriModel.js";

// TAMPIL SEMUA KATEGORI
export const getAllKategori = async (req, res) => {
  const response = await Category.findAll({
    attributes: ["id", "name", "icon", "image", "is_active", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json(response);
};

// TAMPIL KATEGORI AKTIF
export const getActiveKategori = async (req, res) => {
  const response = await Category.findAll({
    attributes: ["id", "name", "icon", "image"],
    where: { is_active: true },
    order: [["name", "ASC"]],
  });
  res.status(200).json(response);
};

// BUAT KATEGORI BARU
export const createKategori = async (req, res) => {
  const { name, icon, image } = req.body;

  if (!name || name.trim().length < 3) {
    const error = new Error("Nama kategori minimal 3 karakter");
    error.status = 400;
    throw error;
  }

  const existing = await Category.findOne({ where: { name: name.trim() } });
  if (existing) {
    const error = new Error("Nama kategori sudah terdaftar");
    error.status = 400;
    throw error;
  }

  await Category.create({
    name: name.trim(),
    icon: icon || null,
    image: image || null,
    is_active: true,
  });

  res.status(201).json({ msg: "Kategori berhasil dibuat" });
};

// AMBIL KATEGORI BERDASARKAN ID
export const getKategoriById = async (req, res) => {
  const response = await Category.findOne({
    attributes: ["id", "name", "icon", "image", "is_active"],
    where: { id: req.params.id }, // ← pakai id
  });

  if (!response) {
    const error = new Error("Kategori tidak ditemukan");
    error.status = 404;
    throw error;
  }

  res.status(200).json(response);
};

// UPDATE KATEGORI
export const updateKategori = async (req, res) => {
  const { name, icon, image, is_active } = req.body;

  const kategori = await Category.findOne({ where: { id: req.params.id } });
  if (!kategori) {
    const error = new Error("Kategori tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (name && name.trim().length < 3) {
    const error = new Error("Nama kategori minimal 3 karakter");
    error.status = 400;
    throw error;
  }

  if (name && name.trim() !== kategori.name) {
    const existing = await Category.findOne({ where: { name: name.trim() } });
    if (existing) {
      const error = new Error("Nama kategori sudah digunakan");
      error.status = 400;
      throw error;
    }
  }

  await Category.update(
    {
      name: name ? name.trim() : kategori.name,
      icon: icon !== undefined ? icon : kategori.icon,
      image: image !== undefined ? image : kategori.image,
      is_active: is_active !== undefined ? is_active : kategori.is_active,
    },
    { where: { id: req.params.id } }
  );

  res.status(200).json({ msg: "Kategori berhasil diperbarui" });
};

// DELETE KATEGORI
export const deleteKategori = async (req, res) => {
  const kategori = await Category.findOne({ where: { id: req.params.id } });
  if (!kategori) {
    const error = new Error("Kategori tidak ditemukan");
    error.status = 404;
    throw error;
  }

  await Category.destroy({ where: { id: req.params.id } });
  res.status(200).json({ msg: "Kategori berhasil dihapus" });
};

// TOGGLE STATUS AKTIF
export const toggleKategoriStatus = async (req, res) => {
  const kategori = await Category.findOne({ where: { id: req.params.id } });
  if (!kategori) {
    const error = new Error("Kategori tidak ditemukan");
    error.status = 404;
    throw error;
  }

  await Category.update(
    { is_active: !kategori.is_active },
    { where: { id: req.params.id } }
  );

  res.status(200).json({
    msg: `Kategori ${kategori.is_active ? "dinonaktifkan" : "diaktifkan"}`,
    is_active: !kategori.is_active,
  });
};