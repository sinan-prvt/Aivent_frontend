
import React from "react";
import { Link } from "react-router-dom";
import { useVendorProducts } from "../hooks/useVendorProducts";
import { deleteProduct } from "../api/catalog.api"; // Import direct API for delete or use mutation if preferred
import { useMutation, useQueryClient } from "@tanstack/react-query";
import VendorProductTable from "../components/VendorProductTable";
import { FiPlus } from "react-icons/fi";

const VendorProducts = () => {
    const { data: products, isLoading } = useVendorProducts();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
            // Suggestion: Add toast notification here
        },
    });

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                    <p className="text-gray-500">Manage your product catalog</p>
                </div>
                <Link
                    to="/vendor/products/create"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                    Add Product
                </Link>
            </div>

            <VendorProductTable
                products={products}
                isLoading={isLoading}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default VendorProducts;
