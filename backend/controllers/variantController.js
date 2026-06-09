// controllers/variantController.js
import ProductVariant from "../models/productVariants.js";
import Product from "../models/produkModel.js";

// Helper: cek ownership (seller hanya bisa akses produk miliknya)
const checkOwnership = (req, product) => {
  if (req.user.role === "seller" && product.userId !== req.user.userId) {
    const error = new Error("Akses terlarang");
    error.status = 403;
    throw error;
  }
};

// Helper: blokir buyer
const blockBuyer = (req, action = "melakukan aksi ini") => {
  if (req.user.role === "buyer") {
    const error = new Error(`Buyer tidak bisa ${action}`);
    error.status = 403;
    throw error;
  }
};

// ============================================
// TAMPIL SEMUA VARIAN PRODUK (LOGIN - Admin & Seller)
// ============================================
export const getVariantByProduk = async (req, res) => {
  const { productId } = req.params;

  // Buyer tidak boleh akses endpoint ini (ada endpoint public untuk buyer)
  blockBuyer(req, "mengakses endpoint ini");

  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // Seller hanya bisa lihat varian produk miliknya
  checkOwnership(req, product);

  const variants = await ProductVariant.findAll({
    where: { productId },
    attributes: ["id", "size", "color", "stock", "price", "is_active"],
  });

  res.status(200).json({ success: true, data: variants });
};

// ============================================
// TAMPIL VARIAN PRODUK AKTIF (PUBLIC - Buyer)
// ============================================
export const getVariantByProdukPublic = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    where: { id: productId, is_active: true },
  });

  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // Hanya tampilkan varian yang aktif
  const variants = await ProductVariant.findAll({
    where: { productId, is_active: true },
    attributes: ["id", "size", "color", "stock", "price"],
  });

  res.status(200).json({ success: true, data: variants });
};

// ============================================
// TAMBAH 1 VARIAN (Admin & Seller)
// ============================================
export const createVariant = async (req, res) => {
  blockBuyer(req, "menambah varian");

  const { productId } = req.params;
  const { size, color, stock, price } = req.body;

  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  checkOwnership(req, product);

  if (stock < 0) {
    const error = new Error("Stok tidak boleh negatif");
    error.status = 400;
    throw error;
  }

  const variant = await ProductVariant.create({
    productId,
    size: size || null,
    color: color || null,
    stock: stock || 0,
    price: price || null,
  });

  res.status(201).json({
    success: true,
    message: "Varian berhasil ditambahkan",
    data: variant,
  });
};

// ============================================
// TAMBAH BANYAK VARIAN SEKALIGUS (BULK)
// ============================================
export const bulkCreateVariant = async (req, res) => {
  blockBuyer(req, "menambah varian");

  const { productId } = req.params;
  const { variants } = req.body;

  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    const error = new Error("Variants harus berupa array dan tidak boleh kosong");
    error.status = 400;
    throw error;
  }

  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  checkOwnership(req, product);

  for (const variant of variants) {
    if (variant.stock < 0) {
      const error = new Error("Stok tidak boleh negatif");
      error.status = 400;
      throw error;
    }
  }

  const variantsData = variants.map((variant) => ({
    productId,
    size: variant.size || null,
    color: variant.color || null,
    stock: variant.stock || 0,
    price: variant.price || null,
  }));

  const result = await ProductVariant.bulkCreate(variantsData);

  res.status(201).json({
    success: true,
    message: `${result.length} varian berhasil ditambahkan`,
    data: result,
  });
};

// ============================================
// UPDATE VARIAN (Admin & Seller)
// ============================================
export const updateVariant = async (req, res) => {
  blockBuyer(req, "mengupdate varian");

  const { productId, variantId } = req.params;
  const { size, color, stock, price } = req.body;

  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  checkOwnership(req, product);

  const variant = await ProductVariant.findOne({
    where: { id: variantId, productId },
  });

  if (!variant) {
    const error = new Error("Varian tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (stock !== undefined && stock < 0) {
    const error = new Error("Stok tidak boleh negatif");
    error.status = 400;
    throw error;
  }

  await ProductVariant.update(
    {
      size: size !== undefined ? size : variant.size,
      color: color !== undefined ? color : variant.color,
      stock: stock !== undefined ? stock : variant.stock,
      price: price !== undefined ? price : variant.price,
    },
    { where: { id: variantId } }
  );

  res.status(200).json({
    success: true,
    message: "Varian berhasil diperbarui",
  });
};

// ============================================
// HAPUS VARIAN (Admin & Seller)
// ============================================
export const deleteVariant = async (req, res) => {
  blockBuyer(req, "menghapus varian");

  const { productId, variantId } = req.params;

  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.status = 404;
    throw error;
  }

  checkOwnership(req, product);

  const variant = await ProductVariant.findOne({
    where: { id: variantId, productId },
  });

  if (!variant) {
    const error = new Error("Varian tidak ditemukan");
    error.status = 404;
    throw error;
  }

  await ProductVariant.destroy({ where: { id: variantId } });

  res.status(200).json({
    success: true,
    message: "Varian berhasil dihapus",
  });
};