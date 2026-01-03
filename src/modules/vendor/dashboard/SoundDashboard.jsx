
import React from "react";
import { Link } from "react-router-dom";
import { FiMusic, FiMic, FiSpeaker, FiPlus, FiSettings } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Mon', usage: 4 },
    { name: 'Tue', usage: 3 },
    { name: 'Wed', usage: 6 },
    { name: 'Thu', usage: 8 },
    { name: 'Fri', usage: 12 },
    { name: 'Sat', usage: 15 },
    { name: 'Sun', usage: 10 },
];

export default function SoundDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sound & Music Management</h1>
                    <p className="text-gray-500">Manage your playlists, equipment, and sound services.</p>
                </div>
                <Link to="/vendor/dashboard/products/create" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                    Add Equipment
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <FiMusic className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-indigo-100 text-sm">Gigs This Week</p>
                            <p className="text-3xl font-bold">8</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-indigo-100">
                        Next: DJ Set on Fri, 15th Aug
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Sound Quality Rating</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">4.9</span>
                        <span className="text-sm text-yellow-500 font-medium mb-1">/ 5.0</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Equipment Status</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">95%</span>
                        <span className="text-sm text-green-500 mb-1">Ready</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Equipment Usage Analytics</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="usage" stroke="#4f46e5" fillOpacity={1} fill="url(#colorUsage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Audio Tools</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition flex items-center gap-3">
                            <FiPlus className="text-indigo-600" />
                            <span className="font-medium text-gray-700">New Playlist</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition flex items-center gap-3">
                            <FiMic className="text-indigo-600" />
                            <span className="font-medium text-gray-700">Audio Check</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition flex items-center gap-3">
                            <FiSpeaker className="text-indigo-600" />
                            <span className="font-medium text-gray-700">Gear Setup</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
