import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

import Home from "../../modules/auth/pages/Home";
import Login from "../../modules/auth/pages/Login";
import Register from "../../modules/auth/pages/Register";
import Profile from "@/modules/user/pages/Profile";

import ForgotPassword from "../../modules/auth/pages/ForgotPassword";
import ResetPassword from "../../modules/auth/pages/ResetPassword";
import OTPVerify from "../../modules/auth/pages/OTPVerify";

import VerifyMFA from "../../modules/mfa/pages/VerifyMFA";
import EnableMFA from "../../modules/mfa/pages/EnableMFA";
import ConfirmMFA from "../../modules/mfa/pages/ConfirmMFA";

import VendorDashboard from "../../modules/dashboard/vendor/VendorDashboard";

import GoogleCallback from "../../modules/auth/pages/GoogleCallback";
import MicrosoftCallback from "../../modules/auth/pages/MicrosoftCallback";

import AdminDashboard from "../../modules/dashboard/admin/pages/AdminDashboard";


// ------------------------------------------------------
// 1. BLOCK login/register ONLY if logged in
// ------------------------------------------------------
function BlockWhenLoggedIn({ children }) {
  const { user, initialized } = useAuth();

  if (!initialized) return null;

  if (user && user.role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}


// ------------------------------------------------------
// 2. PRIVATE ROUTE — protects admin/vendor/customers
// ------------------------------------------------------
function PrivateRoute({ children, role }) {
  const { user, initialized } = useAuth();

  if (!initialized) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// ------------------------------------------------------
// 3. FINAL ROUTE TREE (cleaned & safe)
// ------------------------------------------------------
export default function AppRouter() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Login + Register (blocked when logged in) */}
      <Route
        path="/login"
        element={
          <BlockWhenLoggedIn>
            <Login />
          </BlockWhenLoggedIn>
        }
      />
      <Route
        path="/register"
        element={
          <BlockWhenLoggedIn>
            <Register />
          </BlockWhenLoggedIn>
        }
      />

      {/* Profile (user must be logged in, but any role allowed) */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Auth flows */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/otp-verify" element={<OTPVerify />} />

      {/* MFA */}
      <Route path="/mfa/verify" element={<VerifyMFA />} />
      <Route path="/mfa/enable" element={<EnableMFA />} />
      <Route path="/mfa/confirm" element={<ConfirmMFA />} />

      {/* Admin (FULL admin area inside /admin/* ) */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Vendor */}
      <Route
        path="/vendor/*"
        element={
          <PrivateRoute role="vendor">
            <VendorDashboard />
          </PrivateRoute>
        }
      />

      {/* Customer placeholder */}
      <Route path="/customer" element={<Navigate to="/" replace />} />

      {/* OAuth */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />

      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
