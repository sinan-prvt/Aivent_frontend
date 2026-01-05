import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../api/catalog.api';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useCategories } from '../../../user/hooks/useCategories';
import { FiSave, FiImage, FiX, FiCheck, FiPlus } from 'react-icons/fi';
import { getMediaUrl } from '@/core/utils/media';

export default function MenuEditor({ menu, onSave, onCancel }) {
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const { data: categories } = useCategories();

    const [name, setName] = useState(menu?.name || '');
    const [price, setPrice] = useState(menu?.price || '');
    const [description, setDescription] = useState('');
    const [menuType, setMenuType] = useState('main');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(menu?.image || null);
    const [isAvailable, setIsAvailable] = useState(menu?.is_available ?? true);
    const [categoryId, setCategoryId] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Initialize from existing menu metadata
    useEffect(() => {
        if (menu?.description) {
            try {
                const meta = JSON.parse(menu.description);
                setMenuType(meta.menuType || 'main');
                // Extract description and price from the single item in sections
                const section = meta.sections?.[meta.menuType || 'main'];
                if (section && section.length > 0) {
                    setDescription(section[0].desc || '');
                    if (!price) setPrice(section[0].price || '');
                }
            } catch (e) {
                setDescription(menu.description);
            }
        }
    }, [menu, price]);

    // Auto-select Catering category
    useEffect(() => {
        if (categories && categories.length > 0) {
            const catering = categories.find(c => c.name.toLowerCase().includes('catering'));
            setCategoryId(catering ? catering.id : categories[0].id);
        }
    }, [categories]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (stayOnPage = false) => {
        if (!name || !categoryId) {
            alert("Please provide at least a name.");
            return;
        }

        const productData = new FormData();
        productData.append('name', name);
        productData.append('price', price || '0');
        productData.append('category', categoryId);
        productData.append('is_available', isAvailable ? 'true' : 'false');

        if (image) {
            productData.append('image', image);
        }

        // Maintain the sections structure for backward/frontend compatibility
        // but it only contains one item (this dish)
        const metaData = {
            type: 'menu',
            menuType: menuType,
            sections: {
                [menuType]: [{
                    id: Date.now(),
                    name: name,
                    desc: description,
                    price: price,
                    image: null // Will be handled by the product image
                }]
            }
        };
        productData.append('description', JSON.stringify(metaData));

        const mutationTrigger = menu?.id ? updateMutation : createMutation;

        mutationTrigger.mutate(menu?.id ? { id: menu.id, data: productData } : productData, {
            onSuccess: () => {
                if (stayOnPage) {
                    // Reset form for next item
                    setName('');
                    setPrice('');
                    setDescription('');
                    setImage(null);
                    setImagePreview(null);
                } else {
                    onSave();
                }
            },
            onError: (err) => {
                console.error("Failed to save item", err);
                alert("Failed to save. Please try again.");
            }
        });
    };

    const isSaving = createMutation.isPending || updateMutation.isPending || isUploading;

    return (
        <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{menu?.id ? 'Edit Dish' : 'Add New Dish'}</h1>
                    <p className="text-gray-500 text-sm mt-1">Add details for an individual catering item.</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FiX size={24} className="text-gray-400" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Image Upload */}
                <div className="flex justify-center">
                    <div className="w-48 h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group hover:border-indigo-500 transition-colors">
                        {imagePreview ? (
                            <img src={getMediaUrl(imagePreview)} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <FiImage className="mx-auto text-gray-300 mb-2" size={32} />
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Add Photo</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Grilled Salmon with Asparagus"
                            className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Course Section</label>
                        <select
                            value={menuType}
                            onChange={(e) => setMenuType(e.target.value)}
                            className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium bg-white text-sm"
                        >
                            <option value="starters">Starters</option>
                            <option value="main">Main Course</option>
                            <option value="dessert">Desserts</option>
                            <option value="beverages">Beverages</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 h-[58px] mt-[28px]">
                        <input
                            type="checkbox"
                            id="is_available"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="is_available" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                            Available for Bookings
                        </label>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            placeholder="Describe ingredients, preparation, or serving style..."
                            className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        ></textarea>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        <FiSave /> {isSaving ? 'Saving...' : 'Save and Close'}
                    </button>
                    {!menu?.id && (
                        <button
                            onClick={() => handleSave(true)}
                            disabled={isSaving}
                            className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            <FiPlus /> Save & Add Another
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
