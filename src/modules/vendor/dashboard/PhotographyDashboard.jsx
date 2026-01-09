
import React from "react";
import { Link } from "react-router-dom";
import { FiCamera, FiImage, FiCalendar, FiBox, FiClock, FiMapPin } from "react-icons/fi";
import { usePhotographyData } from "../hooks/usePhotographyData";

const MEDIA_BASE_URL = "http://localhost:8003";

const PhotoCard = ({ src, title, date }) => {
    const imageUrl = src?.startsWith("http") ? src : `${MEDIA_BASE_URL}${src}`;
    return (
        <div className="relative group overflow-hidden rounded-xl aspect-[4/3] bg-gray-100 shadow-sm border border-gray-100">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300";
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h4 className="text-white font-bold truncate">{title}</h4>
                <p className="text-white/80 text-xs">{date}</p>
            </div>
        </div>
    );
};

export default function PhotographyDashboard() {
    const { stats, recentDeliveries, upcomingSchedule, isLoading, isError } = usePhotographyData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-8 flex justify-between items-center shadow-xl">
                <div>
                    <h1 className="text-3xl font-bold">Photography Studio</h1>
                    <p className="text-purple-100 mt-2 opacity-80">Manage albums, bookings, and client galleries in real-time.</p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                    <FiCamera className="w-10 h-10" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <FiBox className="text-purple-600" />
                        </div>
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Packages</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.totalPackages}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FiImage className="text-blue-600" />
                        </div>
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total Deliveries</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.totalDeliveries}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <FiCalendar className="text-emerald-600" />
                        </div>
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Upcoming Shoots</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.upcomingShoots}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <FiCamera className="text-amber-600" />
                        </div>
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Completed</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.completedShoots}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Recent Deliveries</h3>
                        <Link to="/vendor/photography/dashboard/delivery" className="text-purple-600 font-bold hover:underline text-sm uppercase tracking-wider">View Center</Link>
                    </div>

                    {recentDeliveries.length > 0 ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {recentDeliveries.map((item) => (
                                <PhotoCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                            <FiImage className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No deliveries yet. Start by adding one in the Delivery Center.</p>
                            <Link to="/vendor/photography/dashboard/delivery" className="inline-block mt-4 text-purple-600 font-bold text-sm">Open Delivery Center →</Link>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center justify-between">
                        Shoot Schedule
                        <FiCalendar className="text-gray-300" />
                    </h3>

                    <div className="space-y-6">
                        {upcomingSchedule.length > 0 ? (
                            upcomingSchedule.map((item, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center transition-colors group-hover:bg-purple-50">
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase">{item.month}</span>
                                        <span className="block text-xl font-black text-gray-900 group-hover:text-purple-600">{item.day}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.event}</h4>
                                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
                                            <FiClock className="text-gray-300" size={12} /> {item.time}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                                            <FiMapPin className="text-gray-300" size={12} /> {item.loc}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 text-sm italic">No upcoming shoots scheduled.</p>
                                <Link to="/vendor/photography/dashboard/schedule" className="inline-block mt-3 text-purple-600 font-bold text-xs uppercase tracking-widest">Update Schedule</Link>
                            </div>
                        )}
                    </div>
                    {upcomingSchedule.length > 0 && (
                        <Link to="/vendor/photography/dashboard/schedule" className="block w-full text-center mt-8 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors uppercase tracking-widest">
                            Full Calendar
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
