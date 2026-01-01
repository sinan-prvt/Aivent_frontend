
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useVendorProductDetail } from "../hooks/useVendorProductDetail";

const VendorEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useVendorProductDetail(id);
    const mutation = useUpdateProduct();

    const handleSubmit = (formData) => {
        mutation.mutate(
            { id, data: formData },
            {
                onSuccess: () => {
                    navigate("/vendor/products");
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                Loading product details...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                Product not found or error loading details.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-500">Update product information.</p>
            </div>

            <ProductForm
                initialData={product}
                onSubmit={handleSubmit}
                isSubmitting={mutation.isPending}
            />
        </div>
    );
};

export default VendorEditProduct;
