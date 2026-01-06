import React from "react";
import { FiCalendar } from "react-icons/fi";

export default function LightingBookings() {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900">Bookings</h1>
                <p className="text-gray-500 text-sm mt-1">View and manage your lighting & sound event bookings.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                <FiCalendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900">Coming Soon</h3>
                <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
                    Booking management functionality will be available in a future update.
                </p>
            </div>
        </div>
    );
}
