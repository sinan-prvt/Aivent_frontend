
import React from "react";
import { Link } from "react-router-dom";
import ProductStatusBadge from "./ProductStatusBadge";
import { getMediaUrl } from "@/core/utils/media";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi"; // Assuming react-icons is installed

const VendorProductTable = ({ products, isLoading, onDelete }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products?.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        {product.image ? (
                                            <img
                                                className="h-10 w-10 rounded object-cover"
                                                src={getMediaUrl(product.image)}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {/* Category name if available in serializer, otherwise ID */}
                                            ID: {product.id}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${product.price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_available
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {product.is_available ? "In Stock" : "Unavailable"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ProductStatusBadge status={product.status} />
                                {product.status === "rejected" && product.rejection_reason && (
                                    <div className="text-xs text-red-500 mt-1 max-w-[150px] truncate" title={product.rejection_reason}>
                                        Reason: {product.rejection_reason}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        to={`/vendor/products/${product.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Edit"
                                    >
                                        <FiEdit2 />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!products || products.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    No products found. Start by adding one!
                </div>
            )}
        </div>
    );
};

export default VendorProductTable;
