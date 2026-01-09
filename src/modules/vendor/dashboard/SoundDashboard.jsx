
import React from "react";
import { Link } from "react-router-dom";
import { FiMusic, FiCalendar, FiClock, FiActivity, FiUsers } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useVendorProducts } from "../hooks/useVendorProducts";
import { useScheduleTasks } from "../hooks/useScheduleTasks";
import { format, parseISO, isAfter, startOfToday } from "date-fns";

// --- Mock Data for Chart (Revenue API not ready yet) ---
const usageData = [
    { name: 'Mon', usage: 4 },
    { name: 'Tue', usage: 3 },
    { name: 'Wed', usage: 6 },
    { name: 'Thu', usage: 8 },
    { name: 'Fri', usage: 12 },
    { name: 'Sat', usage: 15 },
    { name: 'Sun', usage: 10 },
];

export default function SoundDashboard() {
    const { data: products, isLoading: productsLoading } = useVendorProducts();
    const { tasks, isLoading: tasksLoading } = useScheduleTasks();

    // Stats Calculation
    const totalServices = products?.length || 0;
    const activeServices = products?.filter(p => p.status === 'approved').length || 0;

    // Upcoming Events Logic
    const today = startOfToday();
    const upcomingEvents = tasks
        ?.filter(task => isAfter(parseISO(task.start_time), today))
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, 3) || [];

    const totalBookings = tasks?.length || 0;
    const completedGigs = tasks?.filter(t => t.status === 'completed').length || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Sound & Music Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your sound business.</p>
                </div>
                <Link to="/vendor/sound/dashboard/services" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                    Manage Services
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Stat Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                            <FiMusic className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-indigo-200 font-medium">Active Packages</p>
                            <p className="text-4xl font-black tracking-tight">{productsLoading ? "..." : activeServices}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                            <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Total Services</span>
                            <span className="font-bold text-lg">{totalServices}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Completed Gigs</span>
                            <span className="font-bold text-lg">{completedGigs}</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <FiCalendar className="text-indigo-600" /> Upcoming Gigs
                        </h3>
                        <Link to="/vendor/sound/dashboard/schedule" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {tasksLoading ? (
                            <p className="text-gray-400 text-center py-4">Loading schedule...</p>
                        ) : upcomingEvents.length > 0 ? (
                            upcomingEvents.map(event => (
                                <div key={event.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-700 shrink-0">
                                        <span className="text-[10px] font-bold uppercase">{format(parseISO(event.start_time), "MMM")}</span>
                                        <span className="text-lg font-black leading-none">{format(parseISO(event.start_time), "dd")}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{event.event_name}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <FiClock className="w-3 h-3" /> {format(parseISO(event.start_time), "p")}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{event.location}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-4">
                                <FiCalendar className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">No upcoming gigs found.</p>
                                <Link to="/vendor/sound/dashboard/schedule" className="text-xs text-indigo-600 font-bold mt-2 hover:underline">Add one now</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FiActivity className="text-orange-500" /> Performance
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-green-600">
                                    <FiActivity />
                                </div>
                                <span className="text-sm font-medium text-gray-600">Booking Rate</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{totalBookings > 0 ? "100%" : "0%"}</span>
                        </div>

                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                            <p className="text-indigo-900 font-bold text-sm mb-1">Pro Tip</p>
                            <p className="text-indigo-700 text-xs leading-relaxed">
                                ensure your "Sound Services" have high-quality images to increase booking requests by up to 40%.
                            </p>
                            <Link to="/vendor/sound/dashboard/services" className="text-indigo-600 text-xs font-bold mt-3 block hover:underline">Update Services &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Weekly Engagement</h3>
                        <p className="text-gray-500 text-sm">Profile views and booking inquiries.</p>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={usageData}>
                            <defs>
                                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="usage"
                                stroke="#4f46e5"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUsage)"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
