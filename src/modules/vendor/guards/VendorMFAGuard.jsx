import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function VendorMFAGuard({ children }) {
  const { user } = useAuth();
  const mfaToken = sessionStorage.getItem("mfa_token");

  // ❌ MFA required but not completed
  if (!user && mfaToken) {
    return <Navigate to="/vendor/mfa" replace />;
  }

  // ❌ Not logged in at all
  if (!user && !mfaToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Fully authenticated
  return children;
}

