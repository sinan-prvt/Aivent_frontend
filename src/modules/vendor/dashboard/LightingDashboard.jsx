import React from "react";
import { Link } from "react-router-dom";
import {
    FiDollarSign, FiCalendar, FiUsers, FiActivity, FiPlus,
    FiChevronDown, FiLoader, FiAlertTriangle, FiCheck, FiClock
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLightingData } from "../hooks/useLightingData";

export default function LightingDashboard() {
    const {
        profile,
        stats,
        activeSpecializations,
        technicians,
        equipmentStatus,
        revenueData,
        bookings,
        isLoading,
        isError
    } = useLightingData();

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <FiLoader className="w-12 h-12 text-sky-600 animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading L&S Dashboard...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center p-8">
                <div className="p-6 bg-rose-50 rounded-[2rem] text-rose-500">
                    <FiAlertTriangle className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-4">Connection Failed</h2>
                <p className="text-gray-500 max-w-md">We couldn't connect to the L&S service. Please check your internet or try again later.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-sky-600 text-white rounded-2xl font-black shadow-xl">Retry Connection</button>
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            trend: "+12%",
            trendColor: "text-emerald-500",
            icon: FiDollarSign,
            bgColor: "bg-gradient-to-br from-sky-500 to-blue-600",
            isHighlight: true,
        },
        {
            label: "Upcoming Bookings",
            value: `${stats.upcomingBookings} Events`,
            trend: "+23%",
            trendColor: "text-emerald-500",
            icon: FiCalendar,
            bgColor: "bg-white",
        },
        {
            label: "Technicians Available",
            value: `${stats.techniciansAvailable} / ${stats.totalTechnicians}`,
            trend: "+5%",
            trendColor: "text-emerald-500",
            icon: FiUsers,
            bgColor: "bg-white",
        },
        {
            label: "Equipment Utilization",
            value: `${stats.equipmentUtilization}%`,
            trend: "+18%",
            trendColor: "text-emerald-500",
            icon: FiActivity,
            bgColor: "bg-white",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Lighting & Sound Overview</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">
                        {activeSpecializations.length > 0
                            ? `Specializing in: ${activeSpecializations.join(", ")}`
                            : "An overview of bookings, technical stats, and revenue."}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-between gap-3 px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
                        <span>Last 30 Days</span>
                        <FiChevronDown />
                    </button>
                    <Link
                        to="/vendor/lighting/dashboard/products/create"
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-lg shadow-sky-100 transition-all transform hover:scale-[1.02] text-sm"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Add New Booking</span>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div
                        key={i}
                        className={`p-6 rounded-2xl border shadow-sm transition-all hover:shadow-lg ${stat.isHighlight
                            ? `${stat.bgColor} text-white border-transparent`
                            : `${stat.bgColor} border-gray-100`
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.isHighlight ? 'bg-white/20' : 'bg-sky-50'}`}>
                                <stat.icon className={`w-5 h-5 ${stat.isHighlight ? 'text-white' : 'text-sky-600'}`} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isHighlight ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${stat.isHighlight ? 'text-sky-100' : 'text-gray-400'}`}>
                            {stat.label}
                        </h3>
                        <p className={`text-2xl font-black ${stat.isHighlight ? 'text-white' : 'text-gray-900'}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Revenue Over Time</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Technician Availability */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Technician Availability</h3>
                    <div className="space-y-3">
                        {technicians.map((tech) => (
                            <div key={tech.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                    {tech.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{tech.name}</p>
                                    <p className="text-xs text-gray-400">{tech.role}</p>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${tech.status === 'available'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {tech.status === 'available' ? 'Available' : 'Busy'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Booking Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Booking Schedule</h3>
                        <Link to="/vendor/lighting/dashboard/schedule" className="text-xs font-bold text-sky-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-sky-50 transition-colors group">
                                <div className="text-center shrink-0">
                                    <p className="text-[10px] font-bold text-sky-600 uppercase">OCT</p>
                                    <p className="text-2xl font-black text-gray-900">{booking.date.split(' ')[1]}</p>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{booking.event}</h4>
                                    <p className="text-xs text-gray-400 truncate">{booking.venue}</p>
                                </div>
                                <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === 'confirmed'
                                    ? 'bg-sky-100 text-sky-700'
                                    : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Equipment Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Equipment Status</h3>
                        <Link to="/vendor/lighting/dashboard/inventory" className="text-xs font-bold text-sky-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                                    <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipmentStatus.length > 0 ? (
                                    equipmentStatus.map((item, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 text-sm font-medium text-gray-900 truncate max-w-[200px]">{item.name}</td>
                                            <td className="py-3 text-right">
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold ${item.statusColor}`}>
                                                    {item.status === 'Ready' ? <FiCheck className="w-3 h-3" /> : <FiClock className="w-3 h-3" />}
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="py-8 text-center text-gray-400 text-sm">No equipment added yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
