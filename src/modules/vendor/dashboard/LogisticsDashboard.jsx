
import React from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiPackage, FiMap, FiPlus, FiBarChart2 } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Mon', loads: 10 },
    { name: 'Tue', loads: 8 },
    { name: 'Wed', loads: 15 },
    { name: 'Thu', loads: 22 },
    { name: 'Fri', loads: 35 },
    { name: 'Sat', loads: 40 },
    { name: 'Sun', loads: 20 },
];

export default function LogisticsDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Logistics & Utilities</h1>
                    <p className="text-gray-500">Manage your fleet, shipments, and inventory.</p>
                </div>
                <Link to="/vendor/dashboard/products/create" className="bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition">
                    Add Vehicle
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <FiTruck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-200 text-sm">Active Shipments</p>
                            <p className="text-3xl font-bold">14</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-slate-200">
                        Total Distance Today: 450km
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Fleet Status</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">12 / 15</span>
                        <span className="text-sm text-blue-500 font-medium mb-1">On Route</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Inventory Level</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">85%</span>
                        <span className="text-sm text-green-500 mb-1">Stable</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Weekly Logistics Load</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="loads" fill="#334155" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Logistics Tools</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-slate-100 hover:bg-slate-50 transition flex items-center gap-3">
                            <FiMap className="text-slate-600" />
                            <span className="font-medium text-gray-700">Route Tracker</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-slate-100 hover:bg-slate-50 transition flex items-center gap-3">
                            <FiPackage className="text-slate-600" />
                            <span className="font-medium text-gray-700">Inventory Scan</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-slate-100 hover:bg-slate-50 transition flex items-center gap-3">
                            <FiBarChart2 className="text-slate-600" />
                            <span className="font-medium text-gray-700">Efficiency Report</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
