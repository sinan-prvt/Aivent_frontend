
import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import { FiClock, FiTag, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function Offers() {
    const offers = [
        {
            id: 1,
            title: "Winter Wedding Blast",
            discount: "20% OFF",
            description: "Book any full wedding decoration package for dates in Dec-Jan and get a flat 20% discount.",
            vendor: "Royal Decorators",
            expiry: "Valid till Nov 30",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
            category: "Decoration"
        },
        {
            id: 2,
            title: "Corporate Catering Deal",
            discount: "Free Dessert Bar",
            description: "Complimentary premium dessert station for corporate events with 200+ guests.",
            vendor: "Gourmet Bites",
            expiry: "Valid till Dec 15",
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
            category: "Catering"
        },
        {
            id: 3,
            title: "Early Bird Photography",
            discount: "15% OFF",
            description: "Pre-book your 2026 wedding photography now and lock in 2025 rates plus a 15% discount.",
            vendor: "Lens Magic Studios",
            expiry: "Limited Slots",
            image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2070&auto=format&fit=crop",
            category: "Photography"
        },
        {
            id: 4,
            title: "Sound System Upgrade",
            discount: "Free Lighting",
            description: "Rent our premium concert sound system and get a basic stage lighting setup absolutely free.",
            vendor: "Sonic Boom Audio",
            expiry: "Valid this month",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
            category: "Sound"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="pt-28 pb-12 px-6 bg-indigo-900 text-white text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4">Exclusive Offers</h1>
                <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
                    Handpicked deals and limited-time discounts from our top-rated partners.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Featured Big Offer */}
                    <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-96">
                        <img src="https://images.unsplash.com/photo-1511795409834-432f7b1728f2?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="Grand Deal" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent p-10 flex flex-col justify-end">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">HOT DEAL</span>
                            <h2 className="text-3xl font-bold text-white mb-2">Complete Venue Package</h2>
                            <p className="text-gray-200 line-clamp-2 mb-4">Get a massive 30% discount when you book Venue + Catering + Decor together for any summer 2026 wedding.</p>
                            <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 w-fit flex items-center gap-2">
                                Claim Offer <FiArrowRight />
                            </button>
                        </div>
                    </div>

                    {/* Standard Offers Grid */}
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-xs font-bold z-10">
                                    {offer.category}
                                </span>
                                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{offer.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{offer.discount}</span>
                                    <span className="text-gray-400 text-xs flex items-center gap-1"><FiClock className="w-3 h-3" /> {offer.expiry}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">{offer.description}</p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{offer.vendor}</span>
                                    <button className="text-indigo-600 font-bold text-sm hover:underline">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
