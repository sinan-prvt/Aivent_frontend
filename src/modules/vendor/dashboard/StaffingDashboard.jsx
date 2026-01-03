
import React from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiClock, FiCheckSquare, FiPlus, FiCalendar } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Mon', staff: 5 },
    { name: 'Tue', staff: 5 },
    { name: 'Wed', staff: 8 },
    { name: 'Thu', staff: 12 },
    { name: 'Fri', staff: 25 },
    { name: 'Sat', staff: 40 },
    { name: 'Sun', staff: 20 },
];

export default function StaffingDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staffing & Management</h1>
                    <p className="text-gray-500">Manage your crew, rosters, and shifts.</p>
                </div>
                <Link to="/vendor/dashboard/products/create" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
                    Add Staff Member
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <FiUsers className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-emerald-100 text-sm">Active Staff Today</p>
                            <p className="text-3xl font-bold">18</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-emerald-100">
                        Total Shifts: 4
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Staff Attendance</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">98%</span>
                        <span className="text-sm text-green-500 font-medium mb-1">Excellent</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Pending Requests</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">5</span>
                        <span className="text-sm text-indigo-400 mb-1">Leaves</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Staffing Requirements Week</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="staff" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Management Tools</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50 transition flex items-center gap-3">
                            <FiCalendar className="text-emerald-600" />
                            <span className="font-medium text-gray-700">Roster Planner</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50 transition flex items-center gap-3">
                            <FiClock className="text-emerald-600" />
                            <span className="font-medium text-gray-700">Timesheets</span>
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50 transition flex items-center gap-3">
                            <FiCheckSquare className="text-emerald-600" />
                            <span className="font-medium text-gray-700">Payroll Check</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
