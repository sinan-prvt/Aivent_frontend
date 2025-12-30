import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";

export default function VendorAuthGuard() {
  const { user, initialized } = useAuth();

  if (!initialized) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "vendor") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}