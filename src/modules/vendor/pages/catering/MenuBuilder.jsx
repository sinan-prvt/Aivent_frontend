import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useVendorProducts } from '../../hooks/useVendorProducts';
import MenuEditor from './MenuEditor';

export default function MenuBuilder() {
    const { data: products, isLoading } = useVendorProducts();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    // Filter for products that are 'menus' (based on our JSON description convention)
    const menus = products?.filter(p => {
        try {
            const meta = JSON.parse(p.description);
            return meta.type === 'menu';
        } catch (e) {
            return false;
        }
    }) || [];

    const handleCreateNew = () => {
        setSelectedMenu(null);
        setIsEditing(true);
    };

    const handleEdit = (menu) => {
        try {
            const meta = JSON.parse(menu.description);
            setSelectedMenu({ ...menu, sections: meta.sections });
            setIsEditing(true);
        } catch (e) {
            console.error("Failed to parse menu data", e);
        }
    };

    if (isEditing) {
        return (
            <MenuEditor
                menu={selectedMenu}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading menus...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>Dashboard</span> / <span className="text-gray-900 font-medium">Menus</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Menu Builder</h1>
                    <p className="text-gray-500 text-sm mt-1">Create and manage your dining menus.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                    <FiPlus /> Create New Menu
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus.length > 0 ? (
                    menus.map(menu => {
                        let sections = {};
                        try {
                            sections = JSON.parse(menu.description).sections;
                        } catch (e) { }
                        const totalItems = Object.values(sections).flat().length;

                        return (
                            <div key={menu.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(menu)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-indigo-600">
                                            <FiEdit2 />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{menu.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{totalItems} items across {Object.keys(sections).length} courses</p>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${menu.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        Active
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No menus created yet.</p>
                        <button onClick={handleCreateNew} className="mt-2 text-indigo-600 font-bold hover:underline">Start building your first menu</button>
                    </div>
                )}
            </div>
        </div>
    );
}
