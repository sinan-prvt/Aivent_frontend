// src/admin/components/MetricsCards.jsx
import React from "react";

export function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  );
}

export default function MetricsCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="Total users" value={metrics?.total_users ?? "—"} />
      <MetricCard title="Total vendors" value={metrics?.total_vendors ?? "—"} />
      <MetricCard title="Pending vendors" value={metrics?.awaiting_vendor_approval ?? "—"} />
      <MetricCard title="Active users" value={metrics?.active_users ?? "—"} />
    </div>
  );
}
