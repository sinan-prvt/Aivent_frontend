import React, { useMemo } from "react";
import { FiPlus, FiSearch, FiChevronDown, FiFilter, FiTag, FiBox, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useVendorProducts } from "../../hooks/useVendorProducts";
import { useCategories } from "../../../user/hooks/useCategories";

export default function DecorInventory() {
    const navigate = useNavigate();
    const { data: products, isLoading: productsLoading } = useVendorProducts();
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const isLoading = productsLoading || categoriesLoading;

    // Transform API data to UI format
    const inventoryItems = useMemo(() => {
        if (!products || !categories) return [];

        // Create ID -> Name map
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
        }, {});

        return products.map(item => ({
            id: item.id,
            name: item.name,
            // Mock quantity for now as it's not in the product API yet
            quantity: 1,
            category: categoryMap[item.category] || "General Decoration",
            // Map status/availability to condition
            condition: item.is_available ? "Excellent" : "Maintainance",
            conditionColor: item.is_available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
            image: item.image || "https://images.unsplash.com/photo-1544457070-4cd773b1d71e?auto=format&fit=crop&q=80&w=400"
        }));
    }, [products, categories]);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Manager</h1>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 animate-pulse">
                            Live Sync Active
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1 font-medium font-sans text-sm">Track and manage assets across your specialized departments.</p>
                </div>
                <button
                    onClick={() => navigate('/vendor/decoration/dashboard/products/create')}
                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] shrink-0 text-sm"
                >
                    <FiPlus className="w-5 h-5 shadow-sm" />
                    <span>Add New Unit</span>
                </button>
            </div>

            {/* Comprehensive Toolbar */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 relative group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by prop name, ID, or material..."
                        className="w-full pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all text-gray-800 font-bold text-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Category", icon: FiFilter },
                        { label: "Availability", icon: FiBox },
                        { label: "Condition", icon: FiTag }
                    ].map((filter, i) => (
                        <button key={i} className="flex items-center gap-3 px-6 py-5 bg-white border border-gray-100 rounded-2xl text-gray-700 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all hover:shadow-md">
                            <filter.icon className="text-gray-400" />
                            <span>{filter.label}</span>
                            <FiChevronDown className="text-gray-400 ml-1" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FiLoader className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-bold">Loading Inventory...</p>
                </div>
            ) : inventoryItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {inventoryItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col">
                            <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-black/60 backdrop-blur-xl text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl ring-1 ring-white/10">
                                        {item.category.split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 space-y-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-extrabold text-gray-900 leading-tight text-lg mb-1">{item.name}</h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                                </div>

                                <div className="flex justify-between items-center bg-gray-50/50 rounded-2xl p-4 ring-1 ring-gray-100/50">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tight">Units</span>
                                        <span className="text-xl font-black text-gray-900">{item.quantity}</span>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${item.conditionColor}`}>
                                        {item.condition}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                    <p className="text-gray-500 font-bold">No inventory items found.</p>
                    <button
                        onClick={() => navigate('/vendor/decoration/dashboard/products/create')}
                        className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-wide hover:underline"
                    >
                        Add your first item
                    </button>
                </div>
            )}

            {/* Custom Load Indicator / More items */}
            {inventoryItems.length > 0 && (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-indigo-600 rounded-full" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {inventoryItems.length} Assets</p>
                    <button className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] hover:text-indigo-800 transition-colors">Load Design Vault ↓</button>
                </div>
            )}
        </div>
    );
}
