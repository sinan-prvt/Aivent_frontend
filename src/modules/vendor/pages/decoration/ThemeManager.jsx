import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiLayout, FiPlus, FiGrid, FiList, FiMoreVertical, FiStar, FiChevronRight, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { useDecorationData } from "../../hooks/useDecorationData";

const categories = [
    "Wedding Stage Decor",
    "Floral Decoration",
    "Theme Decoration",
    "Mandap Decoration",
    "Table & Seating Decor"
];

export default function ThemeManager() {
    const [activeTab, setActiveTab] = useState("All");
    const { categorizedThemes, isLoading, isError } = useDecorationData();

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <FiLoader className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Accessing Design Vault...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center p-8">
                <div className="p-6 bg-rose-50 rounded-[2rem] text-rose-500">
                    <FiAlertTriangle className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-4">Vault Locked</h2>
                <p className="text-gray-500 max-w-md">We couldn't retrieve your designs. Please verify your connection or try again.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">Retry Access</button>
            </div>
        );
    }

    const filteredThemes = activeTab === "All"
        ? categorizedThemes
        : categorizedThemes.filter(t => t.categoryName.includes(activeTab));

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Design Vault</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your premium decoration packages across all specializations.</p>
                </div>
                <Link
                    to="/vendor/decoration/dashboard/products/create"
                    className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] shrink-0 text-sm"
                >
                    <FiPlus className="w-5 h-5 shadow-sm" />
                    <span>Create New Design</span>
                </Link>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap gap-2 bg-white/50 p-1.5 rounded-[2rem] border border-gray-100 self-start">
                {["All", ...categories.map(c => c.split(' ')[0])].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${(tab === activeTab || (activeTab !== "All" && activeTab.includes(tab)))
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-gray-900 hover:bg-white"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Themes Grid */}
            {filteredThemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredThemes.map((theme) => (
                        <div key={theme.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col overflow-hidden">
                            <div className="p-8 space-y-8 flex-1">
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl ${theme.categoryName.includes("Mandap") ? "bg-amber-50 text-amber-600" :
                                        theme.categoryName.includes("Stage") ? "bg-indigo-50 text-indigo-600" :
                                            theme.categoryName.includes("Floral") ? "bg-rose-50 text-rose-600" :
                                                theme.categoryName.includes("Theme") ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
                                        } transition-transform group-hover:rotate-12`}>
                                        <FiLayout className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-[9px] font-black border border-gray-100">
                                        <FiStar className="text-amber-400 fill-amber-400" />
                                        <span>4.9</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-1 truncate">{theme.name}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{theme.categoryName}</p>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">Est. Price</span>
                                        <div className="text-xl font-black text-gray-900">₹{(theme.price / 1000).toFixed(0)}k</div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${theme.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                        {theme.status === 'approved' ? 'Premium' : 'Review'}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to={`/vendor/decoration/dashboard/products/${theme.id}/edit`}
                                className="w-full py-6 bg-gray-50 hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/btn"
                            >
                                <span>Edit Design Details</span>
                                <FiChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100">
                    <FiGrid className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-gray-900">No Content Found</h2>
                    <p className="text-gray-400 mt-2 text-sm max-w-sm mx-auto">You haven't added any packages under the **{activeTab}** specialization yet.</p>
                    <Link to="/vendor/decoration/dashboard/products/create" className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl inline-block text-sm">Create New Design</Link>
                </div>
            )}

            {/* Recommendation Section */}
            <div className="bg-indigo-950 rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-6 max-w-xl">
                    <h2 className="text-3xl font-black tracking-tight leading-tight">Growth Recommendations</h2>
                    <p className="text-indigo-200 text-base font-medium leading-relaxed">
                        Expanding your **Traditional Mandap** collection could capture 25% more seasonal bookings. Start building new templates to increase your visibility.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link to="/vendor/decoration/dashboard/products/create" className="px-6 py-3 bg-white text-indigo-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                            Build Template
                        </Link>
                        <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
                            View Insights
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            </div>
        </div>
    );
}
