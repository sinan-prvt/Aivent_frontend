import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiFilter, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getVendorOrders } from '../../../user/api/orders.api';
import BookingCustomerDetails from '../../components/BookingCustomerDetails';

export default function PhotographyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            const data = await getVendorOrders();
            setBookings(data);
            if (data.length > 0) setSelectedBooking(data[0]);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleApprove = async () => {
        if (!selectedBooking?.booking_id) return;
        try {
            const { approveBooking } = await import('../../../user/api/booking.api');
            await approveBooking(selectedBooking.booking_id);
            // Refresh
            await fetchBookings();
            const updated = bookings.find(b => b.id === selectedBooking.id);
            if (updated) setSelectedBooking(updated);
        } catch (error) {
            console.error("Approval failed", error);
            alert("Failed to approve: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    const handleReject = async () => {
        if (!selectedBooking?.booking_id) return;
        if (!window.confirm("Are you sure you want to reject this booking?")) return;
        try {
            const { rejectBooking } = await import('../../../user/api/booking.api');
            await rejectBooking(selectedBooking.booking_id);
            // Refresh
            await fetchBookings();
            const updated = bookings.find(b => b.id === selectedBooking.id);
            if (updated) setSelectedBooking(updated);
        } catch (error) {
            console.error("Rejection failed", error);
            alert("Failed to reject: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700';
            case 'AWAITING_APPROVAL': return 'bg-yellow-100 text-yellow-700';
            case 'HOLD': return 'bg-yellow-100 text-yellow-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col xl:flex-row h-[calc(100vh-100px)] gap-6">
            {/* Main Booking List */}
            <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 font-sans tracking-tight">Photography Bookings</h1>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
                        <FiDownload /> Export Bookings
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input type="text" placeholder="Search by event or client..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm" />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-transparent hover:border-gray-200 transition-colors">
                        Filter by Status <FiFilter size={14} />
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No bookings found.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Event Type</th>
                                    <th className="px-6 py-4">Event Date</th>
                                    <th className="px-6 py-4">Guests</th>
                                    <th className="px-6 py-4">Package</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((booking) => {
                                    const details = booking.booking_details || {};
                                    return (
                                        <tr
                                            key={booking.id}
                                            onClick={() => setSelectedBooking(booking)}
                                            className={`hover:bg-indigo-50/30 transition-colors cursor-pointer group ${selectedBooking?.id === booking.id ? 'bg-indigo-50/50' : ''}`}
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {details.event_type || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                {details.date || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {details.guests || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {details.product_title || 'Photo Package'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.booking_status)}`}>
                                                    {booking.booking_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">
                                                ₹{booking.amount}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Sidebar Details */}
            {selectedBooking && (
                <div className="w-full xl:w-96 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col space-y-6 overflow-y-auto">
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Summary</div>
                        <div className="flex justify-between items-baseline">
                            <h2 className="text-xl font-bold text-gray-900">Order #{selectedBooking.id.slice(0, 8)}</h2>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(selectedBooking.booking_status)}`}>
                                {selectedBooking.booking_status}
                            </span>
                        </div>
                        <div className="text-xs text-mono text-gray-400 mt-1">
                            Date: {selectedBooking.booking_details?.date}
                        </div>
                    </div>

                    {selectedBooking.booking_status === "AWAITING_APPROVAL" && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleApprove}
                                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle /> Approve
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-white border border-red-200 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                            >
                                <FiAlertCircle /> Reject
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-bold text-gray-900 text-sm mb-3">Event Details</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong>Type:</strong> {selectedBooking.booking_details?.event_type}</p>
                                <p><strong>Guests:</strong> {selectedBooking.booking_details?.guests}</p>
                                <p><strong>Package:</strong> {selectedBooking.booking_details?.product_title}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-bold text-gray-900 text-sm mb-3">Payment Info</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong>Amount:</strong> ₹{selectedBooking.amount}</p>
                                <p><strong>Payment Status:</strong> {selectedBooking.status}</p>
                            </div>
                        </div>

                        <BookingCustomerDetails userId={selectedBooking.booking_user_id} bookingDetails={selectedBooking.booking_details} />

                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-bold text-gray-900 text-sm mb-3">Client Notes</h3>
                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                "The client has requested special attention to..." (Notes feature pending)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
