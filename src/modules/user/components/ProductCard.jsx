import React from "react";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/core/utils/media";

const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col"
        >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {product.image ? (
                    <img
                        src={getMediaUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary truncate">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900">
                        ${product.price}
                    </span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                        Available
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
