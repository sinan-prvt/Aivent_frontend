import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { logoutEverywhere } from "@/core/auth/logoutEverywhere";


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    logoutEverywhere(navigate);
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-1 text-sm font-medium transition 
     ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`;

  return (
    <div className="w-full bg-linear-to-b from-blue-50 to-transparent py-4">
      <nav
        className="
          max-w-6xl mx-auto bg-white shadow-lg rounded-full
          px-6 py-3 flex items-center justify-between
        "
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110">
            <img src='/logo.png' className='size-7 filter brightness-0 invert' />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Aivent</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>


          <NavLink to="/vendor/apply" className={linkClass}>
            Business
          </NavLink>
        </div>

        {!user ? (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {user.role === "vendor" && (
              <button
                onClick={() => navigate("/vendor/create-event")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm"
              >
                Create Event
              </button>
            )}

            <div
              className="
                w-10 h-10 rounded-full bg-amber-200 
                flex items-center justify-center cursor-pointer
                border border-amber-300
              "
              onClick={() => navigate("/profile")}
            >
              <span className="font-semibold text-gray-700">
                {user?.displayName?.[0]?.toUpperCase() ??
                  user?.email?.[0]?.toUpperCase()}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
