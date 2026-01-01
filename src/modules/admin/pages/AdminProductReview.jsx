
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../../user/api/catalog.api"; // Re-use public detail API as it returns all fields
// OR use a specific admin detail API if public one filters out pending.
// Public `ProductDetailView` returns `Product.objects.all()` so it should work for pending products too?
// Let's verify Step 122: `ProductDetailView` -> `queryset = Product.objects.all()`. 
// But `ProductDetailView` might NOT filter by status? 
// Step 36 (public views file content) says:
// class ProductDetailView(RetrieveAPIView):
//     permission_classes = [AllowAny]
//     queryset = Product.objects.all()
// So yes, it returns all products regardless of status. Safe to use for admin details.

import { useReviewProduct } from "../hooks/useReviewProduct";
import ReviewActions from "../components/ReviewActions";

const AdminProductReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mutation = useReviewProduct();

    // We can fetch the product details using the public API or create a specific one.
    // Using public API for simplicity as confirmed it retrieves all.
    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductDetail(id),
    });

    const handleApprove = () => {
        if (window.confirm("Approve this product?")) {
            mutation.mutate({ id, action: "approve" }, {
                onSuccess: () => navigate("/admin/products"),
            });
        }
    };

    const handleReject = () => {
        if (window.confirm("Reject this product?")) {
            mutation.mutate({ id, action: "reject" }, {
                onSuccess: () => navigate("/admin/products"),
            });
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error || !product) return <div className="p-8 text-center text-red-500">Error loading product.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button onClick={() => navigate("/admin/products")} className="mb-6 text-gray-500 hover:text-gray-900">
                &larr; Back to List
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="max-h-96 object-contain" />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
                                {product.status}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <p className="text-gray-500 mt-1">Vendor ID: {product.vendor_id}</p>
                        </div>

                        <div className="text-2xl font-bold text-gray-900">
                            ${product.price}
                        </div>

                        <div className="prose prose-sm text-gray-600">
                            <h3 className="text-gray-900 font-semibold mb-1">Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review Actions</label>
                            <ReviewActions
                                onApprove={handleApprove}
                                onReject={handleReject}
                                isProcessing={mutation.isPending}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductReview;
