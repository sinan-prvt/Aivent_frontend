
import React from "react";
import { Link } from "react-router-dom";
import { FiLayers, FiPackage, FiCpu } from "react-icons/fi";

export default function DecorDashboard() {
    return (
        <div className="space-y-8">
            <div className="bg-pink-50 rounded-2xl p-8 border border-pink-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <span className="px-3 py-1 bg-pink-200 text-pink-800 text-xs font-bold rounded-full uppercase tracking-wider">Decoration</span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">Styling & Decor</h1>
                    <p className="text-gray-600 mt-2 max-w-lg">
                        Manage your inventory of props, lighting, and fabrics. Showcase your best themes to clients.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-semibold shadow-sm hover:shadow transition">
                        Inventory
                    </button>
                    <button className="px-6 py-3 bg-pink-600 text-white rounded-xl font-semibold shadow-md hover:bg-pink-700 transition">
                        Create Theme
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">Themes Catalog</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1519225468359-2996bc014714?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-900">24</span>
                        <span className="text-sm text-gray-500">Active Themes</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">Inventory Status</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Chairs & Seating</span>
                                <span className="font-bold text-green-600">85% Avail</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Lighting Units</span>
                                <span className="font-bold text-yellow-600">40% Avail</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[40%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Floral Props</span>
                                <span className="font-bold text-indigo-600">90% Avail</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[90%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-2">Item Requests</h3>
                    <p className="text-sm text-gray-500 mb-6">Pending requests for custom decor items.</p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">JD</div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold">John Doe</h4>
                                <p className="text-xs text-gray-500">Req: Vintage Lamps</p>
                            </div>
                            <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium">Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
