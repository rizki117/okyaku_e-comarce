// hooks/useGoogleLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../services/authService";

const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async (tokenId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await googleLogin(tokenId);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/"); // ← redirect ke home setelah login
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Login Google gagal");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { googleLogin: handleGoogleLogin, loading, error };
};

export default useGoogleLogin;