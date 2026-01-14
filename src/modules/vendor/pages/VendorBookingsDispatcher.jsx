import React from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import CateringBookings from './catering/CateringBookings';
import PhotographyBookings from './photography/PhotographyBookings';
import DecorBookings from './decoration/DecorBookings';
import LightingBookings from './lighting/LightingBookings';
import SoundBookings from './sound/SoundBookings';

/**
 * Dispatcher component that routes to the correct bookings component
 * based on the vendor's category.
 */
export default function VendorBookingsDispatcher() {
    const { user } = useAuth();
    const catId = user?.category_id ? String(user.category_id) : null;

    switch (catId) {
        case "1": // Catering
            return <CateringBookings />;
        case "2": // Decoration
            return <DecorBookings />;
        case "3": // Lighting
            return <LightingBookings />;
        case "4": // Photography
            return <PhotographyBookings />;
        case "5": // Sound & Music
            return <SoundBookings />;
        default:
            // Generic placeholder for categories without specific bookings component
            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-500 mt-2">Manage your bookings and schedules.</p>
                    <div className="mt-8 bg-white p-12 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                        <p>Bookings management for your category coming soon...</p>
                    </div>
                </div>
            );
    }
}
