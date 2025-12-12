import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

import Home from "../../modules/auth/pages/home";

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


function BlockWhenLoggedIn({ children }) {
  const { user, initialized } = useAuth();

  if (!initialized) return null;
  if (user) return <Navigate to={`/${user.role}`} replace />;

  return children;
}


function PrivateRoute({ children, role }) {
  const { user, initialized } = useAuth();

  if (!initialized) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />


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

      <Route path="/profile" element={<Profile />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/otp-verify" element={<OTPVerify />} />

      <Route path="/mfa/verify" element={<VerifyMFA />} />
      <Route path="/mfa/enable" element={<EnableMFA />} />
      <Route path="/mfa/confirm" element={<ConfirmMFA />} />


      <Route
        path="/admin/*"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/vendor"
        element={
          <PrivateRoute role="vendor">
            <VendorDashboard />
          </PrivateRoute>
        }
      />


      <Route path="/customer" element={<Navigate to="/" replace />} />


      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
