
import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-100 rounded-lg h-80 animate-pulse"
                    ></div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No products found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
