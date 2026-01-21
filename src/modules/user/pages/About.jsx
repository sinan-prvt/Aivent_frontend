
import React from "react";
import Navbar from "../../../components/layout/Navbar";
import { FiTarget, FiUsers, FiAward, FiHeart, FiArrowRight, FiCheckCircle, FiDollarSign, FiSearch } from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";

export default function About() {
    const stats = [
        { label: "Visionary Dreams", value: "Realized" },
        { label: "Budget Control", value: "100%" },
        { label: "Happy Clients", value: "99%" },
        { label: "Grand Celebrations", value: "Unlimited" },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-100 uppercase tracking-wider">
                        Born from Experience
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-gray-900 leading-[0.9]">
                        The Story Behind <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Aivent</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        How a single catering service transformed into a mission to democratize grand celebrations for everyone, regardless of budget.
                    </p>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-0 pointer-events-none">
                    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
                    <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-700"></div>
                </div>
            </div>

            {/* The Roots Section */}
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
                            className="relative w-full h-[500px] object-cover rounded-[2rem] shadow-2xl"
                            alt="Catering Hospitality"
                        />
                        <div className="absolute bottom-8 left-8 right-8 p-6 glass border border-white/20 rounded-2xl">
                            <p className="text-white font-semibold text-lg italic">"It all started in the heat of a kitchen, serving smiles and realizing dreams."</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-black mb-6 tracking-tight">Where it all began.</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                When I first started my catering service, I didn't just see guests being served; I saw families trying to create memories. Through countless interactions with clients, a pattern emerged—one that moved me deeply.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                    <FiUsers className="w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Deep Connections</h4>
                                    <p className="text-gray-500 text-sm">Talking to so many clients revealed the true pain of event planning.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                                    <HiOutlineSparkles className="w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">The Vision Gap</h4>
                                    <p className="text-gray-500 text-sm">Everyone wanted a "grand" celebration, but many had no roadmap to get there.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Problem Grid */}
            <div className="bg-gray-900 py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[150px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">The Challenges I Witnessed</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                            I saw clients struggling with issues that shouldn't exist in a world of celebrations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-800/50 p-10 rounded-[2.5rem] border border-gray-700 backdrop-blur-sm hover:border-gray-500 transition group">
                            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 transition">
                                <FiSearch className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Random Planning</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Most clients had no idea how to plan or what to do next. They settled for the nearest known manager, even if they weren't satisfied.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 p-10 rounded-[2.5rem] border border-blue-500/30 backdrop-blur-sm hover:border-blue-400 transition group">
                            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 transition">
                                <FiDollarSign className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">The Budget Shyness</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Clients with fixed budgets often felt shy to ask about costs for every single detail. They felt restricted by their financial boundaries.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 p-10 rounded-[2.5rem] border border-gray-700 backdrop-blur-sm hover:border-gray-500 transition group">
                            <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 transition">
                                <FiCheckCircle className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Lack of Satisfaction</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Traditional event management often failed to deliver the "Grand" feel that clients dreamed of within their specific budget.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Pivot Section */}
            <div className="py-32 px-6">
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">"Why not create a platform to solve these problems?"</h2>
                            <p className="text-indigo-100 text-xl leading-relaxed font-medium">
                                That single thought started it all. Aivent was born to bridge the gap between grand aspirations and real-world budgets, taking the shyness out of the equation and putting the power back into the client's hands.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-bold tracking-widest uppercase">The Solution</div>
                                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-bold tracking-widest uppercase">The Future</div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20">
                                <h4 className="text-2xl font-bold mb-4">Still in the Making...</h4>
                                <p className="text-indigo-100 leading-relaxed">
                                    We haven't fully launched yet, but our vision is clear. We are building the most intuitive, budget-conscious, and grand event planning experience ever created.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <p className="text-3xl font-black">{stat.value}</p>
                                        <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Re-imagined */}
            <div className="pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100 uppercase tracking-wider">
                        Our Mission
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 tracking-tight">Grandeur within Reach.</h2>
                    <p className="text-2xl text-gray-600 leading-relaxed font-medium italic">
                        "Your budget shouldn't limit your imagination. Our AI ensures that every penny works toward making your event grand, transparently and effortlessly."
                    </p>
                    <div className="flex justify-center pt-8">
                        <a href="/register" className="group relative px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            <span className="relative flex items-center justify-center gap-3">
                                Start Your Journey <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50 text-gray-400 py-16 px-6 border-t border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-xl">A</span>
                        </div>
                        <span className="text-gray-900 font-bold text-xl">Aivent.</span>
                    </div>
                    <p className="text-sm">© 2026 Aivent. Building the future of celebrations.</p>
                    <div className="flex gap-8 text-sm font-bold text-gray-600 uppercase tracking-widest">
                        <a href="#" className="hover:text-indigo-600 transition">Privacy</a>
                        <a href="#" className="hover:text-indigo-600 transition">Terms</a>
                        <a href="#" className="hover:text-indigo-600 transition">Contact</a>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .glass {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
            `}</style>
        </div>
    );
}
