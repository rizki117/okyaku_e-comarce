import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // ← ganti useGetMe → useAuth

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;