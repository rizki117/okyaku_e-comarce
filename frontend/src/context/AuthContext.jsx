import { createContext, useContext } from "react";
import useGetMe from "../hooks/useGetMe";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, setUser, loading, error } = useGetMe();

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);