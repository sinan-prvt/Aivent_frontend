import React, { useState } from 'react';
import { FiPlus, FiCheck, FiEdit2, FiTrash2, FiSearch, FiEye, FiX, FiCheckCircle } from 'react-icons/fi';
import { useVendorProducts } from '../../hooks/useVendorProducts';
import { useDeleteProduct } from '../../hooks/useDeleteProduct';
import CateringPackageForm from './CateringPackageForm';
import { getMediaUrl } from '@/core/utils/media';
import Pagination from '@/components/ui/Pagination';

export default function CateringPackages() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: productsData, isLoading } = useVendorProducts(currentPage);
    const products = productsData?.results || [];
    const totalCount = productsData?.count || 0;
    const deleteMutation = useDeleteProduct();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [viewingPackage, setViewingPackage] = useState(null);

    // Filter Logic: Show only catering packages
    const packages = products?.filter(p => {
        try {
            const meta = JSON.parse(p.description);
            return meta.type === 'package';
        } catch (e) {
            // Fallback: If it's not JSON, it's likely an old package description
            return !p.description.startsWith('{');
        }
    }) || [];

    const getFeatures = (desc) => {
        if (!desc) return [];
        try {
            const meta = JSON.parse(desc);
            if (meta.features) return meta.features;
        } catch (e) { }

        const parts = desc.split('Features:');
        if (parts.length > 1) {
            return parts[1].split('\n')
                .filter(l => l.trim().startsWith('•') || l.trim().startsWith('-'))
                .map(l => l.replace(/^[•-]\s*/, ''));
        }
        return [];
    };

    const getDescription = (desc) => {
        if (!desc) return '';
        try {
            const meta = JSON.parse(desc);
            if (meta.description) return meta.description;
            if (meta.type === 'package' || meta.type === 'menu') return '';
        } catch (e) { }

        return desc.split('Features:')[0].trim();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading packages...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>Dashboard</span> / <span className="text-gray-900 font-medium">Packages</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Catering Packages</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your service packages and add-ons for clients.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                    <FiPlus /> Create New Package
                </button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No packages found.</p>
                        <button onClick={() => setIsCreateModalOpen(true)} className="mt-2 text-teal-600 font-bold hover:underline">Create your first package</button>
                    </div>
                ) : (
                    packages.map((pkg) => {
                        const description = getDescription(pkg.description);
                        const features = getFeatures(pkg.description);

                        return (
                            <div key={pkg.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                                <div className="h-48 relative overflow-hidden bg-gray-100">
                                    {pkg.image ? (
                                        <img src={getMediaUrl(pkg.image)} alt={pkg.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${pkg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {pkg.status || 'Pending'}
                                    </span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{pkg.name}</h3>
                                            {(() => {
                                                try {
                                                    const meta = JSON.parse(pkg.description);
                                                    const menu = products?.find(p => p.id === parseInt(meta.linkedMenuId));
                                                    if (menu) return <p className="text-xs text-indigo-600 font-medium mt-1">Menu: {menu.name}</p>;
                                                } catch (e) { }
                                                return null;
                                            })()}
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                            <span className="text-2xl font-bold text-teal-600">₹{pkg.price}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setViewingPackage(pkg)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingPackage(pkg)}
                                                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pkg.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

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

            {(isCreateModalOpen || editingPackage) && (
                <CateringPackageForm
                    initialData={editingPackage}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingPackage(null);
                    }}
                    onSuccess={() => {
                        setIsCreateModalOpen(false);
                        setEditingPackage(null);
                    }}
                />
            )}

            {/* View Modal */}
            {viewingPackage && (
                <PackageDetailModal
                    pkg={viewingPackage}
                    allProducts={products}
                    onClose={() => setViewingPackage(null)}
                    onEdit={(p) => {
                        setViewingPackage(null);
                        setEditingPackage(p);
                    }}
                />
            )}
        </div>
    );
}

function PackageDetailModal({ pkg, allProducts, onClose, onEdit }) {
    const [vendor, setVendor] = useState(null);

    // Safety parse
    let meta = {};
    try {
        meta = JSON.parse(pkg.description || '{}');
    } catch (e) {
        meta = { description: pkg.description };
    }

    // Aggregate sections from ALL selections
    let menuSections = {};
    if (meta.menuSelections) {
        Object.values(meta.menuSelections).forEach(selection => {
            if (!selection) return;
            // Handle both single IDs (legacy) and arrays of IDs (new)
            const ids = Array.isArray(selection) ? selection : [selection];

            ids.forEach(menuId => {
                const menuProduct = allProducts?.find(p => p.id === parseInt(menuId));
                if (menuProduct) {
                    try {
                        const sectionsData = JSON.parse(menuProduct.description).sections;
                        // Merge sections
                        Object.entries(sectionsData).forEach(([course, items]) => {
                            if (items.length > 0) {
                                menuSections[course] = [...(menuSections[course] || []), ...items];
                            }
                        });
                    } catch (e) { }
                }
            });
        });
    } else if (meta.linkedMenuId) {
        // Legacy support
        const linkedMenu = allProducts?.find(p => p.id === parseInt(meta.linkedMenuId));
        if (linkedMenu) {
            try {
                menuSections = JSON.parse(linkedMenu.description).sections;
            } catch (e) { }
        }
    } else if (meta.sections) {
        // Direct sections support (if any)
        menuSections = meta.sections;
    }

    const isMenu = meta.type === 'menu' || !!meta.sections;
    const isPackage = meta.type === 'package' || !!meta.menuSelections || !!meta.linkedMenuId;
    const displayDescription = meta.description || (typeof pkg.description === 'string' && !pkg.description.startsWith('{') ? pkg.description : '');
    const hasItems = Object.values(menuSections).flat().length > 0;

    React.useEffect(() => {
        if (pkg.vendor_id) {
            import('../../../user/api/vendor.api').then(api => {
                api.getPublicVendorDetail(pkg.vendor_id).then(v => {
                    setVendor(v);
                }).catch(err => console.error(err));
            });
        }
    }, [pkg.vendor_id]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="relative h-64 md:h-80">
                    <img
                        src={getMediaUrl(pkg.image)}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                        <div>
                            <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                                {isMenu ? 'Menu Detail' : 'Catering Package'}
                            </span>
                            <h2 className="text-3xl font-bold text-white">{pkg.name}</h2>
                            <p className="text-gray-200 mt-2">
                                {isMenu ? 'Full Menu Preview' : `₹${pkg.price} per person`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {(displayDescription || isPackage) && (
                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {isMenu ? 'Menu Description' : 'About this package'}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {displayDescription || 'No description provided.'}
                                </p>
                            </section>
                        )}

                        {isPackage && meta.features?.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {meta.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <FiCheckCircle className="text-teal-500 flex-shrink-0" />
                                            <span className="text-sm font-medium">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(hasItems || isMenu) && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {isMenu ? 'Menu Items' : 'Included Menu Items'}
                                    </h3>
                                    <span className="text-sm text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">
                                        {Object.values(menuSections).flat().length} Items
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    {Object.entries(menuSections).map(([course, items]) => (
                                        items.length > 0 && (
                                            <div key={course}>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{course}</h4>
                                                <div className="space-y-3">
                                                    {items.map((item, i) => (
                                                        <div key={i} className="flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 items-start">
                                                            {item.image && (
                                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                                                    <img src={getMediaUrl(item.image)} className="w-full h-full object-cover" alt="" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <h5 className="font-bold text-gray-900">{item.name}</h5>
                                                                    {item.price && <span className="text-sm font-bold text-teal-600">${item.price}</span>}
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4">Vendor Details</h4>
                            <div className="flex items-center gap-3 mb-4">
                                {vendor?.profile_image ? (
                                    <img src={getMediaUrl(vendor.profile_image)} className="w-12 h-12 rounded-full object-cover" alt="" />
                                ) : (
                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold uppercase">
                                        {(vendor?.business_name || 'V').charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-gray-900">{vendor?.business_name || 'Vendor'}</p>
                                    <p className="text-xs text-gray-500">{vendor?.verified ? 'Verified Vendor' : 'Aivent Partner'}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>⭐ {vendor?.rating || '4.9'} ({vendor?.reviews_count || '0'} reviews)</p>
                                <p>📍 {vendor?.location || 'Location not set'}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onEdit(pkg)}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            <FiEdit2 /> Edit this {isMenu ? 'Menu' : 'Package'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
