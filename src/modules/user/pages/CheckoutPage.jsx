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
    const { selectedItems, eventData, totalBudget, masterOrderId: existingMasterOrderId } = location.state || { selectedItems: [], eventData: {} };

    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1: Review, 2: Details, 3: Payment
    const [namesLoading, setNamesLoading] = useState(false);
    const [vendorNames, setVendorNames] = useState({});
    const [userDetails, setUserDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        notes: ""
    });
    React.useEffect(() => {
        const fetchNames = async () => {
            setNamesLoading(true);
            const vendorIds = [...new Set(selectedItems.map(item => String(item.vendor_id || item.vendor || "unknown")))];
            const namesMap = { ...vendorNames };

            try {
                const api = await import('../api/vendor.api');
                const promises = vendorIds.map(async (vid) => {
                    if (vid !== "unknown" && !namesMap[vid]) {
                        try {
                            const detail = await api.getPublicVendorDetail(vid);
                            namesMap[vid] = detail.business_name || detail.name || "Aivent Partner";
                        } catch (e) {
                            console.error(`Failed to fetch vendor ${vid}`, e);
                            namesMap[vid] = "Aivent Partner";
                        }
                    }
                });
                await Promise.all(promises);
            } catch (err) {
                console.error("Error loading vendor details", err);
            } finally {
                setVendorNames(namesMap);
                setNamesLoading(false);
            }
        };
        if (selectedItems.length > 0) fetchNames();
    }, [selectedItems]);

    const selectedTotal = selectedItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

    const handleContinueToDetails = () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one service");
            return;
        }
        setCurrentStep(2);
    };

    const handleContinueToPayment = () => {
        if (!userDetails.fullName || !userDetails.email || !userDetails.phone) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!/^[0-9]{10}$/.test(userDetails.phone.replace(/[\s-]/g, ""))) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }
        setCurrentStep(3);
    };

    const handleBookingRequest = async () => {
        if (selectedItems.length === 0) {
            toast.error("No items selected for booking");
            return;
        }

        setIsProcessing(true);
        try {
            let masterOrderId = existingMasterOrderId || null;

            for (let i = 0; i < selectedItems.length; i++) {
                const item = selectedItems[i];
                const vid = String(item.vendor_id || item.vendor || "unknown");

                const idempotencyKey = `booking-${item.id}-${Date.now()}`;

                const bookingData = {
                    vendor_id: vid,
                    vendor_name: vendorNames[vid] || item.vendor_name || item.vendorName || "Aivent Partner",
                    product_name: item.name,
                    category_name: item.categoryName || "Service",
                    event_type: eventData.eventType || "Standard Event",
                    guests: String(eventData.guests || "N/A"),
                    event_date: eventData.eventDate || new Date().toISOString().split('T')[0],
                    amount: parseFloat(item.price).toFixed(2),
                    amount: parseFloat(item.price).toFixed(2),
                    master_order_id: masterOrderId, // Pass this to group items into one order

                    customer_name: userDetails.fullName,
                    customer_email: userDetails.email,
                    customer_phone: userDetails.phone,
                    customer_address: userDetails.address,
                    customer_city: userDetails.city,
                    customer_notes: userDetails.notes
                };

                console.log(`Processing booking ${i + 1}/${selectedItems.length}:`, bookingData);

                const response = await createBooking(bookingData, idempotencyKey);

                if (!masterOrderId && response.master_order_id) {
                    masterOrderId = response.master_order_id;
                }
            }

            toast.success("Booking Requests Sent! Waiting for vendor approval.");
            setBookingSuccess(true);
            setIsProcessing(false);

            console.log("Final Vendor names used:", vendorNames);

            setTimeout(() => navigate("/my-orders"), 2000);

        } catch (error) {
            console.error("Booking error:", error);
            const errorMsg = error.response?.data?.detail || "Something went wrong during booking";
            toast.error(errorMsg);
            setIsProcessing(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <FiCheckCircle className="text-green-500 w-20 h-20 mb-6 animate-bounce" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Requested!</h1>
                <p className="text-gray-500 text-center max-w-md">
                    Your booking request has been sent to the vendor. You will be notified once they approve it, after which you can proceed to payment.
                </p>
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                    >
                        Go to My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-24">
                <button
                    onClick={() => currentStep === 1 ? navigate(-1) : setCurrentStep(currentStep - 1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8"
                >
                    <FiArrowLeft /> {currentStep === 1 ? "Back to planning" : "Back"}
                </button>

                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                                1
                            </div>
                            <span className="font-medium hidden sm:block">Review</span>
                        </div>
                        <div className={`h-0.5 w-16 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                                2
                            </div>
                            <span className="font-medium hidden sm:block">Details</span>
                        </div>
                        <div className={`h-0.5 w-16 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                                3
                            </div>
                            <span className="font-medium hidden sm:block">Confirm</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {currentStep === 1 && (
                            <>
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review your selection</h2>

                                    <div className="space-y-4">
                                        {selectedItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
                                                    <img
                                                        src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:8003${item.image}`) : "https://via.placeholder.com/150?text=Service"}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                    <p className="text-xs text-gray-500">{item.categoryName || "Service Package"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-indigo-600">₹{parseFloat(item.price).toLocaleString()}</span>
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
                            </>
                        )}

                        {currentStep === 2 && (
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={userDetails.fullName}
                                                onChange={(e) => setUserDetails({ ...userDetails, fullName: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={userDetails.email}
                                                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={userDetails.phone}
                                                onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={userDetails.city}
                                                onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                                                placeholder="Mumbai"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            value={userDetails.address}
                                            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none"
                                            rows="3"
                                            placeholder="Enter your full address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Special Notes
                                        </label>
                                        <textarea
                                            value={userDetails.notes}
                                            onChange={(e) => setUserDetails({ ...userDetails, notes: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none"
                                            rows="3"
                                            placeholder="Any special requirements or preferences for your event..."
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {currentStep === 3 && (
                            <>
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Details</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-400 uppercase font-bold">Full Name</span>
                                            <p className="font-medium text-gray-900">{userDetails.fullName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-400 uppercase font-bold">Email</span>
                                            <p className="font-medium text-gray-900">{userDetails.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-400 uppercase font-bold">Phone</span>
                                            <p className="font-medium text-gray-900">{userDetails.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-400 uppercase font-bold">City</span>
                                            <p className="font-medium text-gray-900">{userDetails.city || "Not provided"}</p>
                                        </div>
                                    </div>
                                </section>
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Selected Services</h2>
                                    <div className="space-y-3">
                                        {selectedItems.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-gray-50">
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                                <span className="font-bold text-indigo-600">₹{parseFloat(item.price).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-indigo-900 text-white rounded-2xl shadow-xl p-8 sticky top-24 overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600 rounded-full opacity-20"></div>

                            <h3 className="text-lg font-bold mb-8 relative z-10">Order Summary</h3>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between text-indigo-200 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{selectedTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-indigo-200 text-sm">
                                    <span>Platform Fee</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="h-px bg-indigo-700 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="text-3xl font-bold">₹{selectedTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {currentStep === 1 && (
                                <button
                                    onClick={handleContinueToDetails}
                                    disabled={selectedItems.length === 0}
                                    className="w-full py-4 rounded-xl font-bold text-lg transition-all relative z-10 bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Details
                                </button>
                            )}

                            {currentStep === 2 && (
                                <button
                                    onClick={handleContinueToPayment}
                                    className="w-full py-4 rounded-xl font-bold text-lg transition-all relative z-10 bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg"
                                >
                                    Continue to Confirmation
                                </button>
                            )}

                            {currentStep === 3 && (
                                <button
                                    onClick={handleBookingRequest}
                                    disabled={isProcessing || namesLoading}
                                    className={`w-full py-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all duration-300
                                                ${(isProcessing || namesLoading)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-200 active:scale-95'
                                        }`}
                                >
                                    {isProcessing ? "PROCESSING..." : namesLoading ? "RESOLVING VENDORS..." : "CONFIRM & BOOK NOW"}
                                </button>
                            )}

                            <p className="text-[10px] text-center mt-6 text-indigo-300 relative z-10">
                                Payment will be collected after vendor approval.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
