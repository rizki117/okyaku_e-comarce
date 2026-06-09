// services/authService.js

import api from "./api";
import { connectSocket, disconnectSocket } from "../socket";

// ========================
// REGISTER
// ========================
export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// ========================
// LOGIN
// ========================
export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  connectSocket();

  return response.data;
};

// ========================
// LOGIN GOOGLE
// ========================
export const googleLogin = async (accessToken) => {
  const response = await api.post("/auth/google", {
    tokenId: accessToken,
  });


  connectSocket();

  return response.data;
};

// ========================
// GET ME
// ========================
export const getMe = async (token) => {
  const response = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ========================
// LOGOUT
// ========================
export const logout = async () => {
  try {
    await api.delete("/logout");
  } catch (error) {
    console.error("Logout API gagal:", error);
  } finally {
    localStorage.removeItem("accessToken");
    disconnectSocket();
  }
};
