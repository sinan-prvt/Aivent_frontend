import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

/* Public */
import Home from "../../modules/user/pages/Home";
import CategoryProducts from "../../modules/user/pages/CategoryProducts";
import ProductDetail from "../../modules/user/pages/ProductDetail";

/* User auth */
import Login from "../../modules/auth/pages/Login";
import Register from "../../modules/auth/pages/Register";
import Profile from "@/modules/user/pages/Profile";
import MyOrdersPage from "../../modules/user/pages/MyOrdersPage";
import PlanEvent from "../../modules/user/pages/PlanEvent";
import MagicPlanner from "../../modules/user/pages/MagicPlanner";
import About from "../../modules/user/pages/About";
import Offers from "../../modules/user/pages/Offers";
import Inspiration from "../../modules/user/pages/Inspiration";
import EventsBrowse from "../../modules/user/pages/EventsBrowse";
import CheckoutPage from "../../modules/user/pages/CheckoutPage";

/* Auth utilities */
import ForgotPassword from "../../modules/auth/pages/ForgotPassword";
import ResetPassword from "../../modules/auth/pages/ResetPassword";
import OTPVerify from "../../modules/auth/pages/OTPVerify";

/* OAuth */
import GoogleCallback from "../../modules/auth/pages/GoogleCallback";
import MicrosoftCallback from "../../modules/auth/pages/MicrosoftCallback";

/* Admin */
import AdminDashboard from "../../modules/admin/pages/AdminDashboard";
import AdminPaymentsPage from "../../modules/admin/pages/AdminPaymentsPage";
import VendorApply from "../../modules/vendor/pages/VendorApply";
import VendorMFASetup from "../../modules/vendor/pages/VendorMFASetup.jsx";
import VendorVerifyOTP from "../../modules/vendor/pages/VendorVerifyOTP";
import VendorPending from "../../modules/vendor/pages/VendorPending.jsx";
import VendorVerifyMFA from "../../modules/vendor/pages/VendorVerifyMFA.jsx";
import VendorProducts from "../../modules/vendor/pages/VendorProducts";
import VendorCreateProduct from "../../modules/vendor/pages/VendorCreateProduct";
import VendorEditProduct from "../../modules/vendor/pages/VendorEditProduct";
import VendorInbox from "../../modules/vendor/pages/VendorInbox";
import VendorLayout from "../../modules/vendor/layout/VendorLayout.jsx";
import VendorDashboardHome from "../../modules/vendor/dashboard/VendorDashboardHome.jsx";
import VendorAuthGuard from "../../modules/vendor/guards/VendorAuthGuard.jsx";
import VendorApprovedGuard from "../../modules/vendor/guards/VendorApprovedGuard.jsx";
import VendorProfile from "../../modules/vendor/pages/VendorProfile";
import PublicLayout from "../../components/layout/PublicLayout.jsx";

/* Vendor */

import { getVendorPath } from "../../modules/vendor/utils/vendorNavigation";

// ------------------------------------------------------
// Block login/register ONLY if logged in (user/admin)
// ------------------------------------------------------
function BlockWhenLoggedIn({ children }) {
  const { user, initialized } = useAuth();
  if (!initialized) return null;

  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "vendor" && user?.mfa_verified !== false) {
    return <Navigate to={getVendorPath(user)} replace />;
  }
  if (user?.role === "customer") return <Navigate to="/" replace />;

  return children;
}

