
import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';

export default function EventsBrowse() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const events = [
        {
            title: "Weddings",
            desc: "From intimate ceremonies to grand royal affairs.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
            link: "/categories/wedding"
        },
        {
            title: "Corporate",
            desc: "Conferences, seminars, product launches & retreats.",
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
            link: "/categories/corporate"
        },
        {
            title: "Social Gatherings",
            desc: "Birthdays, anniversaries, and family reunions.",
            image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop",
            link: "/categories/party"
        },
        {
            title: "Concerts & Performing Arts",
            desc: "Live music, theater, and large scale performances.",
            image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
            link: "/categories/concert"
        },
        {
            title: "Fashion & Lifestyle",
            desc: "Runway shows, exhibitions, and brand activations.",
            image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2070&auto=format&fit=crop",
            link: "/categories/fashion"
        },
        {
            title: "Charity & Galas",
            desc: "Fundraisers, black-tie events, and donor dinners.",
            image: "https://images.unsplash.com/photo-1561489413-985b06da5bee?q=80&w=2070&auto=format&fit=crop",
            link: "/categories/gala"
        }

    ];

    const handleEventClick = (event) => {
        // Navigate to home page and scroll to planning section
        // We pass the event title to pre-fill the form and use hash to scroll
        navigate("/#create-plan", { state: { preSelectedEventType: event.title } });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            <div className="pt-32 pb-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-100 uppercase tracking-wider">
                        Discover
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6">Find Vendors for <span className="text-indigo-600">Every Occasion.</span></h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Browse our curated list of event categories to find the perfect partners for your next big moment.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, idx) => (
                        <div
                            onClick={() => handleEventClick(event)}
                            key={idx}
                            className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg cursor-pointer"
                        >
                            <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                                <h3 className="text-3xl font-bold text-white mb-2">{event.title}</h3>
                                <p className="text-gray-300 font-medium mb-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 delay-100">{event.desc}</p>
                                <div className="bg-white/20 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition duration-300">
                                    <FiArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
