
import React from "react";
import { Link } from "react-router-dom";
import { FiCoffee, FiList, FiTrendingUp } from "react-icons/fi";

export default function CateringDashboard() {
    return (
        <div className="space-y-8">
            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-orange-900">Catering Services</h1>
                    <p className="text-orange-700 mt-2">Manage menus, orders, and food tasting sessions.</p>
                </div>
                <div className="bg-white p-4 rounded-full shadow-sm">
                    <FiCoffee className="w-8 h-8 text-orange-500" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-sm text-gray-500 font-medium">Active Menus</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">8</div>
                    <div className="mt-2 text-xs text-green-600">+2 from last month</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-sm text-gray-500 font-medium">Pending Orders</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">5</div>
                    <div className="mt-2 text-xs text-orange-600">Action required</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-sm text-gray-500 font-medium">Tasting Requests</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">3</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-sm text-gray-500 font-medium">Revenue</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">$8.5k</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Popular Menus</h3>
                        <Link to="#" className="text-sm text-indigo-600 font-medium hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[
                            { name: "Royal Indian Feast", price: "$45/plate", orders: 120 },
                            { name: "Continental Buffet", price: "$35/plate", orders: 85 },
                            { name: "High Tea Special", price: "$20/plate", orders: 40 },
                        ].map((menu, i) => (
                            <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{menu.name}</h4>
                                    <p className="text-xs text-gray-500">{menu.orders} orders this month</p>
                                </div>
                                <span className="font-bold text-gray-900">{menu.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Upcoming Orders</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4 items-start border-l-4 border-orange-400 bg-orange-50 pl-4 py-3 rounded-r-lg">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Wedding - Sarah & John</h4>
                                    <p className="text-xs text-gray-600 mt-1">150 Guests • Aug 12, 2025</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Link to="/vendor/dashboard/products/create" className="flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-md hover:shadow-lg">
                    <FiList /> Create New Menu
                </Link>
            </div>
        </div>
    );
}
