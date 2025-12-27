// src/modules/dashboard/admin/layouts/AdminLayout.jsx
import React from "react";
import AdminNavbar from "../components/navbar/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
