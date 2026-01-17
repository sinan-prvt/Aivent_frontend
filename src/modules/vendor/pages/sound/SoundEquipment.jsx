
import React, { useState, useMemo } from "react";
import { FiSpeaker, FiMusic, FiMic, FiPlus, FiCheckSquare, FiLoader, FiBox, FiSearch, FiImage, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { useVendorProducts } from "../../hooks/useVendorProducts";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import AddEquipmentModal from "./components/AddEquipmentModal";
import Pagination from '@/components/ui/Pagination';
import { getMediaUrl } from "@/core/utils/media";
import { useNavigate, useParams } from "react-router-dom";

const TYPE_ICONS = {
    "Sound Systems": FiSpeaker,
    "DJ Consoles & Mixers": FiMusic,
    "Microphones": FiMic,
    "Lighting Effects": FiPlus,
    "Cables & Accessories": FiPlus
};

export default function SoundEquipment() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: productsData, isLoading } = useVendorProducts(currentPage);
    const products = productsData?.results || [];
    const totalCount = productsData?.count || 0;
    const deleteMutation = useDeleteProduct();
    const navigate = useNavigate();
    const { category } = useParams(); // Should be 'sound'

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Helper to extract type from description or default
    const getProductType = (desc) => {
        const match = desc?.match(/\[Type: (.*?)\]/);
        return match ? match[1] : "Uncategorized";
    };

    const categories = useMemo(() => {
        if (!products) return [];

        const groups = {};

        // Filter by search
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        filtered.forEach(p => {
            const type = getProductType(p.description);
            if (!groups[type]) {
                groups[type] = {
                    id: type,
                    name: type,
                    items: []
                };
            }
            groups[type].items.push(p);
        });

        return Object.values(groups);
    }, [products, searchQuery]);

    const handleEdit = (productId) => {
        // Navigate to the edit page. 
        // Route is parent relative: /vendor/:category/dashboard/products/:id/edit
        navigate(`../products/${productId}/edit`);
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
            deleteMutation.mutate(productId);
        }
    };

    if (isLoading) return <div className="p-12 flex justify-center text-indigo-600"><FiLoader className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Equipment Inventory</h1>
                    <p className="text-gray-500 text-sm">Manage your internal gear list.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                    <FiPlus className="w-5 h-5" /> Add Equipment
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search equipment..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Empty State */}
            {categories.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <FiBox className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No equipment found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">Start building your inventory by adding your best sound systems and gear.</p>
                </div>
            )}

            {/* Dynamic Categories */}
            {categories.map(cat => (
                <div key={cat.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            {React.createElement(TYPE_ICONS[cat.name] || FiBox, { className: "w-5 h-5" })}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{cat.name}</h2>
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold">{cat.items.length}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cat.items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition group">
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={getMediaUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FiImage className="w-8 h-8" />
                                        </div>
                                    )}

                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                                            Qty: {item.stock}
                                        </div>
                                    </div>

                                    {/* Quick Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="p-2 bg-white rounded-full text-gray-900 hover:text-indigo-600 transition shadow-lg" title="Edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-white rounded-full text-gray-900 hover:text-red-600 transition shadow-lg" title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{item.description?.replace(/\[Type:.*?\]/, '').trim() || "No description"}</p>

                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="text-xs font-medium text-gray-600">{item.is_available ? 'Available' : 'Unavailable'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <AddEquipmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {totalCount > 10 && (
                <div className="flex justify-center py-8">
                    <Pagination
                        count={totalCount}
                        pageSize={10}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};
