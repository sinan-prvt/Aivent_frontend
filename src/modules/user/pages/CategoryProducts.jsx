
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCategoryProducts } from "../hooks/useCategoryProducts";
import ProductGrid from "../components/ProductGrid";
import Pagination from '@/components/ui/Pagination';

const CategoryProducts = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useCategoryProducts(slug, page);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center text-red-500">
                Error loading products. Please try again.
            </div>
        );
    }

    const products = data?.results || [];
    const count = data?.count || 0;

    const filteredProducts = products?.filter(p => {
        try {
            const meta = JSON.parse(p.description);
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

            {!isLoading && count > 10 && (
                <div className="mt-12">
                    <Pagination
                        count={count}
                        pageSize={10}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
