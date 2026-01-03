
import React from "react";
import { Link } from "react-router-dom";
import { FiZap, FiTarget, FiLayers, FiPlus, FiActivity } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Mon', effects: 20 },
    { name: 'Tue', effects: 15 },
    { name: 'Wed', effects: 30 },
    { name: 'Thu', effects: 45 },
    { name: 'Fri', effects: 60 },
    { name: 'Sat', effects: 85 },
    { name: 'Sun', effects: 40 },
];

export default function LightingDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lighting & Effects</h1>
                    <p className="text-gray-500">Manage your lighting rigs, special effects, and atmosphere.</p>
                </div>
                <Link to="/vendor/dashboard/products/create" className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition">
                    Add Effect
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <FiZap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-amber-100 text-sm">Active Events</p>
                            <p className="text-3xl font-bold">5</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-amber-100">
                        Total Wattage: 4.5kW
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Power Efficiency</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">A+</span>
                        <span className="text-sm text-green-500 font-medium mb-1">Eco-Friendly</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Bulb Life Avg</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">82%</span>
                        <span className="text-sm text-indigo-400 mb-1">Good</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Weekly Effects Usage</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="effects" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Atmosphere Tools</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-amber-100 hover:bg-amber-50 transition flex items-center gap-3">
                            <FiTarget className="text-amber-600" />
                            <span className="font-medium text-gray-700">DMX Setup</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-amber-100 hover:bg-amber-50 transition flex items-center gap-3">
                            <FiLayers className="text-amber-600" />
                            <span className="font-medium text-gray-700">Visualizer</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-amber-100 hover:bg-amber-50 transition flex items-center gap-3">
                            <FiActivity className="text-amber-600" />
                            <span className="font-medium text-gray-700">Safety Check</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
