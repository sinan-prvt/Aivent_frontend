
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiZap, FiSearch, FiMapPin, FiAward, FiDollarSign, FiInfo, FiChevronRight, FiCheckCircle, FiStar } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import Navbar from "../../../components/layout/Navbar";
import { generatePlan } from "../api/planner.api";
import ChatModal from "../components/ChatModal";

const MagicPlanner = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [isPlanning, setIsPlanning] = useState(false);
    const [planResults, setPlanResults] = useState(null);
    const [preferences, setPreferences] = useState({
        priority: "balanced",
        city: "Mumbai"
    });
    const [chatProduct, setChatProduct] = useState(null);

    const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
    const priorities = [
        { id: "balanced", label: "Balanced", icon: <FiAward />, desc: "Best value vs quality" },
        { id: "price", label: "Budget", icon: <FiDollarSign />, desc: "Lowest price first" },
        { id: "quality", label: "Premium", icon: <FiStar />, desc: "Top reputation first" }
    ];

    const handlePlan = async (e) => {
        if (e) e.preventDefault();
        if (!prompt.trim()) {
            toast.error("Please describe your event first!");
            return;
        }

        setIsPlanning(true);
        setPlanResults(null);

        try {
            const data = await generatePlan(prompt, preferences);
            if (data.error) {
                toast.error(data.error);
            } else {
                setPlanResults(data);
                toast.success("Magic Plan generated!");
                // Scroll to results
                setTimeout(() => {
                    const el = document.getElementById("plan-results");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } catch (err) {
            console.error(err);
            toast.error("AI Planner is currently unavailable. Please try again later.");
        } finally {
            setIsPlanning(false);
        }
    };

    // Prepare chart data
    const chartData = planResults?.budget_breakdown ?
        Object.entries(planResults.budget_breakdown).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
        })) : [];

    const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-700 text-slate-900">
            <Navbar />

            {/* HERO SECTION - CONVERSATIONAL UI */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Magic Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-sm mb-6 animate-fadeIn">
                        <FiZap className="animate-spin-slow" />
                        <span>AI-Powered Event Intelligence</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                        Describe your dream event, <br />
                        <span className="text-indigo-600">we'll handle the rest.</span>
                    </h1>

                    <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Just tell us what you're planning, your budget, and where.
                        Our AI will find the best vendors, allocate your budget, and build a complete plan in seconds.
                    </p>

                    {/* MAGIC SEARCH BAR */}
                    <div className="relative group max-w-3xl mx-auto mb-10">
                        <form onSubmit={handlePlan} className="relative z-10 flex flex-col md:flex-row gap-4 p-2 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-200 focus-within:border-indigo-400 transition-all duration-300">
                            <div className="flex-1 flex items-center px-4">
                                <FiSearch className="text-slate-400 text-xl mr-3 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="e.g. Plan a luxury wedding in Mumbai for 10 lakhs..."
                                    className="w-full py-4 text-lg bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isPlanning}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-3xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPlanning ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Planning...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiZap />
                                        <span>Magic Plan</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* PREFERENCES CHIPS */}
                    <div className="flex flex-wrap justify-center gap-8 animate-fadeIn delay-200">
                        {/* City Picker */}
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select City</span>
                            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200">
                                {cities.slice(0, 3).map(city => (
                                    <button
                                        key={city}
                                        onClick={() => setPreferences({ ...preferences, city })}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${preferences.city === city ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority Picker */}
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority Weighting</span>
                            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200">
                                {priorities.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPreferences({ ...preferences, priority: p.id })}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${preferences.priority === p.id ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {p.icon}
                                        <span>{p.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* RESULTS SECTION */}
            {planResults && (
                <section id="plan-results" className="max-w-7xl mx-auto px-6 pb-24 w-full animate-slideUp">
                    <div className="grid lg:grid-cols-12 gap-10">

                        {/* LEFT: BUDGET & SUMMARY (4 Cols) */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Summary Card */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-fit">
                                <h3 className="text-2xl font-black text-slate-900 mb-6">Event Strategy</h3>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                                            <FiDollarSign />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Total Budget</p>
                                            <p className="text-2xl font-black text-slate-900">₹{planResults.total_allocated.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
                                            <FiMapPin />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Location</p>
                                            <p className="text-lg font-bold text-slate-800">{preferences.city}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 text-xl">
                                            <FiAward />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Priority Level</p>
                                            <p className="text-lg font-bold text-slate-800 capitalize">{preferences.priority}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-10 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
                                        Budget Distribution
                                        <FiInfo className="text-slate-300" />
                                    </h4>
                                    <div className="h-64 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    innerRadius={70}
                                                    outerRadius={90}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-3xl font-black text-slate-900">100%</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocated</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-3">
                                        {chartData.map((item, i) => (
                                            <div key={item.name} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                    <span className="text-slate-600 font-medium">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-900">₹{item.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: VENDOR BREAKDOWN (8 Cols) */}
                        <div className="lg:col-span-8 space-y-10">
                            <h2 className="text-4xl font-black text-slate-900">Recommended Mix</h2>

                            {planResults.plan.map((item, idx) => (
                                <div key={item.service} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-px bg-slate-200" />
                                        <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Service {idx + 1}: {item.service}</span>
                                        <div className="flex-1 h-px bg-slate-200" />
                                    </div>

                                    <div className="bg-[#E2E8F0]/30 rounded-[2.5rem] p-3 border border-slate-100">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">

                                            {/* AI REASONING (2 cols) */}
                                            <div className="lg:col-span-2 p-8 flex flex-col justify-center">
                                                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-4 tracking-widest">
                                                    <FiZap />
                                                    <span>AI Logic</span>
                                                </div>
                                                <p className="text-lg font-bold text-slate-800 leading-relaxed mb-6 italic">
                                                    "{item.reason}"
                                                </p>
                                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                                    <FiCheckCircle />
                                                    <span>Budget Verified</span>
                                                </div>
                                            </div>

                                            {/* BEST PRODUCT (3 cols) */}
                                            <div className="lg:col-span-3 bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/20 border border-slate-100 transition-all hover:-translate-y-1 group">
                                                {item.recommended_product ? (
                                                    <div>
                                                        <div className="relative h-48 rounded-2xl overflow-hidden mb-6 bg-slate-100">
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                                                            <div className="absolute top-4 right-4 z-20">
                                                                <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase text-indigo-700 shadow-sm">Best Value Match</span>
                                                            </div>
                                                            <img
                                                                src={`http://localhost:8003${item.recommended_product.image}`}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                alt={item.recommended_product.name}
                                                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"} // Fallback
                                                            />
                                                        </div>

                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.recommended_product.name}</h4>
                                                                <div className="flex items-center gap-2 text-slate-400 mt-1">
                                                                    <FiMapPin />
                                                                    <span className="text-xs font-bold uppercase">{item.recommended_product.city}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-2xl font-black text-indigo-600">₹{parseFloat(item.recommended_product.price).toLocaleString()}</span>
                                                                <span className="text-[10px] font-bold text-slate-300 uppercase">Per Package</span>
                                                            </div>
                                                        </div>

                                                        {/* Stats Row */}
                                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                                            <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Value Score</span>
                                                                <span className="text-lg font-black text-indigo-600">{item.recommended_product.value_score || "0.85"}</span>
                                                            </div>
                                                            <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                                                                <span className="text-lg font-black text-green-600">Available</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                                            <button
                                                                onClick={() => setChatProduct(item.recommended_product)}
                                                                className="py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-all"
                                                            >
                                                                Chat Now
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(`/products/${item.recommended_product.id}`)}
                                                                className="py-3.5 rounded-2xl border-2 border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                <span>View Detail</span>
                                                                <FiChevronRight />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50 rounded-2xl">
                                                        <FiInfo className="text-4xl text-slate-200 mb-4" />
                                                        <p className="text-slate-400 font-bold">No product matches found within budget in {preferences.city}.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ALTERNATIVES */}
                                    {item.alternatives && item.alternatives.length > 0 && (
                                        <div className="pl-8 space-y-4">
                                            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-4 h-px bg-slate-300" />
                                                Other Notable Options
                                            </h5>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {item.alternatives.map(alt => (
                                                    <div key={alt.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate(`/products/${alt.id}`)}>
                                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                                                            <img
                                                                src={`http://localhost:8003${alt.image}`}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                                alt={alt.name}
                                                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=200"}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h6 className="font-bold text-slate-900 truncate uppercase tracking-tight text-sm">{alt.name}</h6>
                                                            <p className="text-xs font-black text-indigo-600">₹{parseFloat(alt.price).toLocaleString()}</p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alt.tag === 'Budget Friendly' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>{alt.tag}</span>
                                                            </div>
                                                        </div>
                                                        <FiChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <ChatModal
                isOpen={!!chatProduct}
                onClose={() => setChatProduct(null)}
                vendorId={chatProduct?.vendor_id}
                vendorName={chatProduct?.name || "Vendor"}
                vendorImage={chatProduct?.image}
                vendorCategory={activeStep?.service} // Optional context
            />

            {/* CUSTOM STYLES & ANIMATIONS */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                .delay-200 { animation-delay: 0.2s; }
            `}</style>
        </div>
    );
};

export default MagicPlanner;
