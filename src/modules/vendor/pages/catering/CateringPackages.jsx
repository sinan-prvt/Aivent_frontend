import React, { useState } from 'react';
import { FiPlus, FiCheck, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useVendorProducts } from '../../hooks/useVendorProducts';
import CateringPackageForm from './CateringPackageForm';

export default function CateringPackages() {
    const { data: products, isLoading } = useVendorProducts();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filter Logic: Assuming purely catering packages for now. 
    // Ideally check category ID or specific tag if mixed.
    // Since this is the "Catering Dashboard", we show all products for this vendor.
    const packages = products || [];

    // Helper to extract features from description if we stored them there
    const getFeatures = (desc) => {
        if (!desc) return [];
        const parts = desc.split('Features:');
        if (parts.length > 1) {
            return parts[1].split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-')).map(l => l.replace(/^[•-]\s*/, ''));
        }
        return [];
    };

    const getDescription = (desc) => {
        if (!desc) return '';
        return desc.split('Features:')[0].trim();
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

            {/* Filter / Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" placeholder="Search for a package..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-teal-600 font-bold bg-teal-50 rounded-lg text-sm border border-teal-100">Packages</button>
                    <button className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-50 rounded-lg text-sm transition-colors">Add-ons</button>
                </div>
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
                                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${pkg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {pkg.status || 'Pending'}
                                    </span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{pkg.name}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>

                                    <div className="space-y-2 mb-6 flex-1">
                                        {features.slice(0, 3).map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiCheck className="text-teal-500 shrink-0" /> {feat}
                                            </div>
                                        ))}
                                        {features.length > 3 && (
                                            <div className="text-xs text-gray-400 pl-6">+{features.length - 3} more features</div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                                        <div className="font-bold text-lg text-gray-900">${pkg.price}</div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <CateringPackageForm
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        // Ideally trigger a toast here
                        setIsCreateModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
