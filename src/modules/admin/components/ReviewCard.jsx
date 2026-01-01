
import React from "react";
import { Link } from "react-router-dom";
import ReviewActions from "./ReviewActions";
import { format } from "date-fns"; // Assuming date-fns might be available, otherwise native date

const ReviewCard = ({ product, onApprove, onReject, isProcessing }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                {product.image ? (
                    <img
                        src={product.image}
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
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description || "No description provided."}
                </p>

                <div className="text-xs text-gray-400">
                    Submitted: {product.created_at ? new Date(product.created_at).toLocaleDateString() : "Unknown"}
                </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-4 min-w-[140px]">
                <div className="flex items-center gap-2">
                    <Link to={`/admin/products/${product.id}/review`} className="text-sm text-primary hover:underline">
                        View Details
                    </Link>
                </div>
                <ReviewActions
                    onApprove={() => onApprove(product.id)}
                    onReject={() => onReject(product.id)}
                    isProcessing={isProcessing}
                />
            </div>
        </div>
    );
};

export default ReviewCard;
