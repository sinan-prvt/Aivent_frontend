
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { FiHome, FiBox, FiSettings, FiLogOut, FiMessageSquare, FiList, FiCalendar, FiUser, FiLayers, FiBarChart2 } from "react-icons/fi";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Category mapping for slugs and custom labels
  const categoryConfig = {
    "1": { slug: "catering", label: "Overview", products: "Menus" },
    "2": { slug: "decoration", label: "Overview", products: "Themes" },
    "3": { slug: "lighting", label: "Overview", products: "Equipment" },
    "4": { slug: "photography", label: "Overview", products: "Packages" },
    "5": { slug: "sound", label: "Overview", products: "Equipment" },
    "6": { slug: "venue", label: "Overview", products: "Halls" },
    "7": { slug: "staffing", label: "Overview", products: "Staff" },
    "8": { slug: "ritual", label: "Overview", products: "Services" },
    "9": { slug: "logistics", label: "Overview", products: "Vehicles" },
  };

  const catId = user?.category_id ? String(user.category_id) : "unknown";
  const config = categoryConfig[catId] || { slug: "dashboard", label: "Overview", products: "Products" };
  const basePath = `/vendor/${config.slug}/dashboard`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Aivent" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Aivent</span>
          </Link>
          <div className="mt-2 px-1">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              {config.slug.replace('-', ' ')} Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {catId === "1" ? (
            <>
              {/* CATERING SPECIFIC NAVIGATION */}
              <SidebarItem
                to={basePath}
                icon={FiHome}
                label="Dashboard"
                active={pathname === basePath || pathname === `${basePath}/`}
              />
              <SidebarItem
                to={`${basePath}/menus`}
                icon={FiList}
                label="Menu Builder"
                active={pathname.includes("/menus")}
              />
              <SidebarItem
                to={`${basePath}/packages`}
                icon={FiBox}
                label="Packages"
                active={pathname.includes("/packages")}
              />
              <SidebarItem
                to={`${basePath}/bookings`}
                icon={FiCalendar}
                label="Bookings"
                active={pathname.includes("/bookings")}
              />
            </>
          ) : catId === "2" ? (
            <>
              {/* DECORATION SPECIFIC NAVIGATION */}
              <SidebarItem
                to={basePath}
                icon={FiHome}
                label="Dashboard"
                active={pathname === basePath || pathname === `${basePath}/`}
              />
              <SidebarItem
                to={`${basePath}/inventory`}
                icon={FiBox}
                label="Prop Inventory"
                active={pathname.includes("/inventory")}
              />
              <SidebarItem
                to={`${basePath}/decor-bookings`}
                icon={FiList}
                label="Bookings"
                active={pathname.includes("/decor-bookings")}
              />
              <SidebarItem
                to={`${basePath}/reports`}
                icon={FiBarChart2}
                label="Reports"
                active={pathname.includes("/reports")}
              />
            </>
          ) : catId === "3" ? (
            <>
              {/* LIGHTING & EFFECTS SPECIFIC NAVIGATION */}
              <SidebarItem
                to={basePath}
                icon={FiHome}
                label="Dashboard"
                active={pathname === basePath || pathname === `${basePath}/`}
              />
              <SidebarItem
                to={`${basePath}/equipment`}
                icon={FiBox}
                label="Equipment"
                active={pathname.includes("/equipment")}
              />
              <SidebarItem
                to={`${basePath}/schedule`}
                icon={FiCalendar}
                label="Schedule"
                active={pathname.includes("/schedule")}
              />
              <SidebarItem
                to={`${basePath}/lighting-bookings`}
                icon={FiList}
                label="Bookings"
                active={pathname.includes("/lighting-bookings")}
              />
              <SidebarItem
                to={`${basePath}/staff`}
                icon={FiUser}
                label="Staff"
                active={pathname.includes("/staff")}
              />
            </>
          ) : (
            <>
              {/* STANDARD NAVIGATION FOR OTHER VENDORS */}
              <SidebarItem
                to={basePath}
                icon={FiHome}
                label={config.label}
                active={pathname === basePath || pathname === `${basePath}/`}
              />
              <SidebarItem
                to={`${basePath}/products`}
                icon={FiBox}
                label={config.products}
                active={pathname.includes("/products")}
              />
            </>
          )}

          {/* COMMON NAVIGATION */}
          <SidebarItem
            to={`${basePath}/profile`}
            icon={FiUser}
            label="Profile"
            active={pathname.includes("/profile")}
          />
          <SidebarItem
            to={`${basePath}/inbox`}
            icon={FiMessageSquare}
            label="Messages"
            active={pathname.includes("/inbox")}
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
