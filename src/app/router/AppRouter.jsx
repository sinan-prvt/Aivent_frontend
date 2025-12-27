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
import AdminDashboard from "../../modules/admin/pages/AdminDashboard";
import VendorApply from "../../modules/vendor/pages/VendorApply";
import VendorMFASetup from "../../modules/vendor/pages/VendorMFASetup.jsx";
import VendorVerifyOTP from "../../modules/vendor/pages/VendorVerifyOTP";
import VendorPending from "../../modules/vendor/pages/VendorPending.jsx";
import VendorVerifyMFA from "../../modules/vendor/pages/VendorVerifyMFA.jsx";
import VendorLayout from "../../modules/vendor/layout/VendorLayout.jsx";
import VendorDashboardHome from "../../modules/vendor/dashboard/VendorDashboardHome.jsx";
import VendorAuthGuard from "../../modules/vendor/guards/VendorAuthGuard.jsx";
import VendorMFAGuard from "../../modules/vendor/guards/VendorMFAGuard.jsx";
import VendorApprovedGuard from "../../modules/vendor/guards/VendorApprovedGuard.jsx";

/* Vendor */

// ------------------------------------------------------
// Block login/register ONLY if logged in (user/admin)
// ------------------------------------------------------
function BlockWhenLoggedIn({ children }) {
  const { user, initialized } = useAuth();
  if (!initialized) return null;

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "customer") {
    return <Navigate to="/" replace />;
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



      <Route path="/vendor/apply" element={<VendorApply />} />
<Route path="/vendor/verify-otp" element={<VendorVerifyOTP />} />
<Route path="/vendor/pending" element={<VendorPending />} />
<Route path="/vendor/mfa-setup" element={<VendorMFASetup />} />
<Route path="/vendor/mfa" element={<VendorVerifyMFA />} />

<Route
  path="/vendor/dashboard"
  element={
    <VendorAuthGuard>
      <VendorMFAGuard>
        <VendorApprovedGuard>
          <VendorLayout />
        </VendorApprovedGuard>
      </VendorMFAGuard>
    </VendorAuthGuard>
  }
>
  <Route index element={<VendorDashboardHome />} />
</Route>
      
      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}
