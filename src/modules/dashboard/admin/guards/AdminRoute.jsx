// src/modules/dashboard/admin/guards/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../../../../core/utils/token";

function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

export default function AdminRoute({ children }) {
  const token = getAccessToken();
  if (!token) return <Navigate to="/admin/login" replace />;

  const payload = decodeJwt(token);
  if (!payload || payload.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
