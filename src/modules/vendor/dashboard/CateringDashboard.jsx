
import React from "react";
import { Link } from "react-router-dom";
import { FiCoffee, FiBox, FiClock, FiPlus } from "react-icons/fi";
import { useVendorProducts } from "../hooks/useVendorProducts";
import { getMediaUrl } from "@/core/utils/media";

export default function CateringDashboard() {
    const { data: products, isLoading } = useVendorProducts();

    const stats = React.useMemo(() => {
        const productList = products?.results || [];
        if (productList.length === 0) return { menus: 0, packages: 0 };
        const menus = productList.filter(p => {
            try {
                const meta = JSON.parse(p.description);
                return meta.type === 'menu' && p.is_available;
            } catch (e) { return false; }
        }).length;

        const packages = productList.filter(p => {
            try {
                const meta = JSON.parse(p.description);
                return meta.type === 'package' && p.is_available;
            } catch (e) { return false; }
        }).length;

        return { menus, packages };
    }, [products]);

    const popularItems = React.useMemo(() => {
        const productList = products?.results || [];
        if (productList.length === 0) return [];
        return productList.slice(0, 3).map(p => {
            try {
                const meta = JSON.parse(p.description);
                return {
                    id: p.id,
                    name: p.name,
                    price: `₹${p.price}${meta.type === 'menu' ? '/plate' : ''}`,
                    image: p.image,
                    type: meta.type
                };
            } catch (e) {
                return { id: p.id, name: p.name, price: `₹${p.price}`, image: p.image, type: 'product' };
            }
        });
    }, [products]);

    if (isLoading) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-orange-950">Catering Services</h1>
                    <p className="text-orange-800 mt-2 font-medium">Manage menus, orders, and food tasting sessions.</p>
                </div>
                <div className="bg-white p-5 rounded-full shadow-lg relative z-10 border border-orange-100">
                    <FiCoffee className="w-10 h-10 text-orange-500" />
                </div>
                {/* Decorative background shape */}
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-orange-100 rounded-full opacity-50 blur-3xl" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Menus</div>
                    <div className="text-4xl font-extrabold text-gray-900 mt-2">{stats.menus}</div>
                    <div className="mt-3 text-[10px] font-bold text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded-full">+2 from last month</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Packages</div>
                    <div className="text-4xl font-extrabold text-gray-900 mt-2">{stats.packages}</div>
                    <div className="mt-3 text-[10px] font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-full">Fully Optimized</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tasting Requests</div>
                    <div className="text-4xl font-extrabold text-gray-900 mt-2">3</div>
                    <div className="mt-3 text-[10px] font-bold text-orange-600 bg-orange-50 inline-block px-2 py-0.5 rounded-full">New Requests</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Revenue</div>
                    <div className="text-4xl font-extrabold text-gray-900 mt-2">₹85k</div>
                    <div className="mt-3 text-[10px] font-bold text-teal-600 bg-teal-50 inline-block px-2 py-0.5 rounded-full">↑ 15% this month</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-extrabold text-gray-900">Your Popular Menus</h3>
                        <Link to="/vendor/catering/dashboard/menus" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50 flex-1">
                        {popularItems.length > 0 ? popularItems.map((item, i) => (
                            <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition border-l-4 border-transparent hover:border-orange-400">
                                <div className="h-14 w-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                    {item.image ? (
                                        <img src={getMediaUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">NO IMG</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-0.5">{item.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${item.type === 'package' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {item.type}
                                        </span>
                                        <span className="text-xs text-gray-400">80+ orders this month</span>
                                    </div>
                                </div>
                                <span className="font-black text-gray-900 text-lg">{item.price}</span>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-400">
                                <FiBox className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="font-bold">No menus created yet</p>
                                <Link to="/vendor/catering/dashboard/menus" className="text-indigo-600 text-sm hover:underline mt-2 inline-block font-bold">Start Building &rarr;</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-extrabold text-gray-900">Upcoming Orders</h3>
                        <FiClock className="text-gray-300 w-5 h-5" />
                    </div>
                    <div className="space-y-6 flex-1">
                        {[
                            { title: "Wedding - Sarah & John", meta: "150 Guests • Aug 12, 2025", color: "orange" },
                            { title: "Corporate Gala", meta: "50 Guests • Sep 05, 2025", color: "blue" },
                            { title: "Birthday Bash", meta: "20 Guests • Sep 18, 2025", color: "purple" }
                        ].map((order, i) => (
                            <div key={i} className={`flex gap-4 items-start border-l-4 p-4 rounded-xl transition-all hover:bg-gray-50 ${order.color === 'orange' ? 'border-orange-400 bg-orange-50/30' :
                                order.color === 'blue' ? 'border-blue-400 bg-blue-50/30' : 'border-purple-400 bg-purple-50/30'
                                }`}>
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{order.title}</h4>
                                    <p className="text-xs text-gray-600 mt-2 font-medium bg-white/60 inline-block px-2 py-0.5 rounded border border-gray-100">{order.meta}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/vendor/catering/dashboard/bookings" className="mt-8 block text-center py-4 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-100 uppercase tracking-widest transition-colors">
                        View Full Schedule
                    </Link>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Link to="/vendor/catering/dashboard/menus" className="flex items-center gap-3 bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-orange-700 transition shadow-xl hover:shadow-orange-200 uppercase tracking-widest">
                    <FiPlus className="w-5 h-5" /> Create New Menu
                </Link>
            </div>
        </div>
    );
}
