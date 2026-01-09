
import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import { FiArrowUpRight, FiHeart } from 'react-icons/fi';

export default function Inspiration() {
    const articles = [
        {
            id: 1,
            tag: "Trends 2025",
            title: "Sustainable Events: The New Standard",
            excerpt: "How eco-friendly decor and zero-waste catering are taking over the corporate event world.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?q=80&w=2626&auto=format&fit=crop",
            readTime: "5 min read"
        },
        {
            id: 2,
            tag: "Real Weddings",
            title: "A Minimalist Beachside Union",
            excerpt: "See how this couple transformed a simple beach venue into a gold and white paradise.",
            image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2574&auto=format&fit=crop",
            readTime: "8 min read"
        },
        {
            id: 3,
            tag: "Tech",
            title: "AI in Event Planning",
            excerpt: "Why Aivent's magic planner is a game changer for busy executives.",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2670&auto=format&fit=crop",
            readTime: "4 min read"
        },
        {
            id: 4,
            tag: "Food & Drink",
            title: "Interactive Food Stations",
            excerpt: "Move over buffet lines. DIY taco bars and live sushi counters are here to stay.",
            image: "https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=2670&auto=format&fit=crop",
            readTime: "6 min read"
        },
        {
            id: 5,
            tag: "Decor",
            title: "Neon & Industrial Vibes",
            excerpt: "Combining raw industrial spaces with vibrant neon lighting for product launches.",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
            readTime: "3 min read"
        }

    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Inspiration <span className="text-gray-300">& Ideas</span></h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                    {/* Featured Article - Spans 2 cols */}
                    <div className="lg:col-span-2 group cursor-pointer">
                        <div className="rounded-3xl overflow-hidden mb-6 aspect-[16/9] relative">
                            <img src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2662&auto=format&fit=crop" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Featured" />
                            <button className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-red-500 transition">
                                <FiHeart className="w-6 h-6 fill-current" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                            <span className="font-bold text-indigo-600 uppercase tracking-wider text-xs bg-indigo-50 px-3 py-1 rounded-full">Spotlight</span>
                            <span className="text-gray-400 text-sm">10 min read</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-indigo-600 transition">The Ultimate Guide to Corporate Retreats in 2026</h2>
                        <p className="text-xl text-gray-500 line-clamp-2 max-w-2xl">Discover the top destinations and team-building activities that are redefining corporate culture post-pandemic.</p>
                    </div>

                    {/* Side List - Top 3 small articles? Or just part of the grid */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        <div className="bg-gray-50 rounded-3xl p-8 h-full">
                            <h3 className="font-black text-xl mb-6">Trending Topics</h3>
                            <div className="flex flex-wrap gap-2">
                                {['#WeddingGoals', '#TechEvents', '#Sustainable', '#Luxury', '#DIY', '#Venues'].map(tag => (
                                    <span key={tag} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 cursor-pointer border border-gray-100 transition">{tag}</span>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="font-bold text-lg mb-2">Subscribe to our newsletter</p>
                                <p className="text-gray-500 text-sm mb-4">Get the latest trends delivered to your inbox.</p>
                                <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 mb-2" />
                                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition">Subscribe</button>
                            </div>
                        </div>
                    </div>

                    {/* Standard Articles Grid */}
                    {articles.map(article => (
                        <div key={article.id} className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] relative">
                                <img src={article.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt={article.title} />
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-xs uppercase text-gray-400 tracking-wider">{article.tag}</span>
                                <span className="text-xs text-gray-400">{article.readTime}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition flex items-start justify-between">
                                {article.title}
                                <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt}</p>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
