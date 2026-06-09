//models/index.js
import bcrypt from "bcryptjs";
import User from "./userModel.js";
import RefreshToken from "./userSession.js";
import Product from "./produkModel.js";
import ProductVariant from "./productVariants.js";
import Category from "./kategoriModel.js";
import Cart from "./cartModel.js";
import CartItem from "./cartItem.js";
import Address from "./addressModel.js";
import Notification from "./notification.js";

import Order from "./orderModel.js";
import OrderItem from "./orderItem.js";

import db from "../config/Database.js";

// =====================
// USER AUTH
// =====================
User.hasMany(RefreshToken, { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Address, { foreignKey: "userId", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "userId" });

// USER <-> NOTIFICATION
User.hasMany(Notification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
});


// =====================
// PRODUCT
// =====================
User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Product, { foreignKey: "categoryId", onDelete: "RESTRICT" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

Product.hasMany(ProductVariant, { foreignKey: "productId", onDelete: "CASCADE" });
ProductVariant.belongsTo(Product, { foreignKey: "productId" });

// =====================
// CART
// =====================
User.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

ProductVariant.hasMany(CartItem, { foreignKey: "variantId", onDelete: "SET NULL" });
CartItem.belongsTo(ProductVariant, { foreignKey: "variantId" });

// =====================
// ORDER
// =====================
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

/**
 * 🔥 FIX UTAMA:
 * Address dihapus → order tetap aman
 */
Address.hasMany(Order, {
  foreignKey: "addressId",
  onDelete: "SET NULL",
});
Order.belongsTo(Address, {
  foreignKey: "addressId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});






/**
 * 🔥 FIX UTAMA:
 * Product tidak boleh hilang kalau sudah ada order
 */
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  onDelete: "RESTRICT",
});
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

ProductVariant.hasMany(OrderItem, {
  foreignKey: "variantId",
  onDelete: "SET NULL",
});
OrderItem.belongsTo(ProductVariant, {
  foreignKey: "variantId",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

// =====================
// SYNC DATABASE
// =====================
const syncDatabase = async () => {
  try {
    await db.sync({ force: false });
    console.log("✅ Semua tabel berhasil disinkronkan");

    // AUTO ADMIN
    if (process.env.SEED_ADMIN === "true") {
      const adminEmail = "admin@gmail.com";

      const adminExists = await User.findOne({
        where: { email: adminEmail },
      });

      if (!adminExists) {
        const hashedPassword = await bcrypt.hash("123456", 10);

        await User.create({
          name: "admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          is_active: true,
        });

        console.log("🟢 Admin berhasil dibuat");
      }
    }
  } catch (error) {
    console.error("❌ Gagal sinkronisasi tabel:", error);
  }
};

syncDatabase();

export {
  User,
  RefreshToken,
  Product,
  ProductVariant,
  Category,
  Cart,
  CartItem,
  Address,
  Notification,
  Order,
  OrderItem,
};