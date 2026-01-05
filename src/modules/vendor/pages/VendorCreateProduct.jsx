
import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useParams } from "react-router-dom";

const VendorCreateProduct = () => {
    const navigate = useNavigate();
    const { category: vendorCategory } = useParams();
    const mutation = useCreateProduct();

    const handleSubmit = (formData) => {
        mutation.mutate(formData, {
            onSuccess: () => {
                navigate("/vendor/products");
            },
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500">Fill in the details to list a new product.</p>
            </div>

            <ProductForm
                onSubmit={handleSubmit}
                isSubmitting={mutation.isPending}
                vendorCategory={vendorCategory}
            />
        </div>
    );
};

export default VendorCreateProduct;
