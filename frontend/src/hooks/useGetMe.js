import { useState, useEffect } from "react";
import { getMe } from "../services/authService";
import { connectSocket } from "../socket"; // ← tambah

const useGetMe = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getMe(token);
        setUser(data);
        setError(null);
        connectSocket(); // ← tambah ini, socket auto kirim auth token
      } catch (err) {
        setUser(null);
        setError(err);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, setUser, loading, error };
};

export default useGetMe;