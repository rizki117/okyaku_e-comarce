// === tokenService.js ===
import axios from "axios";

export const plainAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Refresh token pakai plainAxios, bukan api!
export const refreshToken = async () => {
  try {
    const response = await plainAxios.get("/token");
    // ✅ Return full response.data yang berisi { success, accessToken }
    return response.data;
  } catch (error) {
    // Clear localStorage jika refresh gagal
    localStorage.removeItem("accessToken");
    throw error.response?.data?.msg || error.message;
  }
};