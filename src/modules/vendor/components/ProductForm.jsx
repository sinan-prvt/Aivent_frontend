
import React, { useState, useEffect } from "react";
// Assuming we might have a generic Button/Input, but using HTML for speed/no-deps
// We need categories for the dropdown. Pass them in or fetch them?
// Generally better to pass them in or use the hook inside.
import { useCategories } from "../../user/hooks/useCategories";
import { getMediaUrl } from "@/core/utils/media";

const ProductForm = ({ initialData, onSubmit, isSubmitting, vendorCategory }) => {
    const { data: categories } = useCategories();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        categoryName: "",
        is_available: true,
        stock: 1,
        images: [],
    });
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price || "",
                category: initialData.category?.id || initialData.category || "",
                categoryName: "Wedding", // Default to Wedding for UI if editing existing item (since generic maps to single ID)
                is_available: initialData.is_available ?? true,
                stock: initialData.stock || 1,
                images: [],
            });
            if (initialData.images && Array.isArray(initialData.images)) {
                setPreviews(initialData.images);
            } else if (initialData.image) {
                setPreviews([initialData.image]);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "category" && vendorCategory === "decoration") {
            // value here is the Name (e.g. "Floral")
            const id = getCategoryIdByName(value) || getCategoryIdByName("Decoration") || "2";
            setFormData((prev) => ({
                ...prev,
                category: id,
                categoryName: value
            }));
        } else if (name === "category" && vendorCategory === "lighting") {
            // value here is the Name (e.g. "LED & Pixel Lights")
            const id = getCategoryIdByName(value) || getCategoryIdByName("Lighting") || "3";
            setFormData((prev) => ({
                ...prev,
                category: id,
                categoryName: value
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...files]
            }));

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("is_available", formData.is_available);
        data.append("stock", formData.stock);

        // Append the first image as the main 'image' field for the backend
        if (formData.images.length > 0) {
            data.append("image", formData.images[0]);
        }

        // Append all images as 'images' (legacy/future support)
        formData.images.forEach((image) => {
            data.append("images", image);
        });

        onSubmit(data);
    };

    // Helper to find category ID by name
    const getCategoryIdByName = (name) => {
        if (!categories) return "";
        const cat = categories.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
        return cat ? cat.id : "";
    };

    // Requested Decoration Categories
    const decorCategories = [
        "Wedding",
        "Floral",
        "Theme",
        "Mandap",
        "Table"
    ];

    // Lighting & Effects Categories
    const lightingCategories = [
        "Decorative Lighting",
        "LED & Pixel Lights",
        "Laser & Special Effects",
        "Fireworks & Cold Pyro",
        "PA System & Speakers",
        "DJ Equipment",
        "Fog & Haze Machines"
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        required
                        value={formData.stock}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        required
                        value={(vendorCategory === "decoration" || vendorCategory === "lighting") ? formData.categoryName : formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    >
                        <option value="">Select a Category</option>
                        {vendorCategory === "decoration" ? (
                            // Decoration Specific Options
                            decorCategories.map((name) => {
                                return (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                );
                            })
                        ) : vendorCategory === "lighting" ? (
                            // Lighting & Effects Specific Options
                            lightingCategories.map((name) => {
                                return (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                );
                            })
                        ) : (
                            // Standard Categories
                            categories?.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))
                        )}
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {previews.map((src, index) => (
                            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                                <img src={src} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="mt-2 text-[10px] font-bold text-gray-500 uppercase">Add More</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        {(vendorCategory === "decoration" || vendorCategory === "lighting") ? "First image will be used as the main cover." : ""}
                    </p>
                </div>

                <div className="col-span-2">
                    <div className="flex items-center">
                        <input
                            id="is_available"
                            name="is_available"
                            type="checkbox"
                            checked={formData.is_available}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                            Product is available for sale
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
