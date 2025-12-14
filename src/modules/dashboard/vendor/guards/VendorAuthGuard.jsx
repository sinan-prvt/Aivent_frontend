import { Navigate } from "react-router-dom";
import { getVendorAccessToken } from "../utils/vendorAuthHelpers";

export default function VendorAuthGuard({ children }) {
  if (!getVendorAccessToken()) {
    return <Navigate to="/vendor/login" replace />;
  }
  return children;
}
