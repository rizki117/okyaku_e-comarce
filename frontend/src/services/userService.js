// services/userService.js
// services/userService.js
import api from "./api";

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await api.post("/user", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user by ID
export const updateUser = async (id, userData) => {
  try {
    const isFormData = userData instanceof FormData;
    const response = await api.patch(`/user/${id}`, userData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle aktif / nonaktif user
export const toggleUser = async (id, is_active) => {
  try {
    const response = await api.patch(`/user/${id}`, { is_active });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user by ID
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getUserStats = async () => {
  const response = await api.get("/user/stats");
  return response.data;
};