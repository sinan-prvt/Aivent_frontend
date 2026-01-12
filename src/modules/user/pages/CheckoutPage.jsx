import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { FiArrowLeft, FiCheckCircle, FiInfo } from "react-icons/fi";
import { createBooking } from "../api/booking.api";
import { initiatePayment } from "../api/payment.api";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedItems, eventData, totalBudget } = location.state || { selectedItems: [], eventData: {} };

    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const selectedTotal = selectedItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

    const handlePayment = async () => {
        if (selectedItems.length === 0) {
            toast.error("No items selected for booking");
            return;
        }

        setIsProcessing(true);
        try {
            // 1. Create Booking in core-service
            // Note: Our backend expects vendor_id, event_date, amount
            // For multiple items, we might need to adjust, but based on current backend:
            // Let's take the first item as a primary vendor example or modify backend for bulk.
            // For now, let's assume one main booking or trigger for each (based on business logic).
            // Currently, our backend views create one booking at a time.

            const firstItem = selectedItems[0];
            const bookingData = {
                vendor_id: firstItem.vendor_id || "11111111-1111-1111-1111-111111111111", // Fallback for mock
                event_date: eventData.eventDate || "2026-12-12",
                amount: selectedTotal.toFixed(2),
            };

            const bookingResponse = await createBooking(bookingData);
            const masterOrderId = bookingResponse.master_order_id;

            // 2. Initiate Payment in payment-service
            const paymentResponse = await initiatePayment({
                order_id: masterOrderId,
                amount: selectedTotal.toFixed(2),
                currency: "INR"
            });

            // 3. Open Razorpay Modal
            const options = {
                key: paymentResponse.razorpay_key_id,
                amount: paymentResponse.amount * 100, // in paise
                currency: paymentResponse.currency,
                name: "Aivent",
                description: `Payment for ${eventData.eventType}`,
                order_id: paymentResponse.razorpay_order_id,
                handler: async function (response) {
                    toast.success("Payment successful!");
                    setBookingSuccess(true);
                    setIsProcessing(false);
                    // The backend automatically confirms via internal bridge
                    // but we can redirect to a success page.
                    setTimeout(() => navigate("/profile"), 3000);
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                },
                theme: {
                    color: "#6366f1",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error("Payment failed: " + response.error.description);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error) {
            console.error("Booking/Payment error:", error);
            toast.error(error.response?.data?.detail || "Something went wrong during checkout");
            setIsProcessing(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <FiCheckCircle className="text-green-500 w-20 h-20 mb-6 animate-bounce" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                <p className="text-gray-500 text-center max-w-md">
                    Thank you for choosing Aivent. Your payment was successful and your event is now being processed.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8"
                >
                    <FiArrowLeft /> Back to planning
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review your selection</h2>

                            <div className="space-y-4">
                                {selectedItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                            <img src={item.image.startsWith('http') ? item.image : `http://localhost:8003${item.image}`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Service Category</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-indigo-600">${parseFloat(item.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedItems.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    No items selected.
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                Event Details <FiInfo className="text-indigo-300" />
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Event Type</span>
                                    <p className="font-medium text-gray-900">{eventData.eventType || "Standard"}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Planned Date</span>
                                    <p className="font-medium text-gray-900">{eventData.eventDate || "TBD"}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Guests</span>
                                    <p className="font-medium text-gray-900">{eventData.guests || 0} People</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Payment Card */}
                    <div className="space-y-6">
                        <div className="bg-indigo-900 text-white rounded-2xl shadow-xl p-8 sticky top-24 overflow-hidden">
                            {/* Decorative Circle */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600 rounded-full opacity-20"></div>

                            <h3 className="text-lg font-bold mb-8 relative z-10">Order Summary</h3>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between text-indigo-200 text-sm">
                                    <span>Subtotal</span>
                                    <span>${selectedTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-indigo-200 text-sm">
                                    <span>Platform Fee</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="h-px bg-indigo-700 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="text-3xl font-bold">${selectedTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || selectedItems.length === 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all relative z-10 ${isProcessing
                                        ? 'bg-indigo-800 text-indigo-400 cursor-not-allowed'
                                        : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg'
                                    }`}
                            >
                                {isProcessing ? "Processing..." : "Pay with Razorpay"}
                            </button>

                            <p className="text-[10px] text-center mt-6 text-indigo-300 relative z-10">
                                Secure payment powered by Razorpay. By clicking, you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
