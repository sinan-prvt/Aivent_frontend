import React from 'react';
import { FiDownload, FiSearch, FiFilter, FiCalendar, FiClock, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function CateringBookings() {
    const bookings = [
        {
            id: "BK-12-11422",
            client: "Eleanor Vance",
            event: "Wedding",
            date: "Dec 08, 2024",
            guests: 150,
            package: "Gold Tier Buffet",
            status: "Confirmed",
            dietary: { vegan: 12, glutenFree: 5 }
        },
        {
            id: "BK-12-11425",
            client: "Corporate Tech Summit",
            event: "Corporate Gala",
            date: "Nov 22, 2024",
            guests: 300,
            package: "Platinum Plated",
            status: "Completed",
            dietary: { vegan: 40, glutenFree: 15, nutFree: 2 }
        },
        {
            id: "BK-12-11501",
            client: "Anya Petrova",
            event: "Birthday Party",
            date: "Nov 15, 2024",
            guests: 45,
            package: "Mixer Package",
            status: "Pending",
            dietary: { vegan: 0 }
        },
        {
            id: "BK-12-11589",
            client: "Charity Foundation",
            event: "Fundraiser",
            date: "Dec 05, 2024",
            guests: 500,
            package: "Custom Menu",
            status: "Cancelled",
            dietary: { vegan: 50, glutenFree: 25 }
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col xl:flex-row h-[calc(100vh-100px)] gap-6">
            {/* Main Booking List */}
            <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 font-sans tracking-tight">Catering Bookings</h1>
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
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-transparent hover:border-gray-200 transition-colors">
                        Filter by Event Type <FiFilter size={14} />
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Event Type</th>
                                <th className="px-6 py-4">Event Date</th>
                                <th className="px-6 py-4">Guests</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{booking.event}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{booking.date}</td>
                                    <td className="px-6 py-4 text-gray-500">{booking.guests}</td>
                                    <td className="px-6 py-4 text-gray-500">{booking.package}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sidebar Details (Static for now based on selected booking paradigm) */}
            <div className="w-full xl:w-96 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col space-y-6 overflow-y-auto">
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Summary</div>
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-bold text-gray-900">Eleanor Vance</h2>
                        <span className="text-sm text-gray-500">Wedding</span>
                    </div>
                    <div className="text-xs text-mono text-gray-400 mt-1">Booking ID: BK-12-11422</div>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-3">Client Notes</h3>
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                            "The couple has requested a special dessert station with a chocolate fountain. Please ensure the setup is elegant and placed near the main dance floor. Also, coordinator requires final headcount 3 days prior."
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-3">Special Dietary Needs</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FiCheckCircle className="text-green-500" />
                                <span><strong>12</strong> Vegan (Confirmed)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FiCheckCircle className="text-green-500" />
                                <span><strong>5</strong> Gluten-Free (Confirmed)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <h3 className="font-bold text-red-900 text-sm mb-3 flex items-center gap-2"><FiAlertCircle /> Allergens</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-red-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                <span>Severe Peanut Allergy</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-red-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                <span>Shellfish Allergy</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-sm transition-colors"> Contact Client</button>
                    <button className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-bold text-sm transition-colors">Print Invoice</button>
                </div>
            </div>
        </div>
    );
}
