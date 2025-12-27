import React from "react";
import { Navigate } from "react-router-dom";

function decodeJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }) {
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("token");

  // If no token → not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeJwt(token);

  // If token invalid or role not admin
  if (!decoded || decoded.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // If valid admin
  return children;
}
