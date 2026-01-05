
import React from "react";
import { Link } from "react-router-dom";
import ReviewActions from "./ReviewActions";
import { getMediaUrl } from "@/core/utils/media";
import { format } from "date-fns"; // Assuming date-fns might be available, otherwise native date

const ReviewCard = ({ product, onApprove, onReject, isProcessing }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                {product.image ? (
                    <img
                        src={getMediaUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                )}
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Vendor ID: {product.vendor_id}
                        </p>
                    </div>
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                </div>

                {(() => {
                    try {
                        const meta = JSON.parse(product.description || '{}');
                        const displayDesc = meta.description || (typeof product.description === 'string' && !product.description.startsWith('{') ? product.description : '');
                        const features = meta.features || [];
                        const type = meta.type === 'menu' ? 'Dish' : 'Package';

                        return (
                            <div className="space-y-1">
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {displayDesc || (meta.sections ? "Modular Catering Component" : "No description provided.")}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                        {type}
                                    </span>
                                    {features.slice(0, 2).map((f, i) => (
                                        <span key={i} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px]">
                                            {f}
                                        </span>
                                    ))}
                                    {features.length > 2 && <span className="text-[10px] text-gray-400">+{features.length - 2} more</span>}
                                </div>
                            </div>
                        );
                    } catch (e) {
                        return (
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {product.description || "No description provided."}
                            </p>
                        );
                    }
                })()}

                <div className="text-xs text-gray-400">
                    Submitted: {product.created_at ? new Date(product.created_at).toLocaleDateString() : "Unknown"}
                </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-4 min-w-[140px]">
                <div className="flex items-center gap-2">
                    <Link to={`/admin/products/${product.id}/review`} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                        View Details
                    </Link>
                </div>

                {product.status === 'pending' ? (
                    <ReviewActions
                        onApprove={() => onApprove(product.id)}
                        onReject={() => onReject(product.id)}
                        isProcessing={isProcessing}
                    />
                ) : (
                    <div className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${product.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {product.status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
