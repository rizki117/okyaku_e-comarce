import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Panggil fungsi logout pada server jika ada
      await logout();

      // Hapus hanya token dari localStorage, bukan seluruhnya
      localStorage.removeItem("accessToken");

      // Optional: hapus data lain jika diperlukan, misalnya "user"
      localStorage.removeItem("user");

      // Redirect ke halaman login setelah logout berhasil
      navigate("/login");
    } catch (err) {
      setError(err);
      throw err; // Pastikan error ditangani
    } finally {
      setLoading(false);
    }
  };

  return { logout: handleLogout, loading, error };
};

export default useLogout;
