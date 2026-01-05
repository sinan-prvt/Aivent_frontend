
import React from "react";
import { useParams } from "react-router-dom";
import { useCategoryProducts } from "../hooks/useCategoryProducts";
import ProductGrid from "../components/ProductGrid";

const CategoryProducts = () => {
    const { slug } = useParams();
    const { data: products, isLoading, error } = useCategoryProducts(slug);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center text-red-500">
                Error loading products. Please try again.
            </div>
        );
    }

    const filteredProducts = products?.filter(p => {
        try {
            const meta = JSON.parse(p.description);
            // In Catering, we only want to show packages publicly.
            // If it's a menu/dish, hide it from the grid.
            return meta.type !== 'menu';
        } catch (e) {
            return true;
        }
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                    {slug?.replace(/-/g, " ")}
                </h1>
                <p className="text-gray-500 mt-2">
                    Explore items in this category
                </p>
            </div>

            <ProductGrid products={filteredProducts} isLoading={isLoading} />
        </div>
    );
};

export default CategoryProducts;
