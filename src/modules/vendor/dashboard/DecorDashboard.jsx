import React from "react";
import { Link } from "react-router-dom";
import { FiLayout, FiStar, FiGrid, FiPlus, FiChevronDown, FiTrendingUp, FiLoader, FiAlertTriangle, FiAperture } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useDecorationData } from "../hooks/useDecorationData";

export default function DecorDashboard() {
    const {
        profile,
        stats,
        activeSpecializations,
        categorizedThemes,
        isLoading,
        isError
    } = useDecorationData();

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <FiLoader className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading Design Studio...</p>
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
                <p className="text-gray-500 max-w-md">We couldn't connect to the décor vault. Please check your internet or try again later.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">Retry Connection</button>
            </div>
        );
    }

    const statCards = [
        { label: "Total Designs", value: stats.totalDesigns, icon: FiLayout, color: "bg-indigo-100 text-indigo-600" },
        { label: "Approved Pros", value: stats.activeProjects, icon: FiStar, color: "bg-amber-100 text-amber-600" },
        { label: "Pending Review", value: stats.pendingDesigns, icon: FiTrendingUp, color: "bg-emerald-100 text-emerald-600" },
    ];

    const inventoryDistribution = [
        { name: "Wedding Stage", value: 35, color: "#818CF8" },
        { name: "Floral Decor", value: 25, color: "#F472B6" },
        { name: "Theme Props", value: 15, color: "#FBBF24" },
        { name: "Mandap", value: 15, color: "#EC4899" },
        { name: "Table & Chairs", value: 10, color: "#10B981" },
    ];

    // Show top 3 themes in the dashboard gallery
    const displayThemes = categorizedThemes.slice(0, 3);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profile.business_name || "Professional Décor Studio"}</h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        {activeSpecializations.length > 0
                            ? `Specializing in: ${activeSpecializations.join(", ")}`
                            : "Manage all your specializations: Stage, Floral, Theme, Mandap, and Seating."}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-between gap-3 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
                        <span>All Specializations</span>
                        <FiChevronDown />
                    </button>
                    <Link
                        to="/vendor/decoration/dashboard/products/create"
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all transform hover:scale-[1.02] text-sm"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Create New Design</span>
                    </Link>
                </div>
            </div>

            {/* Specialized Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-6 group">
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} bg-opacity-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</span>
                            <div className="text-3xl font-black text-gray-900 mt-1">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Design Gallery */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Live Designs</h2>
                    <Link to="/vendor/decoration/dashboard/themes" className="text-xs font-bold text-indigo-600 hover:underline px-4 py-2 bg-indigo-50 rounded-full">Explore Catalog →</Link>
                </div>

                {displayThemes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayThemes.map((item, i) => (
                            <div key={i} className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-sm">
                                            {item.categoryName}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-gray-900 truncate">{item.name}</h3>
                                    <div className="flex items-center gap-4 mt-3 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                            <FiStar className="fill-indigo-600" />
                                            <span>{item.status === 'approved' ? 'Premium' : 'Review'}</span>
                                        </div>
                                        <div className="ml-auto text-lg font-black text-gray-900">
                                            ₹{(item.price / 1000).toFixed(0)}k
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-16 text-center shadow-sm">
                        <FiGrid className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-900">No Designs Found</h3>
                        <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">Click below to start building your professional decoration portfolio.</p>
                        <Link to="/vendor/decoration/dashboard/products/create" className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg inline-block text-sm">Create First Design</Link>
                    </div>
                )}
            </div>

            {/* Inventory Distribution */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-indigo-950 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 border border-white/10 shadow-xl overflow-hidden relative">
                    <div className="flex-1 space-y-4 relative z-10">
                        <h2 className="text-2xl font-black tracking-tight">Portfolio Analysis</h2>
                        <p className="text-indigo-200 font-medium text-sm leading-relaxed">
                            A breakdown of your active assets across specializations.
                        </p>
                        <div className="grid grid-cols-1 gap-3 pt-2">
                            {inventoryDistribution.map((item, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs font-bold text-indigo-100 group-hover:text-white transition-colors">{item.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black opacity-40 group-hover:opacity-100 transition-opacity">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-56 h-56 shrink-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {inventoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-white">{activeSpecializations.length || "0"}</span>
                            <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Dept.</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:rotate-12 transition-transform">
                                <FiStar className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Analytics</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Growth Performance</p>
                            </div>
                        </div>
                        <button className="mt-auto w-full py-4 bg-gray-50 hover:bg-amber-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                            Open report
                        </button>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:rotate-12 transition-transform">
                                <FiAperture className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Collaboration</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unread Messages</p>
                            </div>
                        </div>
                        <Link to="/vendor/decoration/dashboard/inbox" className="mt-auto w-full py-4 bg-gray-50 hover:bg-emerald-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all text-center">
                            Open Inbox
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
