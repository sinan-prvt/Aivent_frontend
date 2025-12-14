import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

/* Public */
import Home from "../../modules/auth/pages/Home";

/* User auth */
import Login from "../../modules/auth/pages/Login";
import Register from "../../modules/auth/pages/Register";
import Profile from "@/modules/user/pages/Profile";

/* Auth utilities */
import ForgotPassword from "../../modules/auth/pages/ForgotPassword";
import ResetPassword from "../../modules/auth/pages/ResetPassword";
import OTPVerify from "../../modules/auth/pages/OTPVerify";

/* OAuth */
import GoogleCallback from "../../modules/auth/pages/GoogleCallback";
import MicrosoftCallback from "../../modules/auth/pages/MicrosoftCallback";

/* Admin */
import AdminDashboard from "../../modules/dashboard/admin/pages/AdminDashboard";

/* Vendor */
import VendorRegister from "../../modules/dashboard/vendor/pages/auth/VendorRegister";
import VendorVerifyOTP from "../../modules/dashboard/vendor/pages/auth/VendorVerifyOTP";
import VendorLogin from "../../modules/dashboard/vendor/pages/auth/VendorLogin";
import VendorMFAVerify from "../../modules/dashboard/vendor/pages/auth/VendorMFAVerify";
import VendorPendingApproval from "../../modules/dashboard/vendor/pages/status/VendorPendingApproval";

import VendorDashboardLayout from "../../modules/dashboard/vendor/layouts/VendorDashboardLayout";
import VendorDashboardHome from "../../modules/dashboard/vendor/pages/dashboard/VendorDashboardHome";
import VendorProfile from "../../modules/dashboard/vendor/pages/dashboard/VendorProfile";
import VendorSettings from "../../modules/dashboard/vendor/pages/dashboard/VendorSettings";

/* Vendor Guards */
import VendorAuthGuard from "../../modules/dashboard/vendor/guards/VendorAuthGuard";
import VendorMFAGuard from "../../modules/dashboard/vendor/guards/VendorMFAGuard";
import VendorApprovedGuard from "../../modules/dashboard/vendor/guards/VendorApprovedGuard";


// ------------------------------------------------------
// Block login/register ONLY if logged in (user/admin)
// ------------------------------------------------------
function BlockWhenLoggedIn({ children }) {
  const { user, initialized } = useAuth();
  if (!initialized) return null;

  if (user?.role && user.role !== "vendor") {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}


// ------------------------------------------------------
// PrivateRoute for USER + ADMIN only
// ------------------------------------------------------
function PrivateRoute({ children, role }) {
  const { user, initialized } = useAuth();
  if (!initialized) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}


// ------------------------------------------------------
// FINAL ROUTES
// ------------------------------------------------------
export default function AppRouter() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* User login/register */}
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

      {/* User profile */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Auth helpers */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/otp-verify" element={<OTPVerify />} />

      {/* OAuth */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* ---------------- VENDOR PUBLIC ---------------- */}
      <Route path="/vendor/register" element={<VendorRegister />} />
      <Route path="/vendor/verify-otp" element={<VendorVerifyOTP />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/mfa" element={<VendorMFAVerify />} />
      <Route path="/vendor/pending" element={<VendorPendingApproval />} />

      {/* ---------------- VENDOR DASHBOARD ---------------- */}
      <Route
        path="/vendor/dashboard"
        element={
          <VendorAuthGuard>
            <VendorMFAGuard>
              <VendorApprovedGuard>
                <VendorDashboardLayout />
              </VendorApprovedGuard>
            </VendorMFAGuard>
          </VendorAuthGuard>
        }
      >
        <Route index element={<VendorDashboardHome />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}
