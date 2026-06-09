// hooks/useCart.js
import { useState } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  generateWhatsAppURL,
} from "../services/cartService";

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========================
  // GET CART
  // ========================
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data.data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal mengambil cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // ADD TO CART
  // ========================
  const handleAddToCart = async (productId, quantity = 1, variantId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await addToCart({ productId, quantity, variantId });
      await fetchCart(); // refresh cart
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menambah ke cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // UPDATE CART ITEM
  // ========================
  const handleUpdateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateCartItem(itemId, quantity);
      await fetchCart(); // refresh cart
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal update cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // REMOVE CART ITEM
  // ========================
  const handleRemoveCartItem = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await removeCartItem(itemId);
      await fetchCart(); // refresh cart
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal hapus item cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // CLEAR CART
  // ========================
  const handleClearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clearCart();
      setCart(null);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal kosongkan cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // GENERATE WHATSAPP URL
  // ========================
  const handleGenerateWhatsApp = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateWhatsAppURL();
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal generate link WA");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeCartItem: handleRemoveCartItem,
    clearCart: handleClearCart,
    generateWhatsApp: handleGenerateWhatsApp,
  };
};

export default useCart;
