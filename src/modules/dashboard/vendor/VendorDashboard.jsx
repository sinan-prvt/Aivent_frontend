import React from "react";
import Navbar from "../../../components/layout/Navbar";
import Card from "../../../components/ui/Card";
import useFetch from "../../../hooks/useFetch";

export default function VendorDashboard() {
  const { data: metrics, loading } = useFetch("/vendor/metrics/", [], {
    mock: {
      products_count: 24,
      orders_today: 4,
      pending_orders: 2,
      revenue_today: 3499.5,
      recent_orders: [
        { id: "V-2001", total: 599, status: "pending", customer: "x@y.com" },
        { id: "V-2000", total: 1299, status: "shipped", customer: "a@b.com" },
      ],
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Vendor Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card title="My Products">
            <div className="text-xl font-bold">{metrics?.products_count ?? "—"}</div>
          </Card>
          <Card title="Orders Today">
            <div className="text-xl font-bold">{metrics?.orders_today ?? "—"}</div>
          </Card>
          <Card title="Pending Orders">
            <div className="text-xl font-bold">{metrics?.pending_orders ?? "—"}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Recent Orders" className="lg:col-span-2">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-gray-600">
                  <tr>
                    <th className="pb-2">Order</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(metrics?.recent_orders || []).map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="py-2">{o.id}</td>
                      <td className="py-2">{o.customer}</td>
                      <td className="py-2">₹ {o.total}</td>
                      <td className="py-2 capitalize">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          <Card title="Quick Actions">
            <div className="flex flex-col gap-2">
              <a href="/vendor/products/new" className="text-indigo-600 hover:underline">Add product</a>
              <a href="/vendor/orders" className="text-indigo-600 hover:underline">Manage orders</a>
              <a href="/vendor/mfa" className="text-indigo-600 hover:underline">MFA settings</a>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
