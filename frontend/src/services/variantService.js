// services/variantService.js
import api from "./api";

// ========================
// GET VARIANT BY PRODUK (PUBLIC)
// ========================
export const getVariantPublic = async (productId) => {
  try {
    const response = await api.get(`/produk/${productId}/variant/public`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// GET VARIANT BY PRODUK (LOGIN)
// ========================
export const getVariant = async (productId) => {
  try {
    const response = await api.get(`/produk/${productId}/variant`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// CREATE VARIANT (SINGLE)
// ========================
export const createVariant = async (productId, data) => {
  try {
    const response = await api.post(`/produk/${productId}/variant`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// CREATE VARIANT (BULK)
// ========================
export const bulkCreateVariant = async (productId, variants) => {
  try {
    const response = await api.post(`/produk/${productId}/variant/bulk`, { variants });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// UPDATE VARIANT
// ========================
export const updateVariant = async (productId, variantId, data) => {
  try {
    const response = await api.patch(`/produk/${productId}/variant/${variantId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// DELETE VARIANT
// ========================
export const deleteVariant = async (productId, variantId) => {
  try {
    const response = await api.delete(`/produk/${productId}/variant/${variantId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};