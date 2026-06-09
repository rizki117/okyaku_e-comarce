// controllers/cartController.js

import db from "../config/Database.js";
import Cart from "../models/cartModel.js";
import CartItem from "../models/cartItem.js";
import Product from "../models/produkModel.js";
import ProductVariant from "../models/productVariants.js";
import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// ============================================
// HELPER: AMBIL CART AKTIF
// ============================================
const getActiveCart = async (userId, options = {}) => {
  return await Cart.findOne({
    where: { userId, status: "active" },
    ...options,
  });
};

// ============================================
// TAMPIL CART AKTIF
// ============================================
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getActiveCart(req.user.userId, {
    include: [
      {
        model: CartItem,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price", "image", "is_active"],
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

  if (!cart || !cart.cart_items?.length) {
    return res.status(200).json({
      success: true,
      message: "Cart kosong",
      data: null,
      total: 0,
    });
  }

  const total = cart.cart_items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  res.status(200).json({ success: true, data: cart, total });
});

// ============================================
// TAMBAH PRODUK KE CART
// ============================================
export const addToCart = asyncHandler(async (req, res) => {
  const t = await db.transaction();

  try {
    const { productId, variantId, quantity } = req.body;

    if (!productId) {
      const error = new Error("ProductId wajib diisi");
      error.status = 400;
      throw error;
    }

    if (quantity !== undefined && (isNaN(quantity) || quantity < 1)) {
      const error = new Error("Quantity minimal 1");
      error.status = 400;
      throw error;
    }

    const finalQuantity = quantity || 1;

    const product = await Product.findOne({
      where: { id: productId, is_active: true },
      transaction: t,
    });

    if (!product) {
      const error = new Error("Produk tidak ditemukan atau tidak aktif");
      error.status = 404;
      throw error;
    }

    let itemPrice = product.price;

    if (variantId) {
      const variant = await ProductVariant.findOne({
        where: { id: variantId, productId },
        transaction: t,
      });

      if (!variant) {
        const error = new Error("Varian produk tidak ditemukan");
        error.status = 404;
        throw error;
      }

      itemPrice = variant.price || product.price;
    }

    let cart = await Cart.findOne({
      where: { userId: req.user.userId, status: "active" },
      transaction: t,
    });

    if (!cart) {
      cart = await Cart.create(
        { userId: req.user.userId, status: "active" },
        { transaction: t }
      );
    }

    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId, variantId: variantId || null },
      transaction: t,
    });

    if (existingItem) {
      await CartItem.update(
        { quantity: existingItem.quantity + finalQuantity },
        { where: { id: existingItem.id }, transaction: t }
      );
    } else {
      await CartItem.create(
        {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity: finalQuantity,
          price: itemPrice,
        },
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan ke cart",
    });
  } catch (error) {
    await t.rollback();
    throw error; // ← lempar ke asyncHandler → errorHandler
  }
});

// ============================================
// UPDATE QUANTITY ITEM DI CART
// ============================================
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (!quantity || isNaN(quantity) || quantity < 1) {
    const error = new Error("Quantity minimal 1");
    error.status = 400;
    throw error;
  }

  const cart = await getActiveCart(req.user.userId);

  if (!cart) {
    const error = new Error("Cart tidak ditemukan");
    error.status = 404;
    throw error;
  }

  const cartItem = await CartItem.findOne({
    where: { id: itemId, cartId: cart.id },
  });

  if (!cartItem) {
    const error = new Error("Item tidak ditemukan di cart");
    error.status = 404;
    throw error;
  }

  await CartItem.update({ quantity }, { where: { id: itemId } });

  res.status(200).json({
    success: true,
    message: "Quantity berhasil diperbarui",
  });
});

// ============================================
// HAPUS ITEM DARI CART
// ============================================
export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await getActiveCart(req.user.userId);

  if (!cart) {
    const error = new Error("Cart tidak ditemukan");
    error.status = 404;
    throw error;
  }

  const cartItem = await CartItem.findOne({
    where: { id: itemId, cartId: cart.id },
  });

  if (!cartItem) {
    const error = new Error("Item tidak ditemukan di cart");
    error.status = 404;
    throw error;
  }

  await CartItem.destroy({ where: { id: itemId } });

  res.status(200).json({
    success: true,
    message: "Item berhasil dihapus dari cart",
  });
});

// ============================================
// KOSONGKAN SEMUA CART
// ============================================
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getActiveCart(req.user.userId);

  if (!cart) {
    const error = new Error("Cart tidak ditemukan");
    error.status = 404;
    throw error;
  }

  await CartItem.destroy({ where: { cartId: cart.id } });

  res.status(200).json({
    success: true,
    message: "Cart berhasil dikosongkan",
  });
});
