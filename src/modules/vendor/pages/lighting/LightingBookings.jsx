import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getVendorOrders } from '../../../user/api/orders.api';
import BookingCustomerDetails from '../../components/BookingCustomerDetails';

export default function LightingBookings() {
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
            await fetchBookings();
            const updated = bookings.find(b => b.id === selectedBooking.id);
            if (updated) setSelectedBooking(updated);
        } catch (error) {
            alert("Failed to approve: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    const handleReject = async () => {
        if (!selectedBooking?.booking_id) return;
        if (!window.confirm("Are you sure you want to reject this booking?")) return;
        try {
            const { rejectBooking } = await import('../../../user/api/booking.api');
            await rejectBooking(selectedBooking.booking_id);
            await fetchBookings();
            const updated = bookings.find(b => b.id === selectedBooking.id);
            if (updated) setSelectedBooking(updated);
        } catch (error) {
            alert("Failed to reject: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'AWAITING_APPROVAL': return 'bg-yellow-100 text-yellow-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col xl:flex-row h-[calc(100vh-100px)] gap-6">
            <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Lighting Bookings</h1>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white">
                        <FiDownload /> Export
                    </button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input type="text" placeholder="Search bookings..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : bookings.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No bookings found.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Equipment/Service</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} onClick={() => setSelectedBooking(booking)} className={`hover:bg-indigo-50/30 cursor-pointer ${selectedBooking?.id === booking.id ? 'bg-indigo-50/50' : ''}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{booking.booking_details?.product_title || 'Lighting Package'}</td>
                                        <td className="px-6 py-4 text-gray-500">{booking.booking_details?.date || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.booking_status)}`}>
                                                {booking.booking_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {selectedBooking && (
                <div className="w-full xl:w-96 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col space-y-6 overflow-y-auto">
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Info</div>
                        <h2 className="text-xl font-bold text-gray-900">#{selectedBooking.id.slice(0, 8)}</h2>
                    </div>

                    {selectedBooking.booking_status === "AWAITING_APPROVAL" && (
                        <div className="flex gap-3">
                            <button onClick={handleApprove} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 flex items-center justify-center gap-2">
                                <FiCheckCircle /> Approve
                            </button>
                            <button onClick={handleReject} className="flex-1 bg-white border border-red-200 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 flex items-center justify-center gap-2">
                                <FiAlertCircle /> Reject
                            </button>
                        </div>
                    )}

                    <BookingCustomerDetails userId={selectedBooking.booking_user_id} />
                </div>
            )}
        </div>
    );
}
