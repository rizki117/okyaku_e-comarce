import { useState } from "react";
import { login } from "../services/authService";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials);
      localStorage.setItem("accessToken", data.accessToken);
      return data;
    } catch (err) {
      // Pastikan error yang disimpan berupa string
      setError(typeof err === "string" ? err : "Login gagal");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error };
};

export default useLogin;
