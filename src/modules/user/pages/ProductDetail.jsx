import React, { useState } from "react";
import ChatModal from "../components/ChatModal";
import { useParams, useNavigate } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import {
    FiMapPin,
    FiStar,
    FiMessageSquare,
    FiUsers,
    FiLayout,
    FiCheckCircle,
    FiMaximize,
    FiUser
} from "react-icons/fi";
import { getMediaUrl } from "@/core/utils/media";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProductDetail(id);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [linkedMenus, setLinkedMenus] = useState([]);
    const [vendorDetail, setVendorDetail] = useState(null);

    // Parse metadata from description
    const meta = React.useMemo(() => {
        try {
            return JSON.parse(product?.description || '{}');
        } catch (e) {
            return { description: product?.description };
        }
    }, [product?.description]);

    // Effect to fetch linked menus if it's a catering package
    React.useEffect(() => {
        if (meta?.type === 'package') {
            const fetchMenus = async () => {
                const ids = [];
                if (meta.menuSelections) {
                    Object.values(meta.menuSelections).forEach(selection => {
                        if (selection) {
                            if (Array.isArray(selection)) {
                                selection.forEach(id => { if (id) ids.push(id); });
                            } else {
                                ids.push(selection);
                            }
                        }
                    });
                } else if (meta.linkedMenuId) {
                    ids.push(meta.linkedMenuId);
                }

                if (ids.length > 0) {
                    const api = await import('../api/catalog.api');
                    const menus = await Promise.all(ids.map(id => api.getProductDetail(id).catch(() => null)));
                    setLinkedMenus(menus.filter(m => m !== null));
                }
            };
            fetchMenus();
        }
    }, [meta?.menuSelections, meta?.linkedMenuId, meta?.type]);

    // Effect to fetch vendor details
    React.useEffect(() => {
        if (product?.vendor_id) {
            import('../api/vendor.api').then(api => {
                api.getPublicVendorDetail(product.vendor_id).then(vendor => {
                    setVendorDetail(vendor);
                }).catch(err => console.error("Failed to fetch vendor", err));
            });
        }
    }, [product?.vendor_id]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse max-w-6xl">
                <div className="h-96 bg-gray-200 rounded-3xl mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-10 bg-gray-200 w-1/2 rounded-full"></div>
                        <div className="h-4 bg-gray-200 w-1/3 rounded-full"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error || !product) return <div className="p-20 text-center font-bold">Product not found</div>;

    const services = [
        "In-house Catering",
        "Audio/Visual Equipment",
        "Event Staff & Security",
        "Bridal Suite",
        "Valet Parking",
        "Custom Lighting"
    ];

    const reviews = [
        { user: "Emily Carter", date: "2 weeks ago", rating: 5, text: "Absolutely breathtaking! The staff was incredible and made our wedding day perfect." },
        { user: "John Davis", date: "1 month ago", rating: 4, text: "A fantastic venue for our corporate event. Very professional and the space is stunning." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Custom Header for Detail View */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-indigo-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">A</span>
                        Aivent
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        ← Back to Planner
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <FiUser />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-lg h-[400px] md:h-[500px] relative group">
                        <img
                            src={getMediaUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Thumbnails Overlay */}
                        <div className="absolute bottom-6 right-6 flex gap-3">
                            <div className="w-16 h-16 rounded-xl border-2 border-white overflow-hidden shadow-lg">
                                <img src={getMediaUrl(product.image)} className="w-full h-full object-cover" />
                            </div>
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold border border-white/30 cursor-pointer hover:bg-white/30 transition">
                                <span className="flex items-center gap-1 text-sm"><FiMaximize /> All</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Location */}
                        <div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                    <div className="flex items-center text-gray-500 font-medium">
                                        <FiMapPin className="mr-2 text-indigo-600" />
                                        {vendorDetail?.location || "Downtown, Metropolis"}
                                    </div>
                                </div>
                                <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border border-yellow-100">
                                    <FiStar className="fill-current" /> {vendorDetail?.rating || "4.9"} ({vendorDetail?.reviews_count || "124"} reviews)
                                </div>
                            </div>

                            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                                {product.description || "Experience unparalleled elegance at The Grand Ballroom. With its majestic chandeliers, soaring ceilings, and classic architecture, it provides a timeless backdrop for any prestigious event. Perfect for weddings, galas, and corporate functions."}
                            </p>
                        </div>

                        {/* Details Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
                                    <FiCheckCircle /> Details
                                </h3>
                                <ul className="space-y-3 text-gray-600 text-sm">
                                    <li className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <FiUsers size={16} />
                                        </div>
                                        <span>Capacity: up to <strong>350 guests</strong></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <FiLayout size={16} />
                                        </div>
                                        <span>Area: <strong>5,000 sq ft</strong></span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <span className="font-bold text-xs">P</span>
                                        </div>
                                        <span>Parking: <strong>Valet service available</strong></span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
                                    <FiCheckCircle /> {meta?.type === 'package' ? 'Package Features' : 'Available Services'}
                                </h3>
                                <div className="space-y-2">
                                    {(meta?.features || services).map((service, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <FiCheckCircle className="text-green-500 shrink-0" /> {service}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Catering Menu Section */}
                        {linkedMenus.length > 0 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">Package Menu Details</h3>
                                    <span className="text-indigo-600 font-bold bg-indigo-50 px-4 py-1 rounded-full text-sm">
                                        Professional Catering
                                    </span>
                                </div>

                                <div className="space-y-10">
                                    {(() => {
                                        const aggregatedSections = {};
                                        linkedMenus.forEach(menu => {
                                            try {
                                                const sections = JSON.parse(menu.description).sections;
                                                Object.entries(sections).forEach(([title, items]) => {
                                                    if (items.length > 0) {
                                                        aggregatedSections[title] = [...(aggregatedSections[title] || []), ...items];
                                                    }
                                                });
                                            } catch (e) { }
                                        });

                                        return Object.entries(aggregatedSections).map(([title, items]) => (
                                            <div key={title} className="space-y-4">
                                                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                                    {title === 'main' ? 'Main Course' : title}
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                                                            {item.image && (
                                                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                                    <img src={getMediaUrl(item.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <h5 className="font-bold text-gray-900">{item.name}</h5>
                                                                    {item.price && <span className="text-sm font-bold text-indigo-600">₹{item.price}</span>}
                                                                </div>
                                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                User Reviews <span className="text-gray-400 text-sm font-normal">(12 reviews)</span>
                            </h3>
                            <div className="space-y-8">
                                {reviews.map((r, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-sm text-gray-900">{r.user}</h4>
                                                <span className="text-xs text-gray-400">• {r.date}</span>
                                            </div>
                                            <div className="flex text-yellow-400 text-xs mb-2">
                                                {[...Array(5)].map((_, stars) => (
                                                    <FiStar key={stars} className={stars < r.rating ? "fill-current" : "text-gray-300"} />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                "{r.text}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <button className="text-indigo-600 font-semibold text-sm hover:underline">
                                    Show all 124 reviews
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        {/* Pricing Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                            <h4 className="font-bold text-gray-900">Pricing</h4>
                            <div className="mt-2 mb-6">
                                <span className="text-4xl font-bold text-indigo-600">₹{parseFloat(product.price).toLocaleString()}</span>
                                <span className="text-gray-500 text-sm"> / {meta?.type === 'package' ? 'person' : 'event package'}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-6">
                                Includes standard setup, 6-hour rental, and basic staff. Custom packages available.
                            </p>

                            <div className="space-y-3">
                                <button
                                    className="w-full py-3.5 bg-indigo-500 text-white rounded-xl font-bold shadow-md hover:bg-indigo-600 transition-transform active:scale-95"
                                    onClick={() => alert("Venue selected!")}
                                >
                                    Select Venue
                                </button>
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiMessageSquare /> Chat with Vendor
                                </button>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4">Location</h4>
                            <div className="bg-gray-100 h-40 rounded-xl mb-4 overflow-hidden relative">
                                {/* Mock Map */}
                                <img
                                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=400"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white p-2 rounded-full shadow-lg">
                                        <FiMapPin className="text-red-500 fill-current" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-gray-900">123 Celebration Avenue</p>
                            <p className="text-xs text-gray-500 mb-4">Metropolis, MET 48678</p>
                            <button className="w-full py-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-sm font-bold transition-colors">
                                Get Directions
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                vendorId={product?.vendor_id}
                vendorName={vendorDetail?.business_name || product?.name || "Vendor"}
                vendorImage={getMediaUrl(vendorDetail?.profile_image) || getMediaUrl(product?.image)}
                vendorCategory={product?.category_name || "Service"}
                vendorRating={vendorDetail?.rating || 4.9}
            />
        </div>
    );
};

export default ProductDetail;
