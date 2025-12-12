// src/modules/dashboard/admin/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchMetrics } from "../api/adminApi";
import MetricsCards from "../components/MetricsCards";
import UsersTable from "../components/UsersTable";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchMetrics().then(setMetrics).catch(console.error);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl mb-6 font-bold">Admin Dashboard</h1>

      <MetricsCards metrics={metrics} />

      <h2 className="text-lg mt-8 font-semibold">Users</h2>
      <UsersTable />
    </div>
  );
}
