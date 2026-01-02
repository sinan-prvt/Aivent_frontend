
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { FiHome, FiBox, FiSettings, FiLogOut, FiMessageSquare } from "react-icons/fi";

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${active
      ? "bg-indigo-50 text-indigo-600"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);

export default function VendorLayout() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Aivent</span>
          </Link>
          <div className="mt-2 px-1">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Vendor Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem
            to="/vendor/dashboard"
            icon={FiHome}
            label="Overview"
            active={pathname === "/vendor/dashboard" || pathname === "/vendor/dashboard/"}
          />
          <SidebarItem
            to="/vendor/dashboard/products"
            icon={FiBox}
            label="Products"
            active={pathname.includes("/products")}
          />
          <SidebarItem
            to="/vendor/dashboard/inbox"
            icon={FiMessageSquare}
            label="Messages"
            active={pathname.includes("/inbox")}
          />
          <SidebarItem
            to="/vendor/dashboard/settings"
            icon={FiSettings}
            label="Settings"
            active={pathname.includes("/settings")}
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <FiLogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
