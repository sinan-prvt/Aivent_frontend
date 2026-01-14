import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiFilter, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getVendorOrders } from '../../../user/api/orders.api';
import { useAuth } from '../../../../app/providers/AuthProvider';

export default function SoundBookings() {
    const { user } = useAuth();
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
            case 'REJECTED': return 'bg-red-100 text-red-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col xl:flex-row h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
            {/* Main Booking List */}
            <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sound & Music Bookings</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your service requests and gig confirmations.</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
                        <FiDownload /> Export
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[240px]">
                        <FiSearch className="absolute left-4 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search gigs or clients..."
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all text-sm font-medium"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 border border-transparent hover:border-gray-200 transition-all">
                        <FiFilter size={16} /> Filter
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="overflow-auto flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Orders...</p>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <FiCalendar className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold">No active bookings found</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-black tracking-widest sticky top-0 z-10">
                                    <tr>
                                        <th className="px-8 py-5">Event Detail</th>
                                        <th className="px-6 py-5">Schedule</th>
                                        <th className="px-6 py-5">Equipment</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Quote</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bookings.map((booking) => {
                                        const details = booking.booking_details || {};
                                        const isSelected = selectedBooking?.id === booking.id;
                                        return (
                                            <tr
                                                key={booking.id}
                                                onClick={() => setSelectedBooking(booking)}
                                                className={`hover:bg-indigo-50/30 transition-all cursor-pointer group ${isSelected ? 'bg-indigo-50/50' : ''}`}
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {details.event_type || 'Gig'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">#{booking.id.slice(0, 8)}</div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-700">{details.date || 'TBD'}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase">{details.guests || 0} Guests</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-sm text-gray-600 font-medium">
                                                        {details.product_title || 'Sound Package'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(booking.booking_status)}`}>
                                                        {booking.booking_status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="text-sm font-black text-gray-900">₹{parseFloat(booking.amount).toLocaleString()}</div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Details */}
            {selectedBooking && (
                <div className="w-full xl:w-96 bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 h-full flex flex-col space-y-8 overflow-y-auto animate-in slide-in-from-right duration-500">
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Request Overview</div>
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                {selectedBooking.booking_details?.event_type || 'Event Package'}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(selectedBooking.booking_status)}`}>
                                {selectedBooking.booking_status}
                            </span>
                        </div>
                    </div>

                    {selectedBooking.booking_status === "AWAITING_APPROVAL" && (
                        <div className="flex gap-4">
                            <button
                                onClick={handleApprove}
                                className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
                            >
                                <FiCheckCircle className="group-hover:scale-110 transition-transform" />
                                <span>Approve</span>
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-white border border-gray-200 text-red-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                            >
                                <FiAlertCircle /> <span>Reject</span>
                            </button>
                        </div>
                    )}

                    <div className="space-y-6">
                        <section className="bg-gray-50/50 rounded-2xl p-6 border border-gray-50">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Event Requirements</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Event Type</span>
                                    <span className="text-gray-900 font-bold">{selectedBooking.booking_details?.event_type}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Guest Count</span>
                                    <span className="text-gray-900 font-bold">{selectedBooking.booking_details?.guests}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Requested Service</span>
                                    <span className="text-gray-900 font-bold">{selectedBooking.booking_details?.product_title}</span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gray-50/50 rounded-2xl p-6 border border-gray-50">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Financials</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Base Quote</span>
                                    <span className="text-gray-900 font-black">₹{parseFloat(selectedBooking.amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Payment State</span>
                                    <span className={`font-bold ${selectedBooking.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl">
                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed text-center">
                                Once you approve, the customer will be notified to proceed with the final payment for your service.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
