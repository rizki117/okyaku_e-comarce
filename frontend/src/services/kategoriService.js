// services/kategoriService.js
import api from "./api";

// ========================
// GET SEMUA KATEGORI AKTIF (PUBLIC)
// ========================
export const getActiveKategori = async () => {
  try {
    const response = await api.get("/kategori/active");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// GET SEMUA KATEGORI (ADMIN)
// ========================
export const getAllKategori = async () => {
  try {
    const response = await api.get("/kategori");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// GET KATEGORI BY ID
// ========================
export const getKategoriById = async (id) => {
  try {
    const response = await api.get(`/kategori/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// CREATE KATEGORI
// ========================
export const createKategori = async (data) => {
  try {
    const response = await api.post("/kategori", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// UPDATE KATEGORI
// ========================
export const updateKategori = async (id, data) => {
  try {
    const response = await api.patch(`/kategori/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// DELETE KATEGORI
// ========================
export const deleteKategori = async (id) => {
  try {
    const response = await api.delete(`/kategori/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// TOGGLE STATUS KATEGORI
// ========================
export const toggleKategori = async (id) => {
  try {
    const response = await api.patch(`/kategori/${id}/toggle`);
    return response.data;
  } catch (error) {
    throw error;
  }
};