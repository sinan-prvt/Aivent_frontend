import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function VendorAuthGuard({ children }) {
  const { user, initialized } = useAuth();

  if (!initialized) return null;

  if (!user && !sessionStorage.getItem("mfa_payload")) {
  return <Navigate to="/login" replace />;
}
  if (user.role !== "vendor") return <Navigate to="/" replace />;

  return children;
}
