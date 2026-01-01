
import React from "react";
import { usePendingProducts } from "../hooks/usePendingProducts";
import { useReviewProduct } from "../hooks/useReviewProduct";
import ReviewCard from "../components/ReviewCard";

const AdminProductList = () => {
    const { data: products, isLoading, error } = usePendingProducts();
    const mutation = useReviewProduct();

    const handleApprove = (id) => {
        if (window.confirm("Approve this product?")) {
            mutation.mutate({ id, action: "approve" });
        }
    };

    const handleReject = (id) => {
        // In a real app we might ask for a reason
        if (window.confirm("Reject this product?")) {
            mutation.mutate({ id, action: "reject" });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Reviews</h1>
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-40 bg-gray-100 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                Error loading pending products.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Reviews</h1>
            <p className="text-gray-500 mb-8">
                There are {products?.length || 0} products waiting for your review.
            </p>

            <div className="space-y-6">
                {products?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-400">
                        No pending products to review. Great job!
                    </div>
                ) : (
                    products?.map((product) => (
                        <ReviewCard
                            key={product.id}
                            product={product}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            isProcessing={mutation.isPending}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminProductList;
