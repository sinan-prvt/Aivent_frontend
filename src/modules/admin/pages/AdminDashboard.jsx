// src/modules/dashboard/admin/pages/AdminDashboard.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DashboardHome from "./DashboardHome";
import UsersManagement from "../components/users/UsersManagement";
import Analytics from "./Analytics";
import Settings from "./Settings";

import AdminProductList from "./AdminProductList";
import AdminProductReview from "./AdminProductReview";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />

        {/* Catalog Management */}
        <Route path="/products" element={<AdminProductList />} />
        <Route path="/products/:id/review" element={<AdminProductReview />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

