import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../../components/layout/Navbar";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useCategories } from "../hooks/useCategories";
import { FiChevronRight, FiCheck, FiStar, FiTrendingUp, FiShield, FiUsers, FiCalendar, FiDollarSign, FiUsers as FiGuests, FiArrowRight, FiMapPin, FiClock, FiPackage } from "react-icons/fi";
import { TbCalendarStats, TbRocket, TbChartLine, TbChevronRight, TbBuilding, TbCertificate } from "react-icons/tb";
import { HiOutlineLightningBolt, HiOutlineSparkles } from "react-icons/hi";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [eventData, setEventData] = useState({
    eventType: "Corporate Conference",
    budget: "",
    guests: ""
  });
  const [errors, setErrors] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [counterValues, setCounterValues] = useState({
    events: 0,
    satisfaction: 0,
    budget: 0,
    vendors: 0
  });
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simple counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const animateCounter = (start, end, duration, setter) => {
            let startTimestamp = null;
            const step = (timestamp) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              const value = Math.floor(progress * (end - start) + start);
              setter(value);
              if (progress < 1) {
                window.requestAnimationFrame(step);
              }
            };
            window.requestAnimationFrame(step);
          };

          setTimeout(() => {
            animateCounter(0, 10000, 2000, (val) => setCounterValues(prev => ({ ...prev, events: val })));
            animateCounter(0, 99.2, 2500, (val) => setCounterValues(prev => ({ ...prev, satisfaction: val })));
            animateCounter(0, 500, 2000, (val) => setCounterValues(prev => ({ ...prev, budget: val })));
            animateCounter(0, 2500, 2200, (val) => setCounterValues(prev => ({ ...prev, vendors: val })));
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const goToDashboard = () => {
    if (!user) return navigate("/login");
    if (user.role === "admin") return navigate("/admin", { replace: true });
    if (user.role === "vendor") return navigate("/vendor/dashboard", { replace: true });
    return navigate("/dashboard", { replace: true });
  };

  const handleStartPlanning = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!eventData.budget || parseFloat(eventData.budget) <= 0) {
      newErrors.budget = "Please enter a valid budget";
    }
    if (!eventData.guests || parseInt(eventData.guests) <= 0) {
      newErrors.guests = "Please enter number of guests";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all details to continue");
      return;
    }

    setErrors({});
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
    { name: "Corporate Conference", icon: "🏢" },
    { name: "Product Launch", icon: "🚀" },
    { name: "Executive Retreat", icon: "🌲" },
    { name: "Award Ceremony", icon: "🏆" },
    { name: "Board Meeting", icon: "💼" },
    { name: "Client Summit", icon: "🤝" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section with Full-Screen Background Image */}
      <div className="relative min-h-screen mt-15 mb-6">
        {/* Background Image Container */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(0,0,0, 0.95)), 
                              url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')`
            }}
          >
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Accent Gradients */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-gradient-to-tr from-indigo-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-blue-100">
              <HiOutlineSparkles className="w-3 h-3" />
              AI-Powered Enterprise Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="block text-white">Elevate Your</span>
              <span className="block text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-400 bg-clip-text">
                Corporate Events
              </span>
            </h1>

            <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed mb-12">
              Professional event management platform with intelligent planning,
              vendor coordination, and real-time analytics for enterprise teams.
            </p>

            {/* CTA Button that leads to Create Event Plan section */}
            <a
              href="#create-plan"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 group text-lg"
            >
              Start Planning Now
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="text-white text-sm">Scroll to plan</div>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto mt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Starts after hero background */}
      <div className="relative z-10 bg-white">
        {/* Create Event Plan Section - PROFESSIONAL REDESIGN */}
        <section id="create-plan" className="py-24 px-6 bg-gradient-to-b from-white via-gray-50/30 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Professional Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50/50 px-5 py-2 rounded-full border border-gray-200 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-sm font-medium text-gray-700">Intelligent Event Planning</span>
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Strategic Event
                <span className="block text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  Architecture Design
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Transform your vision into a meticulously planned event with our enterprise-grade planning platform
              </p>
            </div>

            {/* Professional Planning Interface */}
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Process Steps */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      Define Your Requirements
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                          <FiCalendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Event Type</h4>
                          <p className="text-gray-600 text-sm mt-1">Select your event category and objectives</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-1">
                          <FiDollarSign className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Budget Framework</h4>
                          <p className="text-gray-600 text-sm mt-1">Establish your financial parameters</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-1">
                          <FiUsers className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Attendee Profile</h4>
                          <p className="text-gray-600 text-sm mt-1">Define your audience size and composition</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">2</span>
                      </div>
                      Smart Analysis
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Our AI analyzes 250+ data points to create optimal vendor matches and budget allocations based on your specifications.
                    </p>
                  </div>
                </div>

                {/* Center Column - Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                    {/* Form Header */}
                    <div className="border-b border-gray-100 p-8 bg-gradient-to-r from-white to-gray-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          Event Specification Form
                        </h3>
                        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          AI-Powered
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Complete the form to receive a comprehensive event blueprint
                      </p>
                    </div>

                    {/* Form Content */}
                    <div className="mt-10 max-w-3xl mx-auto bg-white p-8 shadow-xl rounded-2xl border">
                      <form onSubmit={handleStartPlanning}>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-2">Event Type</label>
                            <select
                              className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                              value={eventData.eventType}
                              onChange={(e) => setEventData({ ...eventData, eventType: e.target.value })}
                            >
                              <option>Corporate Conference</option>
                              <option>Product Launch</option>
                              <option>Executive Retreat</option>
                              <option>Award Ceremony</option>
                              <option>Board Meeting</option>
                              <option>Client Summit</option>
                              <option>Wedding</option>
                              <option>Birthday</option>
                              <option>Festival</option>
                            </select>
                          </div>

                          <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-2">Estimated Budget</label>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-gray-500">₹</span>
                              <input
                                type="number"
                                className="border-2 border-gray-300 rounded-xl pl-10 pr-4 py-3 w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                placeholder="50,000"
                                value={eventData.budget}
                                onChange={(e) => setEventData({ ...eventData, budget: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-2">Number of Guests</label>
                            <input
                              type="number"
                              className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                              placeholder="100"
                              value={eventData.guests}
                              onChange={(e) => setEventData({ ...eventData, guests: e.target.value })}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleStartPlanning}
                          className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                        >
                          Start Planning
                        </button>


                        {/* Advanced Options */}
                        <div className="border-t border-gray-100 pt-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FiPackage className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">Advanced Options</span>
                            </div>
                            <button
                              type="button"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              onClick={() => setShowCategoriesModal(true)}
                            >
                              + Add service categories
                            </button>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                          >
                            <HiOutlineSparkles className="w-5 h-5" />
                            <span>Generate Comprehensive Plan</span>
                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                      <TbBuilding className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Enterprise</div>
                        <div className="text-xs text-gray-500">Ready</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                      <TbCertificate className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">ISO 27001</div>
                        <div className="text-xs text-gray-500">Certified</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                      <FiShield className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">GDPR</div>
                        <div className="text-xs text-gray-500">Compliant</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                      <FiClock className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">99.9%</div>
                        <div className="text-xs text-gray-500">Uptime</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >

        {/* Stats Section with Animated Counters */}
        < section ref={statsRef} className="py-20 px-6 bg-gradient-to-b from-white to-gray-50" >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Enterprise Performance Metrics
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Delivering measurable results across global organizations
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
                  {counterValues.events.toLocaleString()}+
                </div>
                <div className="text-gray-700 font-medium text-lg">Events Managed</div>
                <div className="text-gray-500 text-sm mt-2">Global enterprise portfolio</div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-3">
                  {counterValues.satisfaction.toFixed(1)}%
                </div>
                <div className="text-gray-700 font-medium text-lg">Client Retention</div>
                <div className="text-gray-500 text-sm mt-2">Enterprise satisfaction rate</div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-3">
                  {counterValues.vendors.toLocaleString()}+
                </div>
                <div className="text-gray-700 font-medium text-lg">Verified Partners</div>
                <div className="text-gray-500 text-sm mt-2">Global vendor network</div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-3">
                  ₹{counterValues.budget}Cr+
                </div>
                <div className="text-gray-700 font-medium text-lg">Annual Volume</div>
                <div className="text-gray-500 text-sm mt-2">Managed event spend</div>
              </div>
            </div>
          </div>
        </section >

        {/* Key Features */}
        < section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white" >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Strategic Capabilities
                <span className="block text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  for Enterprise Events
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive solutions designed for complex organizational requirements
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TbCalendarStats className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Portfolio Management
                </h3>
                <p className="text-gray-600">
                  Centralized oversight and coordination for multiple concurrent enterprise events with real-time visibility.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiUsers className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Strategic Sourcing
                </h3>
                <p className="text-gray-600">
                  Intelligent vendor selection and contract management with performance analytics and compliance tracking.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiDollarSign className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Financial Governance
                </h3>
                <p className="text-gray-600">
                  Multi-level approval workflows, budget controls, and comprehensive financial reporting with audit trails.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiTrendingUp className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Performance Intelligence
                </h3>
                <p className="text-gray-600">
                  Advanced analytics and ROI measurement with predictive insights for continuous optimization.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiShield className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Risk & Compliance
                </h3>
                <p className="text-gray-600">
                  Enterprise-grade security protocols, regulatory compliance, and comprehensive risk mitigation strategies.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HiOutlineSparkles className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  AI Optimization
                </h3>
                <p className="text-gray-600">
                  Machine learning algorithms for predictive planning, resource optimization, and automated workflow enhancement.
                </p>
              </div>
            </div>
          </div>
        </section >

        {/* Professional Footer */}
        < footer className="bg-gray-900 text-white py-16 px-6" >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="text-2xl font-bold mb-4 tracking-tight">AI<span className="text-blue-400">VENT</span></div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Enterprise-grade event management platform providing strategic planning, execution, and analytics for global organizations.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-200 mb-6 tracking-wide">SOLUTIONS</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><Link to="/enterprise" className="hover:text-white transition-colors">Enterprise Events</Link></li>
                  <li><Link to="/conferences" className="hover:text-white transition-colors">Conference Management</Link></li>
                  <li><Link to="/board-meetings" className="hover:text-white transition-colors">Executive Meetings</Link></li>
                  <li><Link to="/virtual-events" className="hover:text-white transition-colors">Virtual Events</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-200 mb-6 tracking-wide">RESOURCES</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link to="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                  <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                  <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-200 mb-6 tracking-wide">COMPANY</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/legal" className="hover:text-white transition-colors">Legal</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} AIVENT Enterprise Solutions. All rights reserved.</p>
              <div className="mt-4 flex justify-center gap-8">
                <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
                <Link to="/gdpr" className="hover:text-gray-300 transition-colors">GDPR</Link>
              </div>
            </div>
          </div>
        </footer >
      </div >

      {/* Enhanced Categories Modal */}
      {
        showCategoriesModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Service Categories
                    </h3>
                    <p className="text-gray-600">
                      Select additional service requirements for your event
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCategoriesModal(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {categoriesLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading categories...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-8 max-h-[50vh] overflow-y-auto p-2">
                      {categories?.map((category) => (
                        <button
                          key={category.id}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedCategories.includes(category.id)
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {category.name}
                            </span>
                            {selectedCategories.includes(category.id) && (
                              <FiCheck className="w-5 h-5" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${selectedCategories.includes(category.id) ? "text-gray-300" : "text-gray-500"}`}>
                            {category.vendorCount} vendors available
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        {selectedCategories.length} categories selected
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowCategoriesModal(false)}
                          className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleGeneratePlan}
                          className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          Continue to Plan
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div >
  );
} 