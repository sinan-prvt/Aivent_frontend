
import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers, FiPlus } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Jan', bookings: 4 },
    { name: 'Feb', bookings: 3 },
    { name: 'Mar', bookings: 6 },
    { name: 'Apr', bookings: 8 },
    { name: 'May', bookings: 12 },
    { name: 'Jun', bookings: 15 },
];

export default function VenueDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
                    <p className="text-gray-500">Manage your halls, availability, and bookings.</p>
                </div>
                <Link to="/vendor/dashboard/products/create" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                    Add New Hall
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xlbackdrop-blur-sm">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-indigo-100 text-sm">Upcoming Events</p>
                            <p className="text-3xl font-bold">12</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-indigo-100">
                        Next: Wedding on Sat, 12th Aug
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Total Capacity</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">1,200</span>
                        <span className="text-sm text-green-600 font-medium mb-1">Guests</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Grand Hall (500)</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Garden (700)</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Inquiries</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">28</span>
                        <span className="text-sm text-gray-400 mb-1">this month</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Booking Analytics</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="bookings" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition flex items-center gap-3">
                            <FiPlus className="text-indigo-600" />
                            <span className="font-medium text-gray-700">Block Dates</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition flex items-center gap-3">
                            <FiUsers className="text-indigo-600" />
                            <span className="font-medium text-gray-700">Manage Staff</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition flex items-center gap-3">
                            <FiMapPin className="text-indigo-600" />
                            <span className="font-medium text-gray-700">Update Location</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
