//routes/PublicRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useGetMe from "../hooks/useGetMe";
import Loader from "./Loader";

const PublicRoute = () => {
  const { user, loading } = useGetMe();

  if (loading) return <Loader />;

  if (user) {
    // admin/seller → dashboard, user biasa → home
    if (user.role === "admin" || user.role === "seller") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;