// controllers/orderController.js
import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/produkModel.js";
import ProductVariant from "../models/productVariants.js";
import User from "../models/userModel.js";
import Address from "../models/addressModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


// ===============================
// GET ORDER USER (Riwayat)
// ===============================
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        include: [
          { model: Product, attributes: ["id", "name", "image"] },
          { model: ProductVariant, attributes: ["id", "size", "color"] },
        ],
      },
      {
        model: Address,
        attributes: ["id", "label", "recipient", "address", "city"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ success: true, data: orders });
});

// ===============================
// GET ALL ORDERS (ADMIN)
// ===============================
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [
      {
        model: OrderItem,
        include: [
          { model: Product, attributes: ["id", "name", "image"] },
          { model: ProductVariant, attributes: ["id", "size", "color"] },
        ],
      },
      {
        model: User, attributes: ["id", "name", "email", "phone"],
      },
      {
        model: Address,
        attributes: ["id", "label", "recipient", "address", "city"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ success: true, data: orders });
});

// ===============================
// GET ORDER BY ID
// ===============================
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
    include: [
      {
        model: OrderItem,
        include: [
          { model: Product, attributes: ["id", "name", "image"] },
          { model: ProductVariant, attributes: ["id", "size", "color"] },
        ],
      },
      {
        model: Address,
        attributes: ["id", "label", "recipient", "address", "city", "phone"],
      },
    ],
  });

  if (!order) {
    const error = new Error("Order tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // ✅ Buyer hanya bisa lihat ordernya sendiri
  if (req.user.role === "buyer" && order.userId !== req.user.userId) {
    const error = new Error("Akses terlarang");
    error.status = 403;
    throw error;
  }

  res.status(200).json({ success: true, data: order });
});

// ===============================
// UPDATE STATUS ORDER (ADMIN)
// ===============================
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["pending", "confirmed", "processing", "shipped", "completed", "cancelled"];
  if (!validStatus.includes(status)) {
    const error = new Error("Status tidak valid");
    error.status = 400;
    throw error;
  }

  const order = await Order.findByPk(id);

  if (!order) {
    const error = new Error("Order tidak ditemukan");
    error.status = 404;
    throw error;
  }

  await order.update({ status });

  // ✅ Fix: emit ke room user yang bersangkutan
  const io = req.app.get("io");
  io.to(`user:${order.userId}`).emit("order:status-updated", {
    orderId: order.id,
    status,
  });

  res.status(200).json({
    success: true,
    message: "Status order berhasil diupdate",
  });
});

// Seller hanya bisa konfirmasi order yang produknya milik dia

// ===============================
//  SELLER KONFIRMASI (order masuk ke toko)
// ===============================
export const updateOrderStatusSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sellerId = req.user.userId;

  // Seller hanya boleh ubah ke status ini
  const allowedStatus = ["confirmed", "processing", "shipped"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: "Seller hanya bisa ubah status ke confirmed, processing, atau shipped" 
    });
  }

  // Cek apakah order punya produk milik seller ini
  const orderItem = await OrderItem.findOne({
    where: { orderId: id },
    include: [
      {
        model: Product,
        where: { userId: sellerId },
        attributes: ["id", "userId"],
      },
    ],
  });

  if (!orderItem) {
    return res.status(403).json({ 
      success: false, 
      message: "Anda tidak punya akses ke order ini" 
    });
  }

  const order = await Order.findByPk(id);
  await order.update({ status });

  const io = req.app.get("io");
  io.to(`user:${order.userId}`).emit("order:status-updated", {
    orderId: order.id,
    status,
  });

  res.status(200).json({ success: true, message: "Status order berhasil diupdate" });
});




// ===============================
// GET ORDER SELLER (order masuk ke toko)
// ===============================
export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user.userId;

  const orders = await Order.findAll({
    include: [
      {
        model: OrderItem,
        required: true, // ✅ wajib ada item
        include: [
          {
            model: Product,
            where: { userId: sellerId },
            required: true, // ✅ wajib produk milik seller
            attributes: ["id", "name", "image"],
          },
          { model: ProductVariant, attributes: ["id", "size", "color"] },
        ],
      },
      {
        model: User, attributes: ["id", "name", "phone"],
      },
      {
        model: Address,
        attributes: ["id", "label", "recipient", "address", "city"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ success: true, data: orders });
});



// ===============================
// BATALKAN ORDER ATAU HAPUS ORDER
// ===============================
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const order = await Order.findOne({ where: { id, userId } });

  if (!order) {
    const error = new Error("Order tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // Hanya bisa hapus kalau masih pending
  if (order.status !== "pending") {
    const error = new Error("Pesanan tidak bisa dibatalkan");
    error.status = 400;
    throw error;
  }
  
  // Hapus items dulu
await OrderItem.destroy({ where: { orderId: id } });

  // Hapus order dari database
  await Order.destroy({ where: { id, userId } });

  res.status(200).json({
    success: true,
    message: "Pesanan berhasil dibatalkan",
  });
});
