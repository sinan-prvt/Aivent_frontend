import React, { useState, useEffect } from "react";
import { useVendorProfile } from "../hooks/useVendorProfile";
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase,
    FiCreditCard, FiCheckCircle, FiSave, FiAlertCircle,
    FiGlobe, FiFileText, FiLock, FiUpload
} from "react-icons/fi";
import { fetchCategories } from "../api/vendor.api";

const VendorProfile = () => {
    const { profile, loading, saveProfile, saving } = useVendorProfile();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        business_name: "",
        contact_person: "",
        category_id: "",
        phone: "",
        email: "",
        address: "",
        gst_number: "",
        business_type: "",
        bank_account_number: "",
        bank_ifsc: ""
    });
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchCategories().then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (profile) {
            setForm({
                business_name: profile.business_name || "",
                contact_person: profile.contact_person || "",
                category_id: profile.category_id || "",
                phone: profile.phone || "",
                email: profile.email || "",
                address: profile.address || "",
                gst_number: profile.gst_number || "",
                business_type: profile.business_type || "individual",
                bank_account_number: profile.bank_account_number || "",
                bank_ifsc: profile.bank_ifsc || ""
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveProfile(form);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update profile. Please try again." });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Business Profile</h1>
                            <p className="text-gray-600 mt-2">Manage your business information, legal details, and banking information</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                <FiBriefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Vendor ID</p>
                                <p className="font-mono font-semibold text-gray-900">VND-{profile?.id?.toString().padStart(6, '0') || '000000'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-8 p-4 rounded-xl border-l-4 ${message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"} shadow-sm`}>
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                                {message.type === "success" ? <FiCheckCircle className="w-6 h-6" /> : <FiAlertCircle className="w-6 h-6" />}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
                                    {message.text}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600">Profile Completeness</span>
                                        <span className="text-sm font-semibold text-blue-600">85%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Business Info', completed: true },
                                        { label: 'Contact Details', completed: true },
                                        { label: 'Legal Documents', completed: false },
                                        { label: 'Banking Details', completed: true }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-3 ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className="text-sm text-gray-700">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                            <FiUpload className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Upload Documents</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                                            <FiFileText className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">View Reports</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                            <FiLock className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Security Settings</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Business Details Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                            <FiBriefcase className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                                            <p className="text-sm text-gray-500">Your primary business details</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Business Name *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiBriefcase className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    name="business_name"
                                                    value={form.business_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter business name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Category *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiGlobe className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    name="category_id"
                                                    value={form.category_id}
                                                    onChange={handleChange}
                                                    required
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Contact Person *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiUser className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    name="contact_person"
                                                    value={form.contact_person}
                                                    onChange={handleChange}
                                                    required
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Full name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Business Type *
                                            </label>
                                            <select
                                                name="business_type"
                                                value={form.business_type}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            >
                                                <option value="individual">Individual/Sole Proprietorship</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="private_limited">Private Limited Company</option>
                                                <option value="llc">LLC</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                                            <FiMapPin className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Contact & Location</h3>
                                            <p className="text-sm text-gray-500">Where customers can reach you</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiPhone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Business Email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiMail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={form.email}
                                                    readOnly
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">Account email cannot be changed</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Business Address *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3">
                                                <FiMapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <textarea
                                                name="address"
                                                value={form.address}
                                                onChange={handleChange}
                                                required
                                                rows="3"
                                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                                placeholder="Enter complete business address"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legal & Banking Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                            <FiCreditCard className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Legal & Banking Details</h3>
                                            <p className="text-sm text-gray-500">For payments and compliance</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                GST Number
                                            </label>
                                            <input
                                                name="gst_number"
                                                value={form.gst_number}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase font-mono tracking-wider"
                                                placeholder="27AAAAA0000A1Z5"
                                                maxLength="15"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Business Type (for Banking)
                                            </label>
                                            <select className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                                <option>Current Account</option>
                                                <option>Savings Account</option>
                                                <option>Business Account</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Bank Account Number *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiCreditCard className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    name="bank_account_number"
                                                    value={form.bank_account_number}
                                                    onChange={handleChange}
                                                    required
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                                                    placeholder="000000000000"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Bank IFSC Code *
                                            </label>
                                            <input
                                                name="bank_ifsc"
                                                value={form.bank_ifsc}
                                                onChange={handleChange}
                                                required
                                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase font-mono tracking-wider"
                                                placeholder="SBIN0001234"
                                                maxLength="11"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="flex items-start">
                                            <FiAlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                                            <p className="text-sm text-blue-700">
                                                Your banking information is encrypted and stored securely. We use bank-level security protocols to protect your data.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;