// ------------------------------------------------------
// PrivateRoute for USER + ADMIN only
// ------------------------------------------------------
function PrivateRoute({ children, role }) {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return null;

  // ✅ ALLOW MFA ROUTES WITHOUT USER
  if (
    location.pathname === "/vendor/mfa" ||
    location.pathname === "/vendor/mfa-setup"
  ) {
    return children;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}

function MFARoute({ children }) {
  const payload = sessionStorage.getItem("mfa_payload");
  if (!payload) return <Navigate to="/login" replace />;
  return children;
}


// ------------------------------------------------------
// FINAL ROUTES
// ------------------------------------------------------
import MenuBuilder from "../../modules/vendor/pages/catering/MenuBuilder.jsx";
import CateringPackages from "../../modules/vendor/pages/catering/CateringPackages.jsx";
import CateringBookings from "../../modules/vendor/pages/catering/CateringBookings.jsx";
import DecorInventory from "../../modules/vendor/pages/decoration/DecorInventory.jsx";
import DecorEvents from "../../modules/vendor/pages/decoration/DecorEvents.jsx";
import DecorReports from "../../modules/vendor/pages/decoration/DecorReports.jsx";
import DecorBookings from "../../modules/vendor/pages/decoration/DecorBookings.jsx";
import ThemeManager from "../../modules/vendor/pages/decoration/ThemeManager.jsx";

// Lighting & Effects Pages
import LightingInventory from "../../modules/vendor/pages/lighting/LightingInventory.jsx";
import LightingScheduleManager from "../../modules/vendor/pages/lighting/LightingScheduleManager.jsx";
import LightingBookings from "../../modules/vendor/pages/lighting/LightingBookings.jsx";
import LightingReports from "../../modules/vendor/pages/lighting/LightingReports.jsx";
import LightingStaff from "../../modules/vendor/pages/lighting/LightingStaff.jsx";

// Sound & Music Pages
import SoundServices from "../../modules/vendor/pages/sound/SoundServices.jsx";
import SoundSchedule from "../../modules/vendor/pages/sound/SoundSchedule.jsx";

// Photography Pages
import PhotographyPackages from "../../modules/vendor/pages/photography/PhotographyPackages.jsx";
import PhotographyDeliveryCenter from "../../modules/vendor/pages/photography/PhotographyDeliveryCenter.jsx";
import PhotographySchedule from "../../modules/vendor/pages/photography/PhotographySchedule.jsx";
import VendorPackagesDispatcher from "../../modules/vendor/pages/VendorPackagesDispatcher.jsx";
import VendorBookingsDispatcher from "../../modules/vendor/pages/VendorBookingsDispatcher.jsx";
import NotificationsPage from "../../modules/vendor/pages/NotificationsPage";
import { VendorScheduleDispatcher, VendorEquipmentDispatcher } from "../../modules/vendor/pages/VendorDispatchers.jsx";


// ------------------------------------------------------
// FINAL ROUTES
// ------------------------------------------------------
export default function AppRouter() {

  const { user, initialized } = useAuth();
  if (!initialized) return null;

  return (
    <Routes>

      <Route element={<PublicLayout />}>
        <Route path="/" element={user?.role === "vendor"
          ? <Navigate to={getVendorPath(user)} replace />
          : <Home />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<EventsBrowse />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/categories/:slug" element={<CategoryProducts />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/login"
          element={
            <BlockWhenLoggedIn>
              <Login />
            </BlockWhenLoggedIn>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/magic-planner" element={<MagicPlanner />} />

        {/* User profile */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <MyOrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/plan"
          element={
            <PrivateRoute>
              <PlanEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
      </Route>

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
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </PrivateRoute>
        }
      />



      <Route path="/vendor/apply" element={<VendorApply />} />
      <Route path="/vendor/verify-otp" element={<VendorVerifyOTP />} />


      {/* ✅ MFA ROUTES — NO GUARDS */}
      <Route
        path="/vendor/mfa-setup"
        element={
          <MFARoute>
            <VendorMFASetup />
          </MFARoute>
        }
      />

      <Route
        path="/vendor/mfa"
        element={
          <MFARoute>
            <VendorVerifyMFA />
          </MFARoute>
        }
      />

      <Route path="/vendor" element={<VendorAuthGuard />}>
        <Route path="pending" element={<VendorPending />} />

        {/* Redirect generic /vendor/dashboard to specific one */}
        <Route path="dashboard" element={<Navigate to={getVendorPath(user)} replace />} />

        <Route
          path=":category/dashboard"
          element={
            <VendorApprovedGuard>
              <VendorLayout />
            </VendorApprovedGuard>
          }
        >
          <Route index element={<VendorDashboardHome />} />

          {/* Packages Dispatcher (Handles all categories) */}
          <Route path="packages" element={<VendorPackagesDispatcher />} />

          {/* Unified Route Dispatchers */}
          <Route path="equipment" element={<VendorEquipmentDispatcher />} />
          <Route path="schedule" element={<VendorScheduleDispatcher />} />

          {/* Sound Only */}
          <Route path="services" element={<SoundServices />} />

          {/* Catering Specific Routes */}
          <Route path="menus" element={<MenuBuilder />} />
          <Route path="bookings" element={<VendorBookingsDispatcher />} />

          {/* Decoration Specific Routes */}
          <Route path="inventory" element={<DecorInventory />} />
          <Route path="events" element={<DecorEvents />} />
          <Route path="reports" element={<DecorReports />} />
          <Route path="decor-bookings" element={<DecorBookings />} />
          <Route path="themes" element={<ThemeManager />} />

          {/* Lighting & Effects - Specifics */}
          <Route path="lighting-bookings" element={<LightingBookings />} />
          <Route path="staff" element={<LightingStaff />} />
          <Route path="lighting-reports" element={<LightingReports />} />

          {/* Photography Specific Routes */}
          <Route path="delivery" element={<PhotographyDeliveryCenter />} />

          {/* Product Management */}
          <Route path="products" element={<VendorProducts />} />
          <Route path="products/create" element={<VendorCreateProduct />} />
          <Route path="products/:id/edit" element={<VendorEditProduct />} />

          {/* Chat/Inbox */}
          <Route path="inbox" element={<VendorInbox />} />

          {/* Notifications */}
          <Route path="notifications" element={<NotificationsPage />} />

          {/* Profile */}
          <Route path="profile" element={<VendorProfile />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}
