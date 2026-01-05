
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../../user/api/catalog.api";
import { getPublicVendorDetail } from "../../user/api/vendor.api";
import { getMediaUrl } from "@/core/utils/media";
import { useReviewProduct } from "../hooks/useReviewProduct";
import ReviewActions from "../components/ReviewActions";

const AdminProductReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mutation = useReviewProduct();
    const [vendor, setVendor] = React.useState(null);
    const [linkedItems, setLinkedItems] = React.useState({});

    // We can fetch the product details using the public API or create a specific one.
    // Using public API for simplicity as confirmed it retrieves all.
    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductDetail(id),
    });

    const meta = React.useMemo(() => {
        try {
            return JSON.parse(product?.description || '{}');
        } catch (e) {
            return { description: product?.description };
        }
    }, [product?.description]);

    // Fetch Vendor Detail
    React.useEffect(() => {
        if (product?.vendor_id) {
            getPublicVendorDetail(product.vendor_id)
                .then(setVendor)
                .catch(err => console.error("Failed to fetch vendor", err));
        }
    }, [product?.vendor_id]);

    // Fetch Linked Items Detail
    React.useEffect(() => {
        if (meta?.type === 'package' && meta.menuSelections) {
            const fetchLinked = async () => {
                const results = {};
                for (const [course, ids] of Object.entries(meta.menuSelections)) {
                    if (Array.isArray(ids) && ids.length > 0) {
                        const items = await Promise.all(
                            ids.map(id => getProductDetail(id).catch(() => null))
                        );
                        results[course] = items.filter(item => {
                            if (!item) return false;
                            try {
                                const itemMeta = JSON.parse(item.description);
                                return itemMeta.type !== 'package';
                            } catch (e) {
                                return true;
                            }
                        });
                    }
                }
                setLinkedItems(results);
            };
            fetchLinked();
        }
    }, [meta]);

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
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <button onClick={() => navigate("/admin/products")} className="mb-6 text-gray-500 hover:text-gray-900 flex items-center gap-2">
                &larr; Back to List
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Left Column - Image & Vendor */}
                    <div className="lg:col-span-1 border-r border-gray-100 flex flex-col">
                        <div className="bg-gray-50 p-6 flex items-center justify-center border-b border-gray-100">
                            {product.image ? (
                                <img src={getMediaUrl(product.image)} alt={product.name} className="max-h-64 object-contain rounded-lg shadow-sm" />
                            ) : (
                                <div className="h-48 w-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>

                        <div className="p-6 space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor Information</h3>
                            {vendor ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {vendor.business_name?.[0]?.toUpperCase() || "V"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{vendor.business_name}</p>
                                            <p className="text-xs text-gray-500">{vendor.contact_person}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="text-gray-400" />
                                            <span>{vendor.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiPhone className="text-gray-400" />
                                            <span>{vendor.phone}</span>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600 font-medium">ID: {product.vendor_id}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Loading vendor details...</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 p-8 space-y-6">
                        <div>
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full mb-2 uppercase tracking-wide">
                                {product.status}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        </div>

                        <div className="text-2xl font-bold text-gray-900">
                            ₹{product.price}
                        </div>

                        <div className="prose prose-sm text-gray-600 max-w-none">
                            <h3 className="text-gray-900 font-bold mb-3">Product Details</h3>
                            {(() => {
                                try {
                                    const meta = JSON.parse(product.description || '{}');
                                    const displayDesc = meta.description || (typeof product.description === 'string' && !product.description.startsWith('{') ? product.description : '');
                                    const features = meta.features || [];
                                    const sections = meta.sections || {};
                                    const isMenu = meta.type === 'menu';

                                    return (
                                        <div className="space-y-6">
                                            {displayDesc && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                                                    <p className="text-gray-700 leading-relaxed">{displayDesc}</p>
                                                </div>
                                            )}

                                            {features.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Features</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {features.map((f, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                                                <span className="text-sm font-medium text-gray-700">{f}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {isMenu && meta.menuType && (
                                                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-center justify-between">
                                                    <span className="text-sm font-bold text-amber-800">Course Type:</span>
                                                    <span className="bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                        {meta.menuType}
                                                    </span>
                                                </div>
                                            )}

                                            {meta.menuSelections && (
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Package Contents</h4>
                                                    {Object.entries(linkedItems).map(([course, items]) => (
                                                        items.length > 0 && (
                                                            <div key={course} className="space-y-2">
                                                                <h5 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{course}</h5>
                                                                <div className="grid grid-cols-1 gap-2">
                                                                    {items.map((item, idx) => (
                                                                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100 rounded-lg">
                                                                            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                                                                                {item.image ? (
                                                                                    <img src={getMediaUrl(item.image)} className="w-full h-full object-cover" alt={item.name} />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">No IMG</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                                                                <p className="text-[10px] text-gray-500">₹{item.price}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                    ))}
                                                    {Object.keys(linkedItems).length === 0 && (
                                                        <div className="p-4 border-2 border-dashed border-gray-100 rounded-lg text-center">
                                                            <p className="text-xs text-gray-400">No items linked or loading...</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                } catch (e) {
                                    return <p className="text-gray-700 leading-relaxed">{product.description || "No description provided."}</p>;
                                }
                            })()}
                        </div>

                        {product.status === 'pending' ? (
                            <div className="pt-6 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review Actions</label>
                                <ReviewActions
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    isProcessing={mutation.isPending}
                                />
                            </div>
                        ) : (
                            <div className="pt-6 border-t border-gray-100">
                                <div className={`p-4 rounded-xl flex items-center justify-between ${product.status === 'approved' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                                    }`}>
                                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Product Status</span>
                                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${product.status === 'approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                        }`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductReview;
