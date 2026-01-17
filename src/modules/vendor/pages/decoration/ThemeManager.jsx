import React, { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiChevronDown, FiFilter, FiTag, FiBox, FiLoader, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useVendorProducts } from "../../hooks/useVendorProducts";
import { useCategories } from "../../../user/hooks/useCategories";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import Pagination from '@/components/ui/Pagination';

// Internal Modal Component for Vendor Product View (Same as Inventory)
const ProductViewModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                {/* Image Section */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${product.conditionColor}`}>
                            {product.condition}
                        </span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2 block">
                                {product.category}
                            </span>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                {product.name}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {product.description || "No description provided."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <span className="block text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1">Item ID</span>
                                <span className="text-gray-900 font-bold font-mono">#{product.id}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <span className="block text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1">Stock</span>
                                <span className="text-gray-900 font-bold">{product.quantity} Units</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <span className="block text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1">Base Price</span>
                                <span className="text-gray-900 font-bold">${product.price || "N/A"}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <span className="block text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1">Status</span>
                                <span className="text-gray-900 font-bold">{product.is_available ? "Active" : "Inactive"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ThemeManager() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { data: productsData, isLoading: productsLoading } = useVendorProducts(currentPage);
    const products = productsData?.results || [];
    const totalCount = productsData?.count || 0;
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const isLoading = productsLoading || categoriesLoading;
    const deleteMutation = useDeleteProduct();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Transform API data to UI format
    const inventoryItems = useMemo(() => {
        if (!products || !categories) return [];

        // Create ID -> Name map
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
        }, {});

        let items = products.map(item => ({
            id: item.id,
            name: item.name,
            // Mock quantity for now as it's not in the product API yet
            quantity: 1,
            status: item.status,
            category: categoryMap[item.category] || "General Decoration",
            // Map status/availability to condition
            condition: item.is_available ? "Excellent" : "Maintainance",
            conditionColor: item.is_available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
            image: item.image || "https://images.unsplash.com/photo-1544457070-4cd773b1d71e?auto=format&fit=crop&q=80&w=400"
        }));

        // Filter Logic
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lowerQuery) ||
                item.category.toLowerCase().includes(lowerQuery) ||
                String(item.id).includes(lowerQuery)
            );
        }

        return items;
    }, [products, categories, searchQuery]);

    const handleView = (item) => {
        const productForModal = {
            ...item,
            quantity: item.quantity || 1,
            condition: item.condition || "Excellent",
            conditionColor: item.conditionColor,
            category: item.category,
            status: item.status
        };
        setSelectedProduct(productForModal);
    };

    const handleEdit = (id) => {
        navigate(`/vendor/decoration/dashboard/products/${id}/edit`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this theme? This action cannot be undone.")) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-10 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Design Vault</h1>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 animate-pulse">
                            Vault Active
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1 font-medium font-sans text-sm">Manage your premium decoration packages and themes.</p>
                </div>
                <button
                    onClick={() => navigate('/vendor/decoration/dashboard/products/create')}
                    className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] shrink-0 text-xs md:text-sm"
                >
                    <FiPlus className="w-5 h-5 shadow-sm" />
                    <span>Create New Design</span>
                </button>
            </div>

            {/* Comprehensive Toolbar */}
            <div className="w-full">
                <div className="relative group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search specific themes, styles, or IDs..."
                        className="w-full pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all text-gray-800 font-bold text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Inventory Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FiLoader className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-bold">Loading Designs...</p>
                </div>
            ) : inventoryItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                                <div className="absolute top-6 right-6">
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl ring-1 ring-white/10 backdrop-blur-xl ${item.status === 'approved' ? 'bg-emerald-500/80 text-white' :
                                        item.status === 'rejected' ? 'bg-red-500/80 text-white' :
                                            'bg-amber-500/80 text-white'
                                        }`}>
                                        {item.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="font-extrabold text-gray-900 leading-tight text-lg mb-1">{item.name}</h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-gray-100/50 mt-auto">
                                    <button
                                        onClick={() => handleView(item)}
                                        className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-black hover:text-white transition-all duration-300 group/btn"
                                        title="View Details"
                                    >
                                        <FiEye className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wide hidden xl:inline">View</span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item.id)}
                                        className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-black hover:text-white transition-all duration-300 group/btn"
                                        title="Edit Item"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wide hidden xl:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 group/btn"
                                        title="Delete Item"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wide hidden xl:inline">Del</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                    <p className="text-gray-500 font-bold">No designs found.</p>
                    <button
                        onClick={() => navigate('/vendor/decoration/dashboard/products/create')}
                        className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-wide hover:underline"
                    >
                        Create your first design
                    </button>
                </div>
            )}

            {/* Footer Pagination */}
            {totalCount > 10 && (
                <div className="flex justify-center py-10 border-t border-gray-100/50 mt-10">
                    <Pagination
                        count={totalCount}
                        pageSize={10}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Product View Modal */}
            {selectedProduct && (
                <ProductViewModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}
