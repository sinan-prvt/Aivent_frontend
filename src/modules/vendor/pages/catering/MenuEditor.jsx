import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiSave, FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useCategories } from '../../../user/hooks/useCategories';

export default function MenuEditor({ menu, onSave, onCancel }) {
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const { data: categories } = useCategories();

    const [name, setName] = useState(menu?.name || 'Untitled Menu');
    const [activeTab, setActiveTab] = useState('starters');
    const [categoryId, setCategoryId] = useState('');

    // Auto-select Catering category
    useEffect(() => {
        if (categories && categories.length > 0) {
            const catering = categories.find(c => c.name.toLowerCase().includes('catering'));
            setCategoryId(catering ? catering.id : categories[0].id);
        }
    }, [categories]);

    // Structure: { starters: [{name, desc, price}], main: [], ... }
    const [sections, setSections] = useState(menu?.sections || {
        starters: [],
        main: [],
        dessert: [],
        beverages: []
    });

    const tabs = [
        { id: 'starters', label: 'Starters' },
        { id: 'main', label: 'Main Course' },
        { id: 'dessert', label: 'Desserts' },
        { id: 'beverages', label: 'Beverages' }
    ];

    const [newItem, setNewItem] = useState({ name: '', desc: '', price: '' });

    const handleAddItem = () => {
        if (!newItem.name) return;
        setSections(prev => ({
            ...prev,
            [activeTab]: [...prev[activeTab], { ...newItem, id: Date.now() }]
        }));
        setNewItem({ name: '', desc: '', price: '' });
    };

    const handleRemoveItem = (section, id) => {
        setSections(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const handleSave = () => {
        const productData = new FormData();
        productData.append('name', name);
        productData.append('price', '0'); // Menus might not have a base price, or it's sum of items. Set 0 for now.
        productData.append('category', categoryId);
        productData.append('is_available', 'true');

        // Store structured data in description
        const metaData = {
            type: 'menu',
            sections: sections
        };
        productData.append('description', JSON.stringify(metaData));

        if (menu?.id) {
            updateMutation.mutate({ id: menu.id, data: productData }, { onSuccess: onSave });
        } else {
            createMutation.mutate(productData, { onSuccess: onSave });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 placeholder-gray-300"
                            placeholder="Menu Name"
                        />
                        <p className="text-gray-500 text-sm">Define your menu courses and items.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                >
                    <FiSave /> {isSaving ? 'Saving...' : 'Save Menu'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 font-medium text-gray-700">Courses</div>
                        <nav className="p-2 space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${activeTab === tab.id
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                    <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-400 border border-gray-100">
                                        {sections[tab.id]?.length || 0}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Add Item Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Add Item to {tabs.find(t => t.id === activeTab)?.label}</h3>
                        <div className="grid md:grid-cols-12 gap-4 items-start">
                            <div className="md:col-span-4">
                                <input
                                    type="text"
                                    placeholder="Item Name (e.g. Bruschetta)"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="md:col-span-5">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={newItem.desc}
                                    onChange={e => setNewItem({ ...newItem, desc: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Price"
                                    value={newItem.price}
                                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <button
                                    onClick={handleAddItem}
                                    disabled={!newItem.name}
                                    className="w-full h-[38px] bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4">
                        {sections[activeTab]?.length > 0 ? (
                            sections[activeTab].map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-gray-900">{item.price}</span>
                                        <button
                                            onClick={() => handleRemoveItem(activeTab, item.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No items added to {tabs.find(t => t.id === activeTab)?.label} yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
