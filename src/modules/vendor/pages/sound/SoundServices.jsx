
import React, { useState } from "react";
import { FiMusic, FiPlus, FiLoader, FiSearch, FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { useVendorProducts } from "../../hooks/useVendorProducts";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import AddServiceModal from "./components/AddServiceModal";
import ServiceDetailsModal from "./components/ServiceDetailsModal";
import Pagination from '@/components/ui/Pagination';
import { getMediaUrl } from "@/core/utils/media";
import { useNavigate } from "react-router-dom";

export default function SoundServices() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: servicesData, isLoading } = useVendorProducts(currentPage);
    const services = servicesData?.results || [];
    const totalCount = servicesData?.count || 0;
    const deleteMutation = useDeleteProduct();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewService, setViewService] = useState(null);

    const filteredServices = services?.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    const handleEdit = (id) => {
        navigate(`../products/${id}/edit`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            deleteMutation.mutate(id);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <FiCheckCircle className="text-green-500" />;
            case 'pending': return <FiClock className="text-amber-500" />;
            case 'rejected': return <FiAlertCircle className="text-red-500" />;
            default: return <FiClock className="text-gray-300" />;
        }
    };

    if (isLoading) return <div className="p-12 flex justify-center text-indigo-600"><FiLoader className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Services & Packages</h1>
                    <p className="text-gray-500 mt-1">Manage the packages you offer to clients (e.g., Live Band, DJ Set).</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                    <FiPlus className="w-5 h-5" /> Add Service
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                    <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group flex flex-col">
                        <div className="aspect-video bg-gray-100 relative overflow-hidden group/image">
                            {service.image ? (
                                <img
                                    src={getMediaUrl(service.image)}
                                    alt={service.name}
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                    <FiMusic className="w-10 h-10" />
                                </div>
                            )}

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition duration-300 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setViewService(service)}
                                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition transform hover:scale-110 shadow-lg"
                                    title="View Details"
                                >
                                    <FiEye size={20} />
                                </button>
                                <button
                                    onClick={() => handleEdit(service.id)}
                                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition transform hover:scale-110 shadow-lg"
                                    title="Edit"
                                >
                                    <FiEdit2 size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition transform hover:scale-110 shadow-lg"
                                    title="Delete"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            </div>

                            <div className="absolute top-3 left-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-md
                                    ${service.status === 'approved' ? 'bg-green-100/90 text-green-700' :
                                        service.status === 'rejected' ? 'bg-red-100/90 text-red-700' :
                                            'bg-amber-100/90 text-amber-700'}`}>
                                    {getStatusIcon(service.status)}
                                    <span className="capitalize">{service.status || 'pending'}</span>
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">{service.name}</h3>
                                <span className="text-lg font-bold text-green-600 highlight">₹{parseFloat(service.price).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-4">{service.description || "No description provided."}</p>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-mono">ID: {service.id}</span>
                                <button
                                    onClick={() => setViewService(service)}
                                    className="text-indigo-600 text-sm font-bold hover:underline"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredServices.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-indigo-200">
                            <FiMusic className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No services found</h3>
                        <p className="text-gray-500 mb-6">Create your first package to start selling.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Create New Service
                        </button>
                    </div>
                )}
            </div>

            <AddServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <ServiceDetailsModal isOpen={!!viewService} onClose={() => setViewService(null)} service={viewService} />

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
