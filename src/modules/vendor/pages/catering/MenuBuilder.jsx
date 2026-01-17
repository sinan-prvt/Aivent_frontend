import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiFilter, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';
import { useVendorProducts } from '../../hooks/useVendorProducts';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useDeleteProduct } from '../../hooks/useDeleteProduct';
import MenuEditor from './MenuEditor';
import { getMediaUrl } from '@/core/utils/media';
import Pagination from '@/components/ui/Pagination';

export default function MenuBuilder() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: productsData, isLoading, refetch } = useVendorProducts(currentPage);
    const products = productsData?.results || [];
    const totalCount = productsData?.count || 0;
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [courseFilter, setCourseFilter] = useState('all');

    // Filter for dishes/menus
    const allDishes = products?.filter(p => {
        try {
            const meta = JSON.parse(p.description);
            return meta.type === 'menu';
        } catch (e) {
            return false;
        }
    }) || [];

    const filteredDishes = allDishes.filter(dish => {
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
        let dishType = 'main';
        try {
            dishType = JSON.parse(dish.description).menuType || 'main';
        } catch (e) { }
        const matchesFilter = courseFilter === 'all' || dishType === courseFilter;
        return matchesSearch && matchesFilter;
    });

    const handleCreateNew = () => {
        setSelectedMenu(null);
        setIsEditing(true);
    };

    const handleEdit = (menu) => {
        try {
            const meta = JSON.parse(menu.description);
            setSelectedMenu({ ...menu, sections: meta.sections, menuType: meta.menuType });
            setIsEditing(true);
        } catch (e) {
            console.error("Failed to parse menu data", e);
        }
    };

    const handleToggleAvailability = (dish) => {
        const newStatus = !dish.is_available;
        updateMutation.mutate({
            id: dish.id,
            data: { is_available: newStatus }
        }, {
            onSuccess: () => refetch()
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this dish?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => refetch()
            });
        }
    };

    if (isEditing) {
        return (
            <MenuEditor
                menu={selectedMenu}
                onSave={() => {
                    setIsEditing(false);
                    refetch();
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium italic">Preparing your menu library...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <span>Catalogue</span> / <span className="text-indigo-600">Menu Builder</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dish Library</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage individual items and their availability.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-gray-200 transition-all active:scale-95"
                >
                    <FiPlus size={20} /> Add New Dish
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search dishes by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm appearance-none font-medium cursor-pointer"
                        >
                            <option value="all">All Courses</option>
                            <option value="starters">Starters</option>
                            <option value="main">Main Course</option>
                            <option value="dessert">Desserts</option>
                            <option value="beverages">Beverages</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Layout */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 italic">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Dish Item</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Course Type</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDishes.length > 0 ? (
                                filteredDishes.map((dish) => {
                                    let meta = {};
                                    try { meta = JSON.parse(dish.description); } catch (e) { }

                                    const courseColors = {
                                        starters: 'bg-amber-100 text-amber-700',
                                        main: 'bg-indigo-100 text-indigo-700',
                                        dessert: 'bg-rose-100 text-rose-700',
                                        beverages: 'bg-teal-100 text-teal-700'
                                    };

                                    return (
                                        <tr key={dish.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                                                        <img
                                                            src={getMediaUrl(dish.image)}
                                                            alt={dish.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{dish.name}</p>
                                                        <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px] mt-0.5 italic">
                                                            {meta.sections?.[meta.menuType]?.[0]?.desc || 'Individual catering item'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${courseColors[meta.menuType] || 'bg-gray-100 text-gray-700'}`}>
                                                    {meta.menuType === 'main' ? 'Main Course' : (meta.menuType || 'Item')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-gray-900">₹{dish.price}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleToggleAvailability(dish)}
                                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${dish.is_available
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {dish.is_available ? <FiCheckCircle /> : <FiXCircle />}
                                                        {dish.is_available ? 'Available' : 'Hidden'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(dish)}
                                                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                        title="Edit Dish"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(dish.id)}
                                                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete Dish"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                <FiFilter className="text-gray-300" size={24} />
                                            </div>
                                            <h3 className="text-gray-900 font-bold">No dishes found</h3>
                                            <p className="text-gray-400 text-sm mt-1 mb-6 italic">Try adjusting your filters or search terms.</p>
                                            <button
                                                onClick={handleCreateNew}
                                                className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-2 justify-center mx-auto"
                                            >
                                                <FiPlus /> Add first dish
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalCount > 10 && (
                    <div className="p-6 border-t border-gray-100 flex justify-center">
                        <Pagination
                            count={totalCount}
                            pageSize={10}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Dishes</p>
                        <p className="text-2xl font-black text-gray-900">{allDishes.length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Active</p>
                        <p className="text-2xl font-black text-green-600">{allDishes.filter(d => d.is_available).length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Starters</p>
                        <p className="text-2xl font-black text-amber-600">{allDishes.filter(d => { try { return JSON.parse(d.description).menuType === 'starters' } catch (e) { return false } }).length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Main Courses</p>
                        <p className="text-2xl font-black text-indigo-600">{allDishes.filter(d => { try { return JSON.parse(d.description).menuType === 'main' } catch (e) { return false } }).length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
