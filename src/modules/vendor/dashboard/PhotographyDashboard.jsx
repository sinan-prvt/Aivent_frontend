
import React from "react";
import { Link } from "react-router-dom";
import { FiCamera, FiImage, FiCalendar } from "react-icons/fi";

const PhotoCard = ({ src, title, date }) => (
    <div className="relative group overflow-hidden rounded-xl aspect-[4/3] bg-gray-100">
        <img src={src} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <h4 className="text-white font-bold">{title}</h4>
            <p className="text-white/80 text-xs">{date}</p>
        </div>
    </div>
);

export default function PhotographyDashboard() {
    return (
        <div className="space-y-8">
            <div className="bg-purple-900 text-white rounded-2xl p-8 flex justify-between items-center shadow-xl">
                <div>
                    <h1 className="text-3xl font-bold">Photography Studio</h1>
                    <p className="text-purple-200 mt-2">Manage albums, bookings, and client galleries.</p>
                </div>
                <div className="bg-white/10 p-4 rounded-full">
                    <FiCamera className="w-8 h-8" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <FiImage className="text-purple-600" />
                        <span className="text-gray-500 font-medium text-sm">Total Photos</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">2,450</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <FiCalendar className="text-purple-600" />
                        <span className="text-gray-500 font-medium text-sm">Upcoming Shoots</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">8</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Recent Galleries</h3>
                        <Link to="#" className="text-purple-600 font-medium hover:underline text-sm">View All</Link>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <PhotoCard src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300" title="Sarah's Wedding" date="Oct 12" />
                        <PhotoCard src="https://images.unsplash.com/photo-1511285560982-1356c11d4606?auto=format&fit=crop&q=80&w=300" title="Corporate Event" date="Oct 10" />
                        <PhotoCard src="https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=300" title="Birthday Bash" date="Oct 05" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Shoot Schedule</h3>
                    <div className="space-y-4">
                        {[
                            { event: "Pre-wedding Shoot", time: "Tomorrow, 10:00 AM", loc: "Central Park" },
                            { event: "Product Launch", time: "Oct 24, 2:00 PM", loc: "Grand Hyatt" },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="flex-shrink-0 w-12 text-center">
                                    <span className="block text-xs font-bold text-gray-400 uppercase">OCT</span>
                                    <span className="block text-xl font-bold text-gray-900">{24 + i}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{item.event}</h4>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                    <p className="text-xs text-gray-400 mt-1">{item.loc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2.5 border border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition">
                        View Full Calendar
                    </button>
                </div>
            </div>
        </div>
    );
}
