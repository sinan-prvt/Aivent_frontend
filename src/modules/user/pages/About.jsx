
import React from "react";
import Navbar from "../../../components/layout/Navbar";
import { FiTarget, FiUsers, FiAward, FiHeart, FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";

export default function About() {
    const stats = [
        { label: "Events Managed", value: "10k+" },
        { label: "Trusted Vendors", value: "2,500+" },
        { label: "Happy Clients", value: "98%" },
        { label: "Cities Covered", value: "50+" },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-100 uppercase tracking-wider">
                        Our Story
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-gray-900">
                        We Orchestrate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Unforgettable Moments.</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Aivent isn't just a platform; it's the invisible engine behind the world's most spectacular events. We bridge the gap between visionary planners and master executors.
                    </p>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-0 pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse"></div>
                    <div className="absolute top-40 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse delay-700"></div>
                </div>
            </div>

            {/* Image Grid */}
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 h-96">
                    <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden relative shadow-2xl group">
                        <img src="/images/ai_event_stage.png" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Event Crowd" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white font-bold text-lg">Spectacular Gatherings</p>
                        </div>
                    </div>
                    <div className="rounded-3xl overflow-hidden relative shadow-lg group">
                        <img src="/images/luxury_venue.png" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Detailing" />
                    </div>
                    <div className="rounded-3xl overflow-hidden relative shadow-lg group">
                        <img src="/images/corporate_conference.png" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Conference" />
                    </div>
                    <div className="rounded-3xl overflow-hidden relative shadow-lg group">
                        <img src="/images/ai_network_abstract.png" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Style" />
                    </div>
                    <div className="rounded-3xl overflow-hidden relative shadow-lg group">
                        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Teamwork" />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 py-20 border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <p className="text-4xl md:text-5xl font-black text-indigo-600">{stat.value}</p>
                                <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Values */}
            <div className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-indigo-100 uppercase tracking-wider">
                                Our Mission
                            </div>
                            <h2 className="text-4xl font-bold mb-6 text-gray-900">Empowering Creativity with Intelligent Logistics.</h2>
                            <div className="space-y-6 text-lg text-gray-600">
                                <p>
                                    We believe that planning an event should be as joyful as the event itself. By harnessing the power of AI, we eliminate the friction of logistics, finding the perfect vendors, and managing budgets.
                                </p>
                                <p>
                                    Our platform is designed for the modern planner—whether you're organizing a corporate summit for thousands or an intimate wedding for close family. We provide the tools to make it perfect.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <FiTarget className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Precision Matching</h4>
                                        <p className="text-sm text-gray-500">AI-driven vendor recommendations.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                        <FiHeart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Curated Quality</h4>
                                        <p className="text-sm text-gray-500">Only the top 1% of vendors.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <HiOutlineLightningBolt className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Lightning Fast</h4>
                                        <p className="text-sm text-gray-500">From idea to plan in minutes.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                        <FiAward className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Award Winning</h4>
                                        <p className="text-sm text-gray-500">Recognized industry leader.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1973&auto=format&fit=crop"
                                alt="Workspace"
                                className="relative rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-900 py-24 px-6 text-center text-white">
                <div className="max-w-4xl mx-auto">
                    <HiOutlineSparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to create something extraordinary?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join thousands of planners and vendors who trust Aivent to bring their visions to life.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <a href="/register" className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2">
                            Start Planning Free <FiArrowRight />
                        </a>
                        <a href="/vendor/apply" className="px-8 py-4 bg-transparent border-2 border-gray-700 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2">
                            Join as Vendor
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer (Simplified for brevity, usually imported) */}
            <footer className="bg-gray-950 text-gray-500 py-12 px-6 border-t border-gray-900">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p>© 2026 Aivent Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Terms</a>
                        <a href="#" className="hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
