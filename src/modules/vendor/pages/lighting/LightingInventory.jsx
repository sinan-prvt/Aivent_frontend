import React, { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiLoader, FiEye, FiEdit2, FiTrash2, FiX, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useVendorProducts } from "../../hooks/useVendorProducts";
import { useCategories } from "../../../user/hooks/useCategories";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import Pagination from '@/components/ui/Pagination';

// Internal Modal Component for Equipment View
const EquipmentViewModal = ({ equipment, onClose }) => {
    if (!equipment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                    <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-sky-600 font-bold text-xs uppercase tracking-widest mb-1 block">{equipment.category}</span>
                            <h2 className="text-2xl font-black text-gray-900">{equipment.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><FiX className="w-5 h-5 text-gray-500" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">ID</span><p className="font-bold text-gray-900">#{equipment.id}</p></div>
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Quantity</span><p className="font-bold text-gray-900">{equipment.quantity} Units</p></div>
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Status</span><p className="font-bold text-gray-900 capitalize">{equipment.status || 'Pending'}</p></div>
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Availability</span><p className="font-bold text-gray-900">{equipment.available ? 'Available' : 'Unavailable'}</p></div>
                    </div>
                    <button onClick={onClose} className="mt-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200">Close</button>
                </div>
            </div>
        </div>
    );
};

// Equipment category options
const EQUIPMENT_CATEGORIES = [
    { value: "all", label: "All Categories" },
    { value: "lighting", label: "Lighting" },
    { value: "sound", label: "Sound" },
    { value: "microphones", label: "Microphones" },
    { value: "effects", label: "Effects" },
    { value: "panels", label: "Panels" },
];

const AVAILABILITY_OPTIONS = [
    { value: "all", label: "Any Availability Status" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
];

export default function LightingInventory() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { data: productsData, isLoading: productsLoading } = useVendorProducts(currentPage);
    const products = productsData?.results || [];
    const totalCount = productsData?.count || 0;
    const { data: categories, isLoading: categoriesLoading } = useCategories();
    const deleteMutation = useDeleteProduct();
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");

    const isLoading = productsLoading || categoriesLoading;

    const equipmentItems = useMemo(() => {
        if (!products) return [];

        // Map products to equipment items with additional mock data
        let items = products.map((item, index) => {
            // Determine category based on name
            let category = "Lighting";
            const nameLower = item.name?.toLowerCase() || "";
            if (nameLower.includes('speaker') || nameLower.includes('audio')) category = "Sound";
            if (nameLower.includes('mic') || nameLower.includes('microphone')) category = "Microphones";
            if (nameLower.includes('laser') || nameLower.includes('fog') || nameLower.includes('effect')) category = "Effects";
            if (nameLower.includes('panel') || nameLower.includes('wall')) category = "Panels";

            return {
                id: item.id,
                name: item.name,
                quantity: Math.floor(Math.random() * 20) + 1, // Mock quantity
                status: item.status,
                category: category,
                available: item.is_available,
                image: item.image || getDefaultImage(category),
            };
        });

        // Apply search filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lowerQuery) ||
                item.category.toLowerCase().includes(lowerQuery) ||
                String(item.id).includes(lowerQuery)
            );
        }

        // Apply category filter
        if (categoryFilter !== "all") {
            items = items.filter(item => item.category.toLowerCase() === categoryFilter);
        }

        // Apply availability filter
        if (availabilityFilter !== "all") {
            items = items.filter(item =>
                availabilityFilter === "available" ? item.available : !item.available
            );
        }

        return items;
    }, [products, searchQuery, categoryFilter, availabilityFilter]);

    const handleView = (item) => setSelectedEquipment(item);
    const handleEdit = (id) => navigate(`/vendor/lighting/dashboard/products/${id}/edit`);
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Equipment Inventory</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your lighting and sound equipment stock and availability.</p>
                </div>
                <button
                    onClick={() => navigate('/vendor/lighting/dashboard/products/create')}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg hover:bg-sky-700 transition-all text-sm"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add New Equipment</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-gray-800 font-medium text-sm"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-gray-800 font-medium text-sm min-w-[180px]"
                >
                    {EQUIPMENT_CATEGORIES.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Availability Filter */}
                <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-gray-800 font-medium text-sm min-w-[200px]"
                >
                    {AVAILABILITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Equipment Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FiLoader className="w-10 h-10 text-sky-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-bold">Loading Equipment...</p>
                </div>
            ) : equipmentItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {equipmentItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            {/* Image */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm shadow-sm bg-sky-500/90 text-white">
                                        {item.category}
                                    </span>
                                </div>
                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm shadow-sm ${item.status === 'approved' ? 'bg-emerald-500/90 text-white' :
                                        item.status === 'rejected' ? 'bg-rose-500/90 text-white' :
                                            'bg-amber-500/90 text-white'
                                        }`}>
                                        {item.status || 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 mb-3" title={item.name}>
                                    {item.name}
                                </h3>

                                {/* Quantity & Availability */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 font-medium">Quantity</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-900 text-sm">{item.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                        <span className={`text-xs font-medium ${item.available ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            {item.available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleView(item)}
                                        className="flex-1 py-2.5 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-colors"
                                    >
                                        <FiEye className="w-4 h-4" /> View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item.id)}
                                        className="flex-1 py-2.5 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-colors"
                                    >
                                        <FiEdit2 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="py-2.5 px-3 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-500 font-bold">No equipment found.</p>
                    <button
                        onClick={() => navigate('/vendor/lighting/dashboard/products/create')}
                        className="mt-4 text-sky-600 font-bold text-sm hover:underline"
                    >
                        Add your first equipment
                    </button>
                </div>
            )}

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-4 py-6">
                {totalCount > 10 && (
                    <Pagination
                        count={totalCount}
                        pageSize={10}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )}
                <p className="text-xs text-gray-400 font-medium">Showing {equipmentItems.length} of {totalCount} items</p>
            </div>

            {/* Equipment View Modal */}
            {selectedEquipment && (
                <EquipmentViewModal equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
            )}
        </div>
    );
}

// Helper function for default images by category
function getDefaultImage(category) {
    const images = {
        Lighting: "https://images.unsplash.com/photo-1504501650880-1f0b47495e2a?auto=format&fit=crop&q=80&w=400",
        Sound: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
        Microphones: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400",
        Effects: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=400",
        Panels: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400",
    };
    return images[category] || images.Lighting;
}
