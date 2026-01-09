
import React from 'react';
import { FiX, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { getMediaUrl } from "@/core/utils/media";

export default function ServiceDetailsModal({ isOpen, onClose, service }) {
    if (!isOpen || !service) return null;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold"><FiCheckCircle /> Approved</span>;
            case 'pending':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-bold"><FiClock /> Pending Approval</span>;
            case 'rejected':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold"><FiAlertCircle /> Rejected</span>;
            default:
                return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-bold">{status}</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                {/* Header with Image */}
                <div className="relative h-48 md:h-64 bg-gray-100 shrink-0">
                    {service.image ? (
                        <img
                            src={getMediaUrl(service.image)}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <span className="text-4xl font-bold opacity-20">No Image</span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition"
                    >
                        <FiX size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4">
                        {getStatusBadge(service.status)}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-3xl font-bold text-gray-900">{service.name}</h2>
                        <span className="text-2xl font-bold text-indigo-600">₹{parseFloat(service.price).toLocaleString()}</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.description || "No description provided."}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Category</h4>
                                <p className="font-medium text-gray-900">Sound Services</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Stock / Availability</h4>
                                <p className="font-medium text-gray-900">{service.stock} Units</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Product ID</h4>
                                <p className="font-medium text-gray-400 font-mono text-sm">{service.id}</p>
                            </div>
                        </div>

                        {service.status === 'rejected' && service.rejection_reason && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                <h4 className="text-red-800 font-bold mb-1 flex items-center gap-2">
                                    <FiAlertCircle /> Rejection Reason
                                </h4>
                                <p className="text-red-700 text-sm">{service.rejection_reason}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
