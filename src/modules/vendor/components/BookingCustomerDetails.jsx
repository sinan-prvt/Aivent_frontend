import React, { useState, useEffect } from 'react';
import { getCustomerProfile } from '../../auth/api/auth.api';

export default function BookingCustomerDetails({ userId, bookingDetails }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Check if we have direct booking customer details
    const bookingContact = bookingDetails && bookingDetails.customer_name ? {
        full_name: bookingDetails.customer_name,
        email: bookingDetails.customer_email,
        phone: bookingDetails.customer_phone,
        full_address: bookingDetails.customer_address,
        city: bookingDetails.customer_city,
        notes: bookingDetails.customer_notes,
        source: 'booking'
    } : null;

    useEffect(() => {
        const loadCustomer = async () => {
            // If we have booking contact, we don't strictly *need* the profile, 
            // but we might want to fetch it for avatar/username if missing.
            // However, to keep it simple and fast, if we have bookingContact, we can skip fetching 
            // UNLESS user specifically wants to compare. 
            // For now, let's fetch profile only if bookingContact is missing OR to supplement data.

            if (!userId) {
                setProfile(null);
                setError(false);
                return;
            }

            // If we already have what we need from bookingContact, we might skip.
            // But let's fetch profile anyway if it's there, to show avatar or fallback.

            setLoading(true);
            setError(false);
            try {
                const res = await getCustomerProfile(userId);
                setProfile(res.data);
            } catch (error) {
                console.error("Failed to fetch customer profile", error);
                // If we encounter error but have bookingContact, it's fine, don't show full error.
                if (!bookingContact) {
                    setProfile(null);
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };

        loadCustomer();
    }, [userId]);

    // Decide what to show
    const displayData = bookingContact || profile;
    const isBookingSource = !!bookingContact;

    if (!userId && !bookingContact) {
        return (
            <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400">Customer info header missing from order data.</p>
            </div>
        );
    }

    if (loading && !bookingContact) {
        return (
            <div className="p-6 bg-gray-50/50 rounded-2xl text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Customer...</p>
            </div>
        );
    }

    if (error && !bookingContact) {
        return (
            <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                <p className="font-bold">Failed to load customer details.</p>
                <p className="mt-1">Please try refreshing the page.</p>
            </div>
        );
    }

    if (!displayData) return null;

    return (
        <section className="bg-gray-50/50 rounded-2xl p-6 border border-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Details</h3>
                {isBookingSource && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">From Booking</span>}
            </div>

            <div className="space-y-4">
                {/* Contact Info */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-sm">
                        {displayData.full_name ? displayData.full_name[0].toUpperCase() : (profile?.username ? profile.username[0].toUpperCase() : 'U')}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{displayData.full_name || profile?.username}</p>
                        <p className="text-xs text-gray-400 font-medium">{displayData.email}</p>
                    </div>
                </div>

                {displayData.phone && (
                    <div className="flex justify-between text-sm py-2 border-t border-gray-100">
                        <span className="text-gray-500 font-medium">Contact Number</span>
                        <span className="text-gray-900 font-bold">{displayData.phone}</span>
                    </div>
                )}

                {/* Address Details */}
                {(displayData.full_address || displayData.city) && (
                    <div className="pt-2 border-t border-gray-100 space-y-3">
                        {displayData.full_address && (
                            <div className="text-sm">
                                <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">Address</span>
                                <p className="text-gray-900 font-medium leading-relaxed">{displayData.full_address}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {displayData.city && (
                                <div className="text-sm">
                                    <span className="text-gray-500 font-medium text-[10px] uppercase">City</span>
                                    <p className="text-gray-900 font-bold">{displayData.city}</p>
                                </div>
                            )}
                            {/* State/Country/Pincode might come from profile if not in booking (booking only had city/address in form) */}
                            {profile && !isBookingSource && profile.state && (
                                <div className="text-sm">
                                    <span className="text-gray-500 font-medium text-[10px] uppercase">State</span>
                                    <p className="text-gray-900 font-bold">{profile.state}</p>
                                </div>
                            )}
                            {profile && !isBookingSource && profile.country && (
                                <div className="text-sm">
                                    <span className="text-gray-500 font-medium text-[10px] uppercase">Country</span>
                                    <p className="text-gray-900 font-bold">{profile.country}</p>
                                </div>
                            )}
                            {profile && !isBookingSource && profile.pincode && (
                                <div className="text-sm">
                                    <span className="text-gray-500 font-medium text-[10px] uppercase">Pincode</span>
                                    <p className="text-gray-900 font-bold">{profile.pincode}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Special Notes from Booking */}
                {bookingContact && bookingContact.notes && (
                    <div className="pt-2 border-t border-gray-100">
                        <span className="text-gray-500 font-medium block text-xs uppercase tracking-wider mb-1">Special Notes</span>
                        <p className="text-sm text-gray-700 italic bg-white p-3 rounded-lg border border-gray-100">{bookingContact.notes}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
