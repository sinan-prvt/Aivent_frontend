
import React, { useState } from 'react';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useCreateProduct } from '../../../hooks/useCreateProduct'; // Correct path

export default function AddServiceModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Sound Services', // Default category
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const mutation = useCreateProduct();

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare FormData for upload (since we have an image)
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', '5'); // Sound Category ID
        data.append('stock', '100'); // Default stock for services

        // We add a special tag to description to identify it as a Service vs Equipment if needed, 
        // but for now we treats all "Sound" products as Services based on user request.

        if (formData.image) {
            data.append('image', formData.image);
        }

        mutation.mutate(data, {
            onSuccess: () => {
                onClose();
                setFormData({ name: '', price: '', description: '', category: 'Sound Services', image: null });
                setPreviewUrl(null);
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Add New Service</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><FiX /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Service Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition relative group">
                            {previewUrl ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setFormData({ ...formData, image: null }); setPreviewUrl(null); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block py-8">
                                    <FiUpload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                                    <span className="text-sm text-gray-500 font-medium">Click to upload cover image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <input
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="e.g. Wedding DJ Package"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
                        <input
                            required
                            type="number"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="e.g. 15000"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                            placeholder="Describe what's included..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 mt-2"
                    >
                        {mutation.isPending ? 'Saving...' : 'Create Service'}
                    </button>
                </form>
            </div>
        </div>
    );
}
