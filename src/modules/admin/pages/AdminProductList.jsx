
import React, { useState } from "react";
import { useAdminProducts } from "../hooks/usePendingProducts";
import { useReviewProduct } from "../hooks/useReviewProduct";
import ReviewCard from "../components/ReviewCard";
import Pagination from '@/components/ui/Pagination';

const AdminProductList = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useAdminProducts(activeTab, page);
    const mutation = useReviewProduct();

    const handleApprove = (id) => {
        if (window.confirm("Approve this product?")) {
            mutation.mutate({ id, action: "approve" });
        }
    };

    const handleReject = (id) => {
        if (window.confirm("Reject this product?")) {
            mutation.mutate({ id, action: "reject" });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Reviews</h1>
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
                Error loading products.
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
            return true; // Keep legacy or non-JSON products
        }
    }) || [];

    const tabs = [
        { id: "pending", label: "Pending", color: "amber" },
        { id: "approved", label: "Approved", color: "green" },
        { id: "rejected", label: "Rejected", color: "red" },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setPage(1); // Reset to first page on tab change
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Reviews</h1>

            <div className="flex gap-4 mb-8 border-b border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === tab.id
                            ? "text-gray-900"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
                            }`}>
                            {tab.id === activeTab ? count : "-"}
                        </span>
                    </button>
                ))}
            </div>

            <p className="text-gray-500 mb-8">
                Viewing {activeTab} products.
            </p>

            <div className="space-y-6">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-400">
                        No {activeTab} products to review. Great job!
                    </div>
                ) : (
                    <>
                        {filteredProducts.map((product) => (
                            <ReviewCard
                                key={product.id}
                                product={product}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                isProcessing={mutation.isPending}
                            />
                        ))}

                        {count > 10 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    count={count}
                                    pageSize={10}
                                    currentPage={page}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminProductList;
