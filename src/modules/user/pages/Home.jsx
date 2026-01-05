import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useCategories } from "../hooks/useCategories";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [eventData, setEventData] = useState({
    eventType: "Wedding",
    budget: "",
    guests: ""
  });
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToDashboard = () => {
    if (!user) return navigate("/login");
    if (user.role === "admin") return navigate("/admin", { replace: true });
    if (user.role === "vendor") return navigate("/vendor/dashboard", { replace: true });
    return navigate("/", { replace: true });
  };

  const handleStartPlanning = (e) => {
    e.preventDefault();
    setShowCategoriesModal(true);
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleGeneratePlan = () => {
    setShowCategoriesModal(false);
    setSelectedCategories([]);

    if (user) {
      navigate("/dashboard/plan", {
        state: {
          eventData,
          categories: selectedCategories
        }
      });
    } else {
      navigate("/register", {
        state: {
          eventData,
          categories: selectedCategories
        }
      });
    }
  };

  const eventTypes = [
    { name: "Wedding", color: "from-pink-500 to-rose-500" },
    { name: "Birthday", color: "from-blue-500 to-cyan-500" },
    { name: "Corporate", color: "from-indigo-500 to-purple-500" },
    { name: "Festival", color: "from-green-500 to-emerald-500" },
    { name: "Conference", color: "from-gray-700 to-gray-900" },
    { name: "Social", color: "from-orange-500 to-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <Navbar />

      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Select Planning Categories
                </h3>
                <p className="text-gray-600 mt-2">
                  Choose the services you need for your event
                </p>
              </div>
              <button
                onClick={() => setShowCategoriesModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {categoriesLoading ? (
                <div className="col-span-full text-center py-8 text-gray-500">Loading categories...</div>
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${selectedCategories.includes(category.name)
                      ? "border-indigo-500 bg-indigo-50 transform scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-2xl mb-2">{category.icon || "📦"}</span>
                    <span className="font-medium text-gray-800 text-sm">{category.name}</span>
                  </button>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">No categories available</div>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <div>
                <span className="text-sm text-gray-600">
                  {selectedCategories.length} category selected
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCategoriesModal(false);
                    setSelectedCategories([]);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePlan}
                  disabled={selectedCategories.length === 0}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${selectedCategories.length === 0
                    ? "bg-gray-200 cursor-not-allowed text-gray-400"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                >
                  Continue to Planning →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Event Planning,
            <span className="block">Perfected.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your entire event workflow with AI-powered tools, vendor management,
            and real-time collaboration—all in one professional platform.
          </p>
        </div>

        {/* Event Planning Card */}
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Begin Your Event Journey
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Event Type
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                    value={eventData.eventType}
                    onChange={(e) => setEventData({ ...eventData, eventType: e.target.value })}
                  >
                    {eventTypes.map(type => (
                      <option key={type.name} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Estimated Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                      placeholder="e.g., 50,000"
                      value={eventData.budget}
                      onChange={(e) => setEventData({ ...eventData, budget: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Expected Guests
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">👥</span>
                    <input
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                      placeholder="e.g., 100"
                      value={eventData.guests}
                      onChange={(e) => setEventData({ ...eventData, guests: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-auto">
              <button
                onClick={handleStartPlanning}
                className="w-full lg:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
              >
                Start Planning
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            {user ? (
              <button
                onClick={goToDashboard}
                className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition"
                >
                  Existing User? Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Enterprise-Grade Tools,
              <span className="block text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                Simplified for You
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive suite of professional tools designed to handle every aspect of event planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Intelligent Budgeting",
                desc: "AI-powered budget allocation and real-time cost tracking with predictive analytics.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🤝",
                title: "Vendor Ecosystem",
                desc: "Curated network of verified professionals with transparent ratings and reviews.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "💬",
                title: "Smart Negotiation",
                desc: "In-platform communication with built-in contract management and approval workflows.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "🤖",
                title: "AI Planning Assistant",
                desc: "Automated timelines, vendor matching, and personalized recommendations.",
                gradient: "from-orange-500 to-amber-500"
              },
              {
                icon: "👥",
                title: "Team Collaboration",
                desc: "Role-based access control, shared dashboards, and real-time progress tracking.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                desc: "Comprehensive insights with ROI tracking and performance metrics.",
                gradient: "from-gray-700 to-gray-900"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${item.gradient} text-white text-2xl mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Events Planned" },
              { value: "₹500M+", label: "Budget Managed" },
              { value: "5,000+", label: "Verified Vendors" },
              { value: "98.7%", label: "Client Satisfaction" }
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Aivent</h3>
              <p className="text-gray-400">
                Professional event planning platform powered by AI and industry expertise.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-300">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-300">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-300">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Partners</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Aivent. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}