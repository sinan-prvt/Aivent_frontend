import React, { useState } from "react";
import { useTechnicians } from "../../hooks/useTechnicians";
import { FiPlus, FiUser, FiPhone, FiCheckCircle, FiClock, FiAlertCircle, FiTrash2, FiEdit2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function LightingStaff() {
    const { technicians, isLoading, createTechnician, updateTechnician, deleteTechnician } = useTechnicians();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState(null);
    const [formData, setFormData] = useState({ name: "", role: "", phone: "", status: "available" });

    const handleOpenModal = (tech = null) => {
        if (tech) {
            setEditingTech(tech);
            setFormData({ name: tech.name, role: tech.role, phone: tech.phone || "", status: tech.status });
        } else {
            setEditingTech(null);
            setFormData({ name: "", role: "", phone: "", status: "available" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTech) {
                await updateTechnician({ id: editingTech.id, payload: formData });
                toast.success("Technician updated successfully");
            } else {
                await createTechnician(formData);
                toast.success("Technician added successfully");
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to save technician");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this technician?")) {
            try {
                await deleteTechnician(id);
                toast.success("Technician deleted");
            } catch (error) {
                toast.error("Failed to delete technician");
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading staff...</div>;

    const getStatusIcon = (status) => {
        switch (status) {
            case "available": return <FiCheckCircle className="text-emerald-500" />;
            case "busy": return <FiClock className="text-amber-500" />;
            case "away": return <FiAlertCircle className="text-gray-400" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-500 mt-1">Manage your lighting technicians and their availability.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200 font-semibold"
                >
                    <FiPlus className="w-5 h-5" />
                    Add Technician
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicians.map((tech) => (
                    <div key={tech.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                    <FiUser className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{tech.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{tech.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal(tech)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                    <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(tech.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <FiPhone className="w-4 h-4" />
                                <span className="text-sm">{tech.phone || "No phone provided"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusIcon(tech.status)}
                                <span className="text-sm font-medium capitalize text-gray-700">{tech.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {technicians.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                        <FiUser className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No technicians yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Add your team members here to assign them to events and manage their schedule.
                    </p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl scale-in-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingTech ? "Edit Technician" : "Add New Technician"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Role / Specialization</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Lighting Operator"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none bg-white"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="available">Available</option>
                                    <option value="busy">Busy</option>
                                    <option value="away">Away</option>
                                </select>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    {editingTech ? "Save Changes" : "Create Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
