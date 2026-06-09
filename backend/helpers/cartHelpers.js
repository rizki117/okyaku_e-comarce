// helpers/cartHelpers.js

import Cart from "../models/cartModel.js";
import CartItem from "../models/cartItem.js";
import Product from "../models/produkModel.js";
import ProductVariant from "../models/productVariants.js";
import User from "../models/userModel.js";

/**
 * Ambil cart aktif milik user beserta items-nya (include product & variant)
 */
export const getActiveCart = (userId) =>
  Cart.findOne({
    where: { userId, status: "active" },
    include: [
      {
        model: CartItem,
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price", "userId"],
            include: [{ model: User, attributes: ["id", "name", "phone"] }],
          },
          {
            model: ProductVariant,
            attributes: ["id", "size", "color", "price"],
          },
        ],
      },
    ],
  });

/**
 * Ambil cart aktif + filter hanya item tertentu berdasarkan id/ids
 * @param {number} userId
 * @param {number|number[]} itemIds - single id atau array of ids
 */
export const getActiveCartByItems = (userId, itemIds) => {
  const where = Array.isArray(itemIds) ? { id: itemIds } : { id: itemIds };

  return Cart.findOne({
    where: { userId, status: "active" },
    include: [
      {
        model: CartItem,
        where,
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price", "userId"],
            include: [{ model: User, attributes: ["id", "name", "phone"] }],
          },
          {
            model: ProductVariant,
            attributes: ["size", "color", "price"],
          },
        ],
      },
    ],
  });
};

/**
 * Group cart items berdasarkan seller, return sellerMap dan total
 * @param {CartItem[]} cartItems
 * @returns {{ sellerMap: Object, total: number }}
 */
export const groupItemsBySeller = (cartItems) => {
  const sellerMap = {};

  cartItems.forEach((item) => {
    const seller = item.product.user;

    if (!sellerMap[seller.id]) {
      sellerMap[seller.id] = {
        sellerId: seller.id,
        sellerName: seller.name,
        sellerPhone: seller.phone,
        items: [],
        subtotal: 0,
      };
    }

    const subtotal = item.price * item.quantity;

    sellerMap[seller.id].items.push({
      name: item.product.name,
      variant: item.product_variant
        ? `${item.product_variant.size || ""} ${item.product_variant.color || ""}`.trim()
        : null,
      quantity: item.quantity,
      price: item.price,
      subtotal,
    });

    sellerMap[seller.id].subtotal += subtotal;
  });

  const total = Object.values(sellerMap).reduce((acc, s) => acc + s.subtotal, 0);

  return { sellerMap, total };
};

/**
 * Generate pesan WhatsApp untuk satu seller
 * @param {Object} seller   - dari sellerMap
 * @param {Object} order    - order yang sudah dibuat
 * @param {Object|null} alamat
 * @returns {string} pesan
 */
export const buildWhatsAppMessage = (seller, order, alamat) => {
  let pesan = `\n====================================\n🧾 Order ID: ${order.id}\nHalo ${seller.sellerName}, saya ingin memesan:\n====================================\n`;

  seller.items.forEach((item, i) => {
    pesan += `${i + 1}. ${item.name}`;
    if (item.variant) pesan += ` (${item.variant})`;
    pesan += `\n   ${item.quantity} x Rp${item.price.toLocaleString("id-ID")} = Rp${item.subtotal.toLocaleString("id-ID")}\n---------------------------------------------------------------------\n`;
  });

  // ✅ BENAR - pisah jadi 2 baris
pesan += `*Subtotal: Rp${seller.subtotal.toLocaleString("id-ID")}*\n====================================`;
pesan += `\n💳 Pembayaran: ${order.paymentMethod || "COD"}`;

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

  return pesan;
};

/**
 * Format seller dengan whatsappUrl untuk response
 * @param {Object} sellerMap
 * @param {Object} order
 * @param {Object|null} alamat
 * @returns {Array}
 */
export const formatSellersWithWhatsApp = (sellerMap, order, alamat) =>
  Object.values(sellerMap)
    .filter((s) => s.sellerPhone)
    .map((seller) => {
      const pesan = buildWhatsAppMessage(seller, order, alamat);
      return {
        sellerId: seller.sellerId,
        sellerName: seller.sellerName,
        sellerPhone: seller.sellerPhone,
        whatsappUrl: `https://wa.me/${seller.sellerPhone}?text=${encodeURIComponent(pesan)}`,
        items: seller.items,
        subtotal: seller.subtotal,
      };
    });
