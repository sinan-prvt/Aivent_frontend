import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, Clock, ChevronRight, AlertCircle, XCircle, RefreshCw, CreditCard } from 'lucide-react';
import { getUserOrders, deleteOrderItem } from '../api/orders.api';
import { initiatePayment, verifyPayment, confirmCODPayment } from '../api/payment.api';
import Navbar from '../../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

const OrderDetailsModal = ({ subOrder, onClose }) => {
    if (!subOrder) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Booking Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <XCircle className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 text-xl leading-tight">
                                {subOrder.booking_details?.product_title || "Event Service"}
                            </h4>
                            <p className="text-sm text-indigo-600 font-bold">by {subOrder.vendor_name}</p>
                            <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-[0.2em]">
                                {subOrder.booking_details?.category_name} • ID: {subOrder.id.slice(0, 8)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Event Date</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-rose-500" />
                                <span className="font-bold text-gray-900">
                                    {subOrder.booking_details?.date ? new Date(subOrder.booking_details.date).toLocaleDateString() : "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Amount</span>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-emerald-500" />
                                <span className="font-bold text-gray-900">₹{parseFloat(subOrder.amount).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Event Type</span>
                            <p className="font-bold text-gray-900 mt-1">{subOrder.booking_details?.event_type || "Standard Event"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Guests</span>
                            <p className="font-bold text-gray-900 mt-1">{subOrder.booking_details?.guests || "N/A"}</p>
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border flex gap-4 ${subOrder.booking_status === 'REJECTED' ? 'bg-red-50 border-red-100 text-red-800' :
                        subOrder.booking_status === 'APPROVED' ? 'bg-green-50 border-green-100 text-green-800' :
                            'bg-blue-50 border-blue-100 text-blue-800'
                        }`}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider mb-1">Status: {subOrder.booking_status}</p>
                            <p className="text-xs font-medium opacity-90">
                                {subOrder.booking_status === 'AWAITING_APPROVAL' && "Your request is pending vendor review."}
                                {subOrder.booking_status === 'APPROVED' && "Great! The vendor is available for your event."}
                                {subOrder.booking_status === 'REJECTED' && "This vendor is unavailable. Please swap this service."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubOrder, setSelectedSubOrder] = useState(null);
    const [vendorNames, setVendorNames] = useState({});
    const [paymentMethods, setPaymentMethods] = useState({}); // { orderId: 'ONLINE' | 'COD' }
    const navigate = useNavigate();
    const failedVendors = useRef(new Set());

    const fetchOrders = async () => {
        try {
            const data = await getUserOrders();
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchNames = async () => {
            const vids = new Set();
            orders.forEach(order => {
                order.sub_orders?.forEach(sub => {
                    const vid = String(sub.vendor_id);
                    if ((sub.vendor_name === "Aivent Partner" || !sub.vendor_name) && vid && vid !== "undefined") {
                        vids.add(vid);
                    }
                });
            });

            if (vids.size === 0) return;

            try {
                const api = await import('../api/vendor.api');
                const newNames = { ...vendorNames };
                const promises = Array.from(vids).map(async (vid) => {
                    // Only fetch if missing or placeholder AND hasn't failed before
                    const currentName = vendorNames[vid];
                    const isPlaceholder = !currentName || currentName === "Aivent Partner";

                    if (isPlaceholder && !failedVendors.current.has(vid)) {
                        try {
                            const detail = await api.getPublicVendorDetail(vid);
                            const name = detail.business_name || detail.name;
                            if (name) {
                                newNames[vid] = name;
                            } else {
                                newNames[vid] = "Aivent Partner"; // Default if name is empty
                            }
                        } catch (e) {
                            console.error(`Failed to fetch vendor ${vid}`, e);
                            failedVendors.current.add(vid); // Mark as failed to avoid re-fetch
                            // Optionally, keep existing placeholder or set a specific error placeholder
                            newNames[vid] = newNames[vid] || "Aivent Partner";
                        }
                    }
                });
                await Promise.all(promises);
                setVendorNames({ ...newNames });
            } catch (err) {
                console.error("Error loading vendor names", err);
            }
        };

        if (orders.length > 0) fetchNames();
    }, [orders]);

    const handleRemoveItem = async (orderId, subOrderId) => {
        if (!window.confirm("Remove this service request?")) return;
        try {
            await deleteOrderItem(orderId, subOrderId);
            fetchOrders();
        } catch (error) {
            alert("Failed to remove: " + (error.response?.data?.detail || error.message));
        }
    };

    const handlePayment = async (order) => {
        if (loading) return;
        const method = paymentMethods[order.id] || 'ONLINE';

        if (method === 'COD') {
            try {
                setLoading(true);
                await confirmCODPayment({
                    order_id: order.id,
                    amount: order.total_amount,
                    currency: "INR"
                });
                alert("Order confirmed with Cash On Delivery!");
                fetchOrders();
            } catch (error) {
                alert(error.response?.data?.detail || "COD Confirmation failed");
            } finally {
                setLoading(false);
            }
            return;
        }

        // Online Payment Flow (Razorpay)
        const loadRazorpay = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const res = await loadRazorpay();
        if (!res) { alert('Razorpay SDK failed to load.'); return; }

        try {
            const data = await initiatePayment({
                order_id: order.id,
                amount: order.total_amount,
                currency: "INR"
            });

            const options = {
                key: data.razorpay_key_id,
                amount: Math.round(parseFloat(data.amount) * 100),
                currency: data.currency,
                name: "Aivent",
                description: "Event Booking Payment",
                order_id: data.razorpay_order_id,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        fetchOrders();
                    } catch (error) { alert("Payment Verification Failed"); }
                },
                prefill: { name: "User", email: "user@example.com", contact: "" },
                theme: { color: "#e11d48" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) { alert(error.response?.data?.detail || "Payment failed"); }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'FULLY_APPROVED': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'PARTIALLY_APPROVED': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'AWAITING_APPROVAL': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const isOrderPayable = (order) => {
        if (!order) return false;
        // Only show payment options if status is exactly FULLY_APPROVED and NOT PAID
        return order.status === 'FULLY_APPROVED' && parseFloat(order.total_amount) > 0;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-32">
            <Navbar />

            {selectedSubOrder && (
                <OrderDetailsModal
                    subOrder={selectedSubOrder}
                    onClose={() => setSelectedSubOrder(null)}
                />
            )}

            <main className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                            <Package className="w-10 h-10 text-rose-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Orders</h1>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Manage your service requests & payments</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <div className="w-12 h-12 border-4 border-rose-600/20 border-t-rose-600 rounded-full animate-spin" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading bookings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-red-50 text-red-700 rounded-3xl border border-red-100 flex items-center gap-4">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-3xl border border-gray-200 shadow-sm">
                            <Package className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-gray-900">No orders yet</h3>
                            <p className="text-gray-400 font-bold mt-2">Active requests will appear here once you checkout.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {orders.map((order) => (
                                <motion.div key={order.id} className="bg-white rounded-[32px] p-8 border border-gray-200 shadow-sm overflow-hidden relative group">
                                    <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                                        {/* Left Side: Order Info */}
                                        <div className="lg:w-1/3 space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border shadow-sm ${getStatusColor(order.status)}`}>
                                                        {order.status.replace(/_/g, " ")}
                                                    </span>
                                                    <span className="text-[10px] text-gray-300 font-mono">#{order.id.slice(0, 8)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-5xl font-black text-gray-900 tracking-tighter">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 underline decoration-rose-500/30 decoration-2">Grand Total</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 text-[11px] font-black text-gray-400 uppercase tracking-widest pt-2">
                                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-rose-500" />{new Date(order.created_at).toLocaleDateString()}</div>
                                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" />{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>

                                            {order.status === 'PAID' ? (
                                                <div className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-100">
                                                    <Package className="w-6 h-6" /> BOOKING PAID
                                                </div>
                                            ) : isOrderPayable(order) ? (
                                                <div className="space-y-4">
                                                    <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setPaymentMethods(prev => ({ ...prev, [order.id]: 'ONLINE' })) }}
                                                            disabled={loading}
                                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${(paymentMethods[order.id] || 'ONLINE') === 'ONLINE'
                                                                    ? 'bg-white text-indigo-600 shadow-sm'
                                                                    : 'text-gray-400 hover:text-gray-600'
                                                                }`}
                                                        >
                                                            Online
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setPaymentMethods(prev => ({ ...prev, [order.id]: 'COD' })) }}
                                                            disabled={loading}
                                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${paymentMethods[order.id] === 'COD'
                                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                                    : 'text-gray-400 hover:text-gray-600'
                                                                }`}
                                                        >
                                                            COD
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handlePayment(order) }}
                                                        disabled={loading}
                                                        className={`w-full flex items-center justify-center gap-3 px-8 py-5 text-white rounded-2xl transition-all font-black text-sm tracking-widest uppercase shadow-xl active:scale-[0.98] ${loading ? 'bg-gray-400 cursor-not-allowed shadow-none' :
                                                                paymentMethods[order.id] === 'COD'
                                                                    ? 'bg-indigo-900 shadow-indigo-200 hover:bg-black'
                                                                    : 'bg-rose-600 shadow-rose-200 hover:bg-rose-700'
                                                            }`}
                                                    >
                                                        <CreditCard className="w-6 h-6" />
                                                        {loading ? "PROCESSING..." : paymentMethods[order.id] === 'COD' ? "CONFIRM COD BOOKING" : "PAY SECURELY"}
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Right Side: Detailed Items List */}
                                        <div className="flex-1 space-y-6 lg:border-l border-gray-100 lg:pl-12">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <div className="w-4 h-1 bg-indigo-500 rounded-full" /> Booked Services
                                            </h4>
                                            <div className="space-y-6">
                                                {order.sub_orders.map(sub => (
                                                    <div key={sub.id} className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 hover:border-indigo-200 hover:bg-white transition-all duration-300 group/item">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex gap-5">
                                                                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover/item:shadow-md transition-all">
                                                                    <Package className="w-7 h-7" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-black text-gray-900 text-lg leading-tight mb-1">
                                                                        {sub.booking_details?.product_title || "Premium Event Service"}
                                                                    </h5>
                                                                    <p className="text-xs text-indigo-600 font-black tracking-wide uppercase italic">
                                                                        by {(vendorNames[String(sub.vendor_id)] || sub.vendor_name || "Aivent Partner").replace(/^by\s+/i, '').trim()}
                                                                    </p>

                                                                    <div className="flex flex-wrap items-center gap-4 mt-4">
                                                                        <div className="px-3 py-1 bg-white rounded-xl border border-gray-200 text-[10px] font-black text-gray-500 flex items-center gap-2 shadow-sm">
                                                                            <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                                                            {sub.booking_details?.date ? new Date(sub.booking_details.date).toLocaleDateString() : "TBD"}
                                                                        </div>
                                                                        <div className="px-3 py-1 bg-white rounded-xl border border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] shadow-sm">
                                                                            {sub.booking_details?.category_name || "Event Service"}
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4 flex items-center gap-2.5">
                                                                        <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${sub.booking_status === 'APPROVED' ? 'bg-emerald-500 animate-pulse' :
                                                                            sub.booking_status === 'REJECTED' ? 'bg-rose-500' :
                                                                                'bg-amber-400'
                                                                            }`} />
                                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${sub.booking_status === 'REJECTED' ? 'text-rose-600' :
                                                                            sub.booking_status === 'APPROVED' ? 'text-emerald-600' : 'text-gray-500'
                                                                            }`}>
                                                                            {sub.booking_status || sub.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-black text-indigo-950 text-xl leading-none tracking-tighter">₹{parseFloat(sub.amount).toLocaleString()}</p>
                                                                <button onClick={() => setSelectedSubOrder(sub)} className="mt-4 text-[10px] font-black text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl transition-all border border-indigo-100 shadow-sm">
                                                                    VIEW DETAILS
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {sub.booking_status === 'REJECTED' && (
                                                            <div className="mt-6 p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 flex items-start gap-3">
                                                                <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Supplier Not Available</p>
                                                                    <p className="text-[10px] text-rose-600 font-bold mt-1 leading-relaxed">This vendor has rejected the request. Please remove this item to proceed with the remaining order.</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {(sub.booking_status === 'AWAITING_APPROVAL' || sub.booking_status === 'REJECTED') && (
                                                            <div className="mt-6 pt-6 border-t border-gray-200/50 flex justify-end gap-3">
                                                                <button onClick={() => handleRemoveItem(order.id, sub.id)} className="px-4 py-2 text-[10px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-colors tracking-widest uppercase">
                                                                    {sub.booking_status === 'REJECTED' ? "REMOVE ITEM" : "CANCEL REQUEST"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default MyOrdersPage;
