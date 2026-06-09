// services/addressService.js
import api from "./api";

// ========================
// GET SEMUA ALAMAT
// ========================
export const getAddresses = async () => {
  try {
    const response = await api.get("/address");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// GET ALAMAT BY ID
// ========================
export const getAddressById = async (id) => {
  try {
    const response = await api.get(`/address/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// CREATE ALAMAT
// ========================
export const createAddress = async (data) => {
  try {
    const response = await api.post("/address", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// UPDATE ALAMAT
// ========================
export const updateAddress = async (id, data) => {
  try {
    const response = await api.patch(`/address/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// DELETE ALAMAT
// ========================
export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(`/address/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========================
// SET DEFAULT ALAMAT
// ========================
export const setDefaultAddress = async (id) => {
  try {
    const response = await api.patch(`/address/${id}/default`);
    return response.data;
  } catch (error) {
    throw error;
  }
};