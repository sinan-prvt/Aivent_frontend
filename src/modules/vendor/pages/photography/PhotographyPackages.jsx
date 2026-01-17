import React, { useState, useEffect } from "react";
import {
    Users,
    Clock,
    Image as ImageIcon,
    Film,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle,
    FileText,
    X,
    Loader2,
    Eye
} from "lucide-react";
import { fetchPackages, createPackage, deletePackage, uploadPackageImage, updatePackage } from "../../api/photography.api";
import { useAuth } from "@/app/providers/AuthProvider";
import Pagination from '@/components/ui/Pagination';

const MEDIA_BASE_URL = "http://localhost:8003";

// Internal Modal for Viewing Package Details
const ProductViewModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                    <img
                        src={product.image ? (product.image.startsWith("http") ? product.image : `${MEDIA_BASE_URL}${product.image}`) : "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-1 block">Photography Package</span>
                            <h2 className="text-2xl font-black text-gray-900">{product.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-500" /></button>
                    </div>

                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Price</span><p className="font-bold text-gray-900">${product.price}</p></div>
                        <div className="bg-gray-50 p-3 rounded-xl"><span className="text-[10px] text-gray-400 font-bold uppercase">Status</span><p className="font-bold text-gray-900 capitalize">{product.status || 'Pending'}</p></div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase">Included Features</h4>
                        <div className="space-y-2">
                            {product.features && product.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle size={14} className="text-green-500" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={onClose} className="mt-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200">Close</button>
                </div>
            </div>
        </div>
    );
};

export default function PhotographyPackages() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("all");
    const [packages, setPackages] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewProduct, setViewProduct] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        features: "", // Comma joined string for input
        category_id: user?.category_id || 3, // Default to photography (ID 3) if not set
        stock: 1
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadPackages(currentPage);
    }, [currentPage]);

    const loadPackages = async (page = currentPage) => {
        try {
            setLoading(true);
            const res = await fetchPackages(page);
            setPackages(res.data.results || []);
            setTotalCount(res.data.count || 0);
        } catch (error) {
            console.error("Failed to load packages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setIsEditMode(false);
        setFormData({ name: "", description: "", price: "", features: "", category_id: user?.category_id || 3, stock: 1 });
        setImageFile(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (pkg) => {
        setIsEditMode(true);
        setEditId(pkg.id);
        setFormData({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            features: pkg.features ? pkg.features.join(", ") : "",
            category_id: pkg.category,
            stock: pkg.stock
        });
        setImageFile(null); // Reset file input, user can choose to upload new or keep old
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Use FormData for single-request image upload
            const productFormData = new FormData();
            productFormData.append('name', formData.name);
            productFormData.append('description', formData.description);
            productFormData.append('price', formData.price);
            productFormData.append('category', formData.category_id);
            productFormData.append('stock', formData.stock || 1);
            // Features as JSON string
            const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
            productFormData.append('features', JSON.stringify(featuresArray));

            productFormData.append('vendor_id', user.id);

            if (imageFile) {
                productFormData.append('image', imageFile);
            }

            if (isEditMode) {
                await updatePackage(editId, productFormData);
            } else {
                await createPackage(productFormData);
            }

            setIsFormOpen(false);
            loadPackages();
        } catch (error) {
            console.error("Failed to save package", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            try {
                await deletePackage(id);
                loadPackages();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    const filteredPackages = packages.filter(pkg => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return pkg.status === 'approved';
        if (activeTab === 'draft') return pkg.status === 'pending';
        return true;
    });

    return (
        <div className="space-y-8 p-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Packages</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Photography Packages</h1>
                    <p className="text-gray-500 mt-1">Manage your service packages and add-ons for clients.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-purple-200"
                >
                    <Plus size={20} />
                    Create New Package
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search packages by name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'active', 'draft'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Packages Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin" size={40} />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map((pkg) => (
                        <div key={pkg.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <img
                                    src={pkg.image ? (pkg.image.startsWith("http") ? pkg.image : `${MEDIA_BASE_URL}${pkg.image}`) : "https://via.placeholder.com/400x300?text=No+Image"}
                                    alt={pkg.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x300?text=Error";
                                    }}
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${pkg.status === 'approved'
                                        ? 'bg-green-500/10 text-green-700 border border-green-200/50'
                                        : 'bg-yellow-500/10 text-yellow-700 border border-yellow-200/50'
                                        }`}>
                                        {pkg.status === 'approved' ? 'Active' : pkg.status === 'draft' ? 'Draft' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{pkg.name}</h3>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">{pkg.description}</p>

                                <div className="space-y-3 mb-6">
                                    {pkg.features && pkg.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckCircle size={14} className="text-purple-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                    <span className="text-2xl font-bold text-purple-900">${pkg.price}</span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewProduct(pkg)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleOpenEdit(pkg)}
                                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalCount > 10 && (
                <div className="flex justify-center py-10 border-t border-gray-100 mt-10">
                    <Pagination
                        count={totalCount}
                        pageSize={10}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Create/Edit Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Package' : 'Create New Package'}</h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 4 Hours Coverage, 200 Photos"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
                                    value={formData.features}
                                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setImageFile(e.target.files[0])}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                {isEditMode && !imageFile && (
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image.</p>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {submitting && <Loader2 className="animate-spin" size={16} />}
                                    {isEditMode ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />
        </div>
    );
}
