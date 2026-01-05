import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiUpload, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useVendorProducts } from '../../hooks/useVendorProducts';
import { useCategories } from '../../../user/hooks/useCategories';
import { getMediaUrl } from '@/core/utils/media';

export default function CateringPackageForm({ onClose, onSuccess, initialData }) {
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const mutation = initialData ? updateMutation : createMutation;
    const { data: products } = useVendorProducts();
    const { data: categories } = useCategories();

    // Filter for Menus by their categories
    const menus = products?.filter(p => {
        try { return JSON.parse(p.description).type === 'menu'; } catch (e) { return false; }
    }) || [];

    const getMenusByType = (type) => {
        return menus.filter(m => {
            try {
                const meta = JSON.parse(m.description);
                // Include if it's a direct match OR if it's a legacy menu (no menuType)
                return meta.menuType === type || !meta.menuType || meta.menuType === 'full';
            } catch (e) {
                // Treat non-JSON or parsing errors as potential legacy full menus
                return true;
            }
        });
    };

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        price: initialData?.price || '',
        description: '',
        features: [''],
        image: null,
        linkedMenuId: '', // Legacy support
        menuSelections: {
            starters: [],
            main: [],
            dessert: [],
            beverages: []
        },
        categoryId: initialData?.category?.id || initialData?.category || ''
    });
    const [preview, setPreview] = useState(initialData?.image || null);

    // Initialize from initialData (description JSON)
    useEffect(() => {
        if (initialData?.description) {
            try {
                const meta = JSON.parse(initialData.description);
                if (meta.type === 'package') {
                    setFormData(prev => ({
                        ...prev,
                        description: meta.description || '',
                        features: meta.features?.length ? meta.features : [''],
                        linkedMenuId: meta.linkedMenuId || '',
                        menuSelections: meta.menuSelections || {
                            starters: meta.linkedMenuId ? [meta.linkedMenuId] : [], // Migration support
                            main: [],
                            dessert: [],
                            beverages: []
                        }
                    }));
                }
            } catch (e) {
                setFormData(prev => ({ ...prev, description: initialData.description }));
            }
        }
    }, [initialData]);

    // Auto-select Catering category
    useEffect(() => {
        if (categories && categories.length > 0) {
            const catering = categories.find(c => c.name.toLowerCase().includes('catering'));
            setFormData(prev => ({
                ...prev,
                categoryId: catering ? catering.id : categories[0].id
            }));
        }
    }, [categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const toggleMenuSelection = (course, id) => {
        setFormData(prev => {
            const current = prev.menuSelections[course] || [];
            const updated = current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id];
            return {
                ...prev,
                menuSelections: { ...prev.menuSelections, [course]: updated }
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Combine logic: Store structure in description as JSON for parsing
        const metaData = {
            type: 'package',
            description: formData.description,
            features: formData.features.filter(f => f.trim() !== ''),
            menuSelections: formData.menuSelections,
            linkedMenuId: formData.menuSelections.main || formData.linkedMenuId || ''
        };

        console.log("Saving Package MetaData:", metaData);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', JSON.stringify(metaData));
        data.append('price', formData.price);
        data.append('category', formData.categoryId);
        data.append('is_available', 'true');
        if (formData.image) {
            data.append('image', formData.image);
        }

        if (initialData) {
            mutation.mutate({ id: initialData.id, data: data }, {
                onSuccess: () => {
                    onSuccess();
                    onClose();
                }
            });
        } else {
            mutation.mutate(data, {
                onSuccess: () => {
                    onSuccess();
                    onClose();
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 backdrop-blur-sm z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create Catering Package</h2>
                        <p className="text-sm text-gray-500">Add a new service package to your catalog.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiX size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Package Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Premium Wedding Buffet"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Price per Person (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="col-span-2 space-y-6">
                            <label className="block text-sm font-bold text-gray-700">Compose Menu</label>
                            <div className="grid md:grid-cols-2 gap-6">
                                {['starters', 'main', 'dessert', 'beverages'].map(course => (
                                    <div key={course} className="space-y-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {course === 'main' ? 'Main Course' : course}
                                        </label>
                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                            {getMenusByType(course).length === 0 ? (
                                                <p className="text-xs text-gray-400 py-2">No {course} items found.</p>
                                            ) : (
                                                getMenusByType(course).map(menu => (
                                                    <label
                                                        key={menu.id}
                                                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${formData.menuSelections[course]?.includes(menu.id)
                                                            ? 'bg-teal-50 text-teal-700'
                                                            : 'hover:bg-white'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                            checked={formData.menuSelections[course]?.includes(menu.id)}
                                                            onChange={() => toggleMenuSelection(course, menu.id)}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold truncate">{menu.name}</p>
                                                            {menu.price > 0 && <p className="text-[10px] opacity-70">₹{menu.price}</p>}
                                                        </div>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Describe what makes this package special..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                            required
                        ></textarea>
                    </div>

                    {/* Features Builder */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Package Features</label>
                        <div className="space-y-3">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder="e.g. Live Cooking Station"
                                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    />
                                    {formData.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2"
                            >
                                <FiPlus /> Add another feature
                            </button>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Package Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-teal-500 hover:bg-teal-50/10 transition-colors cursor-pointer relative overflow-hidden group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {preview ? (
                                <img src={getMediaUrl(preview)} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <div className="p-3 bg-gray-100 rounded-full group-hover:scale-110 transition-transform">
                                        <FiUpload className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-medium">Click to upload image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-8 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {mutation.isPending ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Package')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
