
import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiStar, FiCalendar, FiPlus, FiBook } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Mon', rituals: 1 },
    { name: 'Tue', rituals: 2 },
    { name: 'Wed', rituals: 1 },
    { name: 'Thu', rituals: 3 },
    { name: 'Fri', rituals: 5 },
    { name: 'Sat', rituals: 8 },
    { name: 'Sun', rituals: 4 },
];

export default function RitualDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ritual & Ceremony Services</h1>
                    <p className="text-gray-500">Manage your ceremonies, rituals, and spiritual services.</p>
                </div>
                <Link to="/vendor/dashboard/products/create" className="bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition">
                    Add Service
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <FiHeart className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-rose-100 text-sm">Ceremonies This Month</p>
                            <p className="text-3xl font-bold">24</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-rose-100">
                        Next: Anniversary Ritual on Wed
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Service Rating</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">5.0</span>
                        <div className="flex text-yellow-400 mb-1">
                            <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Inquiries</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">12</span>
                        <span className="text-sm text-rose-400 mb-1">New</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Ceremony Schedule</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRituals" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="rituals" stroke="#e11d48" fillOpacity={1} fill="url(#colorRituals)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Ritual Tools</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50 transition flex items-center gap-3">
                            <FiBook className="text-rose-600" />
                            <span className="font-medium text-gray-700">Ceremony Guide</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50 transition flex items-center gap-3">
                            <FiCalendar className="text-rose-600" />
                            <span className="font-medium text-gray-700">Auspicious Dates</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50 transition flex items-center gap-3">
                            <FiPlus className="text-rose-600" />
                            <span className="font-medium text-gray-700">Custom Request</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
