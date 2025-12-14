import { Navigate } from "react-router-dom";
import { hasVendorMFACompleted } from "../utils/vendorAuthHelpers";

export default function VendorMFAGuard({ children }) {
  if (!hasVendorMFACompleted()) {
    return <Navigate to="/vendor/login" replace />;
  }
  return children;
}
