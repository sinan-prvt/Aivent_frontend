import React, { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiLoader, FiEye, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useVendorProducts } from "../../hooks/useVendorProducts";
import { useCategories } from "../../../user/hooks/useCategories";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";

// Internal Modal Component for Vendor Product View
const ProductViewModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1 block">{product.category}</span>
                            <h2 className="text-2xl font-black text-gray-900">{product.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><FiX className="w-5 h-5 text-gray-500" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">ID</span><p className="font-bold text-gray-900">#{product.id}</p></div>
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Stock</span><p className="font-bold text-gray-900">{product.quantity} Units</p></div>
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Status</span><p className="font-bold text-gray-900 capitalize">{product.status || 'Pending'}</p></div>
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Condition</span><p className="font-bold text-gray-900">{product.condition}</p></div>
                    </div>
                    <button onClick={onClose} className="mt-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200">Close</button>
                </div>
            </div>
        </div>
    );
};

export default function DecorInventory() {
    const navigate = useNavigate();
    const { data: products, isLoading: productsLoading } = useVendorProducts();
    const { data: categories, isLoading: categoriesLoading } = useCategories();
    const deleteMutation = useDeleteProduct();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const isLoading = productsLoading || categoriesLoading;

    const inventoryItems = useMemo(() => {
        if (!products || !categories) return [];

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
        }, {});

        let items = products.map(item => ({
            id: item.id,
            name: item.name,
            quantity: 1,
            status: item.status,
            category: categoryMap[item.category] || "Decoration & Styling",
            condition: item.is_available ? "Excellent" : "Maintenance",
            conditionColor: item.is_available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
            image: item.image || "https://images.unsplash.com/photo-1544457070-4cd773b1d71e?auto=format&fit=crop&q=80&w=400"
        }));

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

    const handleView = (item) => setSelectedProduct(item);
    const handleEdit = (id) => navigate(`/vendor/decoration/dashboard/products/${id}/edit`);
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Inventory Manager</h1>
                    <p className="text-gray-500 text-sm mt-1">Track and manage your decoration assets.</p>
                </div>
                <button
                    onClick={() => navigate('/vendor/decoration/dashboard/products/create')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all text-sm"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add New Unit</span>
                </button>
            </div>

            {/* Search Bar Only */}
            <div className="relative">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by prop name, ID, or material..."
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-gray-800 font-medium text-sm"
                />
            </div>

            {/* Grid - 4 columns max */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FiLoader className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-bold">Loading Inventory...</p>
                </div>
            ) : inventoryItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {inventoryItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            {/* Image */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
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
                                <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 mb-1" title={item.name}>
                                    {item.name}
                                </h3>
                                <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-4">
                                    {item.category}
                                </p>

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
                    <p className="text-gray-500 font-bold">No inventory items found.</p>
                    <button
                        onClick={() => navigate('/vendor/decoration/dashboard/products/create')}
                        className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                    >
                        Add your first item
                    </button>
                </div>
            )}

            {/* Footer Info */}
            {inventoryItems.length > 0 && (
                <div className="text-center py-6">
                    <p className="text-xs text-gray-400 font-medium">Showing {inventoryItems.length} items</p>
                </div>
            )}

            {/* Product View Modal */}
            {selectedProduct && (
                <ProductViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </div>
    );
}
