// controllers/checkoutController.js

import Address from "../models/addressModel.js";
import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/produkModel.js";
import ProductVariant from "../models/productVariants.js";
import User from "../models/userModel.js";
import {
  getActiveCart,
  getActiveCartByItems,
  groupItemsBySeller,
  formatSellersWithWhatsApp,
} from "../helpers/cartHelpers.js";

// ============================================
// PRIVATE HELPER: Simpan order + order items
// ============================================
const createOrderWithItems = async ({ userId, alamat, total, cartItems, paymentMethod }) => {
  const order = await Order.create({
    userId,
    addressId: alamat?.id || null,
    totalPrice: total,
    status: "pending",
    paymentMethod: paymentMethod || "COD",
    wa_sent: false,
  });

  for (const item of cartItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      variantId: item.variantId || null,
      productName: item.product.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    });
  }

  return order;
};

// ============================================
// PRIVATE HELPER: Emit socket.io event
// ============================================
const emitNewOrder = (req, { orderId, userId, total }) => {
  const io = req.app.get("io");
  io.emit("admin:new-order", { orderId, userId, total, status: "pending" });
};

// ============================================
// PRIVATE HELPER: Core checkout pipeline
// ============================================
const validatePendingLimit = async (userId) => {
  return await Order.count({
    where: {
      userId,
      status: "pending",
    },
  });
};

const processCheckout = async (req, res, cartItems) => {
  const { userId } = req.user;
  const { addressId, paymentMethod } = req.body;

  const pendingCount = await validatePendingLimit(userId);

  if (pendingCount >= 5) {
    return res.status(400).json({
      success: false,
      message:
        "Limit status pending maksimal 5. Harap hapus dulu pesanan pending.",
    });
  }

  const alamat = addressId
    ? await Address.findOne({ where: { id: addressId, userId } })
    : await Address.findOne({ where: { userId, is_default: true } });

  const { sellerMap, total } = groupItemsBySeller(cartItems);

  const order = await createOrderWithItems({
    userId,
    alamat,
    total,
    cartItems,
    paymentMethod,
  });

  emitNewOrder(req, {
    orderId: order.id,
    userId,
    total,
  });

  const sellers = formatSellersWithWhatsApp(
    sellerMap,
    order,
    alamat
  );

  return res.status(200).json({
    success: true,
    total,
    alamat: alamat || null,
    sellers,
    orderId: order.id,
  });
};
// ============================================
// CHECKOUT SEMUA ITEM
// ============================================

export const generateWhatsAppURL = async (req, res) => {
  const cart = await getActiveCart(req.user.userId);

  if (!cart || !cart.cart_items?.length) {
    return res.status(400).json({ success: false, message: "Cart kosong" });
  }

  return processCheckout(req, res, cart.cart_items);
};

// ============================================
// CHECKOUT ITEM TUNGGAL
// ============================================
export const generateWhatsAppURLSingleItem = async (req, res) => {
  const { itemId } = req.body;

  console.log("req.body:", req.body);
  console.log("itemId:", itemId);

  if (!itemId) {
    return res.status(400).json({ success: false, message: "itemId wajib diisi" });
  }

  const cart = await getActiveCartByItems(req.user.userId, itemId);

  if (!cart || !cart.cart_items?.length) {
    return res.status(404).json({ success: false, message: "Item tidak ditemukan di cart" });
  }

  return processCheckout(req, res, cart.cart_items);
};

// ============================================
// CHECKOUT MULTI ITEM
// ============================================
export const generateWhatsAppURLMultiItems = async (req, res) => {
  const { itemIds } = req.body;

  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ success: false, message: "itemIds wajib diisi" });
  }

  const cart = await getActiveCartByItems(req.user.userId, itemIds);

  if (!cart || !cart.cart_items?.length) {
    return res.status(404).json({ success: false, message: "Item tidak ditemukan" });
  }

  return processCheckout(req, res, cart.cart_items);
};

// ============================================
// MARK WA SENT
// ============================================
export const markWaSent = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const order = await Order.findOne({ where: { id, userId } });

  if (!order) {
    return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
  }

  await order.update({ wa_sent: true });

  return res.status(200).json({ success: true, message: "Order dikonfirmasi" });
};

// ============================================
// BELI LANGSUNG (TANPA CART)
// ============================================
export const buyNow = async (req, res) => {
  const userId = req.user.userId;
  


const pendingCount = await validatePendingLimit(userId);

if (pendingCount >= 5) {
  return res.status(400).json({
    success: false,
    message:
      "Limit status pending maksimal 5. Harap hapus dulu pesanan pending.",
  });
}
  
  const { productId, variantId, quantity = 1, addressId, paymentMethod } = req.body;



  const product = await Product.findOne({
    where: { id: productId, is_active: true },
    include: [{ model: User, attributes: ["id", "name", "phone"] }],
  });

  if (!product) {
    return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
  }

  let itemPrice = product.price;
  if (variantId) {
    const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
    if (variant) itemPrice = variant.price || product.price;
  }

  const subtotal = itemPrice * quantity;

  const alamat = addressId
    ? await Address.findOne({ where: { id: addressId, userId } })
    : await Address.findOne({ where: { userId, is_default: true } });

  const order = await Order.create({
    userId,
    addressId: alamat?.id || null,
    totalPrice: subtotal,
    status: "pending",
    paymentMethod: paymentMethod || "COD",
    wa_sent: false,
  });

  const io = req.app.get("io");
  io.to("admin-room").emit("order:new", {
    orderId: order.id,
    userId,
    total: subtotal,
    status: "pending",
  });

  await OrderItem.create({
    orderId: order.id,
    productId: product.id,
    variantId: variantId || null,
    productName: product.name,
    price: itemPrice,
    quantity,
    subtotal,
  });

  const seller = product.user;
  const phone = seller.phone;

  let pesan = `\n====================================`;
  pesan += `\n🧾 Order ID: ${order.id}`;
  pesan += `\nHalo ${seller.name}, saya ingin memesan:`;
  pesan += `\n====================================`;
  pesan += `\n1. ${product.name}`;
  pesan += `\n   ${quantity} x Rp${itemPrice.toLocaleString("id-ID")} = Rp${subtotal.toLocaleString("id-ID")}`;
  pesan += `\n---------------------------------------------------------------------`;
  pesan += `\n*Subtotal: Rp${subtotal.toLocaleString("id-ID")}*`;
  pesan += `\n💳 Pembayaran: ${paymentMethod || "COD"}`;
  pesan += `\n====================================`;

  if (alamat) {
    pesan += `\n📦 Alamat Pengiriman:`;
    pesan += `\nNama: ${alamat.recipient}`;
    pesan += `\nHP: ${alamat.phone}`;
    pesan += `\nAlamat: ${alamat.address}`;
    pesan += `\nKota: ${alamat.city}`;
    pesan += `\nProvinsi: ${alamat.province}`;
    pesan += `\nKode Pos: ${alamat.postal_code}`;
  } else {
    pesan += `\n⚠️ Alamat belum diisi`;
  }

  pesan += `\n====================================\nMohon konfirmasi ketersediaan. Terima kasih!`;

  return res.status(200).json({
    success: true,
    orderId: order.id,
    whatsappUrl: `https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`,
  });
};
