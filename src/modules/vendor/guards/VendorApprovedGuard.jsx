import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function VendorApprovedGuard({ children }) {
  const { user, initialized } = useAuth();

  if (!initialized) return null;

  if (user?.role === "vendor" && user.vendor_approved === false) {
    return <Navigate to="/vendor/pending" replace />;
  }

  return children;
}
