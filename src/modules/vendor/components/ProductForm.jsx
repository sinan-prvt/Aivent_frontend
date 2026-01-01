
import React, { useState, useEffect } from "react";
// Assuming we might have a generic Button/Input, but using HTML for speed/no-deps
// We need categories for the dropdown. Pass them in or fetch them?
// Generally better to pass them in or use the hook inside.
import { useCategories } from "../../user/hooks/useCategories";

const ProductForm = ({ initialData, onSubmit, isSubmitting }) => {
    const { data: categories } = useCategories();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        is_available: true,
        image: null,
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price || "",
                category: initialData.category?.id || initialData.category || "",
                is_available: initialData.is_available ?? true,
                image: null, // Keep image null unless changing
            });
            if (initialData.image) {
                setPreview(initialData.image);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category); // Assuming ID
        data.append("is_available", formData.is_available);
        if (formData.image) {
            data.append("image", formData.image);
        }
        onSubmit(data);
    };

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
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    >
                        <option value="">Select a Category</option>
                        {categories?.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                            />
                        </div>
                        {preview && (
                            <div className="h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
                                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>
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
