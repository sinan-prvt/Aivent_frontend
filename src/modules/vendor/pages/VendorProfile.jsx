import React, { useState, useEffect } from "react";
import { useVendorProfile } from "../hooks/useVendorProfile";
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCreditCard, FiCheckCircle, FiSave, FiAlertCircle
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

    if (loading) return <div className="p-8 text-center">Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
                <p className="text-gray-500 mt-2">Manage your business information and banking details</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                    {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Details Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FiBriefcase className="text-indigo-600" />
                            Business Information
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Business Name</label>
                            <input
                                name="business_name"
                                value={form.business_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Contact Person</label>
                            <input
                                name="contact_person"
                                value={form.contact_person}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Business Type</label>
                            <select
                                name="business_type"
                                value={form.business_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="individual">Individual</option>
                                <option value="partnership">Partnership</option>
                                <option value="private_limited">Private Limited</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contact & Location Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FiMapPin className="text-indigo-600" />
                            Contact & Location
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Business Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-gray-50"
                                    readOnly
                                />
                                <p className="text-[10px] text-gray-400">Account email cannot be changed</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Address</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Legal & Banking Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FiCreditCard className="text-indigo-600" />
                            Legal & Banking Details
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">GST Number</label>
                            <input
                                name="gst_number"
                                value={form.gst_number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all uppercase font-mono"
                            />
                        </div>
                        <div className="hidden md:block"></div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Bank Account Number</label>
                            <input
                                name="bank_account_number"
                                value={form.bank_account_number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Bank IFSC</label>
                            <input
                                name="bank_ifsc"
                                value={form.bank_ifsc}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all uppercase font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        {saving ? "Saving..." : <><FiSave /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorProfile;
