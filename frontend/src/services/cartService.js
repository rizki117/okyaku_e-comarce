// services/cartService.js
import api from "./api";

// ========================
// GET CART
// ========================
export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// ADD TO CART
// ========================
export const addToCart = async (data) => {
  try {
    const response = await api.post("/cart", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// UPDATE CART ITEM
// ========================
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.patch(`/cart/item/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// REMOVE CART ITEM
// ========================
export const removeCartItem = async (itemId) => {
  try {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// CLEAR CART
// ========================
export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// GENERATE WHATSAPP URL
// ========================
export const generateWhatsAppURL = async () => {
  try {
    const response = await api.get("/cart/whatsapp");
    return response.data;
  } catch (error) {
    throw error;
  }
};



// ========================
// GENERATE WHATSAPP URL - ITEM TUNGGAL ← TAMBAH INI
// ========================
export const generateWhatsAppURLSingleItem = async (itemId) => {
  try {
    const response = await api.get(`/cart/whatsapp/item?itemId=${itemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};




// ========================
// GENERATE WHATSAPP URL - MULTI ITEM
// ========================
export const generateWhatsAppURLMultiItems = async (itemIds) => {
  try {
    const response = await api.post("/cart/whatsapp/items", { itemIds });
    return response.data;
  } catch (error) {
    throw error;
  }
};
