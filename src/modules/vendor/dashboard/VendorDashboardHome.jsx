
import React from "react";
import { Link } from "react-router-dom";
import { useVendorProducts } from "../hooks/useVendorProducts";
import { useAuth } from "../../../app/providers/AuthProvider";
import { FiBox, FiDollarSign, FiActivity, FiPlus } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import VenueDashboard from "./VenueDashboard";
import CateringDashboard from "./CateringDashboard";
import PhotographyDashboard from "./PhotographyDashboard";
import DecorDashboard from "./DecorDashboard";
import SoundDashboard from "./SoundDashboard";
import LightingDashboard from "./LightingDashboard";
import StaffingDashboard from "./StaffingDashboard";
import RitualDashboard from "./RitualDashboard";
import LogisticsDashboard from "./LogisticsDashboard";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function VendorDashboardHome() {
  const { user } = useAuth();
  const { data: products, isLoading } = useVendorProducts();

  // Category mapping:
  // 1: Venue & Infrastructure (venue)
  // 2: Catering & Food (catering)
  // 3: Photography & Video (photography)
  // 4: Sound & Music (sound)
  // 5: Decoration & Styling (decoration)
  // 6: Lighting & Effects (lighting)
  // 7: Staffing & Management (staffing)
  // 8: Ritual & Ceremony Services (ritual)
  // 9: Logistics & Utilities (logistics)

  const categoryMap = {
    "1": "catering",
    "2": "decoration",
    "3": "lighting",
    "4": "photography",
    "5": "sound",
    "6": "venue",
    "7": "staffing",
    "8": "ritual",
    "9": "logistics",
  };

  const catId = user?.category_id ? String(user.category_id) : "";

  if (catId === "1") return <CateringDashboard />;
  if (catId === "2") return <DecorDashboard />;
  if (catId === "3") return <LightingDashboard />;
  if (catId === "4") return <PhotographyDashboard />;
  if (catId === "5") return <SoundDashboard />;
  if (catId === "6") return <VenueDashboard />;
  if (catId === "7") return <StaffingDashboard />;
  if (catId === "8") return <RitualDashboard />;
  if (catId === "9") return <LogisticsDashboard />;

  const productList = products?.results || [];
  const totalProducts = products?.count || 0;
  const activeProducts = productList.filter(p => p.is_available).length || 0;
  const pendingProducts = productList.filter(p => p.status === 'pending').length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <Link
          to="/vendor/dashboard/products/create"
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-sm transition-colors"
        >
          <FiPlus className="mr-2" /> Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={isLoading ? "..." : totalProducts}
          icon={FiBox}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="Active Listings"
          value={isLoading ? "..." : activeProducts}
          icon={FiActivity}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Approval"
          value={isLoading ? "..." : pendingProducts}
          icon={FiActivity} // Reusing icon
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Revenue"
          value="$12,450"
          icon={FiDollarSign}
          color="bg-indigo-500"
          trend={8}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Revenue Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Products / Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Recent Products</h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>)}
              </div>
            ) : productList.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {product.image ? (
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500 text-capitalize">{product.status}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">${product.price}</span>
              </div>
            ))}
            <Link to="/vendor/dashboard/products" className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-4">
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
