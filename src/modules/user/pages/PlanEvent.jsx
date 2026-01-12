
import React, { useState } from "react";
import ChatModal from "../components/ChatModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/catalog.api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Navbar from "../../../components/layout/Navbar"; // Assuming standard Navbar
import { FiMessageSquare, FiStar, FiFilter, FiInfo } from "react-icons/fi";

const PlanEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialState = location.state || {
        eventData: { eventType: "Wedding", budget: 20000, guests: 150 },
        categories: ["Venue", "Catering"],
    };

    const [activeTab, setActiveTab] = useState(initialState.categories[0] || "Venue");
    const [budget, setBudget] = useState([2000, 8500]); // Mock range
    const [selectedItems, setSelectedItems] = useState([]);
    const [chatProduct, setChatProduct] = useState(null);

    // Fetch Categories
    const { data: categories } = useCategories();

    // Get the category ID for the active tab - make matching flexible
    const activeCategoryId = categories?.find(
        (cat) => cat.name && typeof cat.name === 'string' && typeof activeTab === 'string' && cat.name.trim().toLowerCase() === activeTab.trim().toLowerCase()
    )?.id;

    // Fetch Products filtered by category
    const { data: products, isLoading } = useQuery({
        queryKey: ["products", activeCategoryId],
        queryFn: () => getProducts({ category: activeCategoryId }),
        enabled: !!activeCategoryId, // Only fetch if we have a category ID
    });

    // Calculate Budget Stats
    const totalBudget = parseInt(initialState.eventData.budget) || 20000;
    const selectedTotal = selectedItems.reduce((acc, item) => acc + parseFloat(item.price), 0);
    const remaining = totalBudget - selectedTotal;

    const chartData = [
        { name: "Selected", value: selectedTotal },
        { name: "Remaining", value: remaining > 0 ? remaining : 0 },
    ];
    const COLORS = ["#6366f1", "#e5e7eb"]; // Indigo-500, Gray-200

    const handleSelect = (product) => {
        if (selectedItems.find((i) => i.id === product.id)) {
            setSelectedItems(selectedItems.filter((i) => i.id !== product.id));
        } else {
            setSelectedItems([...selectedItems, product]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

                {/* LEFT COLUMN - MAIN CONTENT */}
                <div className="flex-1 space-y-8">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Plan your event</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Planning: <span className="font-medium text-gray-900">{initialState.eventData.eventType}</span>
                            </p>
                        </div>
                    </div>

                    {/* Categories Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Tabs">
                            {(initialState.categories.length > 0 ? initialState.categories : ["Venue", "Catering", "Photography", "Music"]).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${activeTab === tab
                                        ? "border-indigo-500 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Budget Allocation / Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{activeTab} Budget Allocation</h3>
                            <span className="text-xs text-gray-500">Adjust sliders to find vendors that fit your budget.</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Price Range</span>
                                    <span className="font-medium text-indigo-600">${budget[0]} - ${budget[1]}</span>
                                </div>
                                <input type="range" className="w-full accent-indigo-600" />
                                {/* Dual slider would be better, using simple input for mock */}
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Guest Capacity</span>
                                    <span className="font-medium text-indigo-600">{initialState.eventData.guests} Guests</span>
                                </div>
                                <input type="range" className="w-full accent-indigo-600" defaultValue={initialState.eventData.guests} max="1000" />
                            </div>
                        </div>
                    </div>

                    {/* Recommended Products */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended {activeTab}s</h3>

                        {isLoading ? (
                            <div className="grid md:grid-cols-2 gap-6 animate-pulse">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>)}
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {products?.map((product) => {
                                    const isSelected = selectedItems.find(i => i.id === product.id);
                                    return (
                                        <div key={product.id} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-100'}`}>
                                            {/* Product Image */}
                                            {product.image && (
                                                <div className="mb-4 rounded-xl overflow-hidden h-48 bg-gray-100">
                                                    <img
                                                        src={product.image.startsWith('http') ? product.image : `http://localhost:8003${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                                        onClick={() => navigate(`/products/${product.id}`)}
                                                    />
                                                </div>
                                            )}

                                            <div onClick={() => navigate(`/products/${product.id}`)} className="cursor-pointer group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                                            {product.name}
                                                            <FiInfo className="text-gray-400 w-4 h-4" />
                                                        </h4>
                                                        <p className="text-xs text-gray-500">Downtown, Metropolis</p> {/* Mock location */}
                                                    </div>
                                                    <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold gap-1">
                                                        <FiStar className="fill-current" /> 4.9
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="font-bold text-2xl text-indigo-900 mb-1">
                                                ${parseFloat(product.price).toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ event</span>
                                            </div>

                                            {parseInt(product.price) > remaining && !isSelected && (
                                                <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded mb-4">
                                                    Over Budget
                                                </span>
                                            )}

                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => handleSelect(product)}
                                                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${isSelected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                                >
                                                    {isSelected ? "Remove" : "Select"}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent navigation
                                                        setChatProduct(product);
                                                    }}
                                                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                                >
                                                    Chat
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT COLUMN - SIDEBAR */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* Budget Overview Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-6">Budget Overview</h3>

                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Total Budget</span>
                            <span className="font-bold text-gray-900 text-lg">${totalBudget.toLocaleString()}</span>
                        </div>

                        <div className="mb-6 relative h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Centered Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-gray-400">Remaining</span>
                                <span className={`text-xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    ${remaining.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                                    <span className="text-gray-600">Selected Total</span>
                                </div>
                                <span className="font-semibold">${selectedTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-gray-200"></span>
                                    <span className="text-gray-600">Remaining</span>
                                </div>
                                <span className="font-semibold text-gray-500">${remaining.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/checkout", { state: { selectedItems, eventData: initialState.eventData, totalBudget } })}
                            className="w-full mt-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                        >
                            Review & Book
                        </button>

                    </div>
                </div>

            </main>

            <ChatModal
                isOpen={!!chatProduct}
                onClose={() => setChatProduct(null)}
                vendorId={chatProduct?.vendor_id || chatProduct?.id}
                vendorName={chatProduct?.name || "Vendor"}
                vendorImage={chatProduct?.image}
                vendorCategory={chatProduct?.category || activeTab}
                vendorRating={chatProduct?.rating || 4.9}
            />
        </div >
    );
};

export default PlanEvent;
