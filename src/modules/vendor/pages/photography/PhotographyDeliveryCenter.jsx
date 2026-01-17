import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  FileImage,
  Video,
  X,
  Loader2,
  Trash2,
  Edit2,
  ExternalLink,
  Image as ImageIcon,
  Calendar,
  User,
  Tag
} from "lucide-react";
import { fetchDeliveries, createDelivery, updateDelivery, deleteDelivery, uploadPackageImage } from "../../api/photography.api";
import { useAuth } from "@/app/providers/AuthProvider";
import Pagination from '@/components/ui/Pagination';

const MEDIA_BASE_URL = "http://localhost:8003";

export default function PhotographyDeliveryCenter() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Delivery Form
  const [formData, setFormData] = useState({
    client_name: "",
    event_type: "",
    delivery_date: "",
    status: "draft",
    id: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadDeliveries(currentPage);
  }, [currentPage]);

  const loadDeliveries = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await fetchDeliveries(page);
      setDeliveries(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (error) {
      console.error("Failed to load deliveries", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("client_name", formData.client_name);
      data.append("event_type", formData.event_type);

      if (formData.delivery_date) {
        data.append("delivery_date", formData.delivery_date);
      }

      data.append("status", formData.status);

      if (imageFile) {
        data.append("thumbnail", imageFile);
      }

      if (formData.id) {
        await updateDelivery(formData.id, data);
      } else {
        await createDelivery(data);
      }

      handleCloseModal();
      loadDeliveries();
    } catch (error) {
      console.error("Failed to save delivery", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ client_name: "", event_type: "", delivery_date: "", status: "draft", id: null });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      client_name: item.client_name,
      event_type: item.event_type,
      delivery_date: item.delivery_date || "",
      status: item.status,
      thumbnail: item.thumbnail
    });
    setImagePreview(item.thumbnail);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        await deleteDelivery(id);
        loadDeliveries();
      } catch (error) {
        console.error("Failed to delete delivery", error);
      }
    }
    setActiveMenu(null);
  };

  const handleViewDetails = (item) => {
    setSelectedDelivery(item);
    setIsDetailModalOpen(true);
    setActiveMenu(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'uploading': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 p-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Center</h1>
          <p className="text-gray-500 mt-1">Upload final photos/videos and generate client download links.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Create New Delivery
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main List Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by client or event name..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              All Statuses <Filter size={16} />
            </button>
          </div>

          {/* Delivery Cards */}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={30} />
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
                  No deliveries found. Create your first delivery!
                </div>
              )}
              {deliveries.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail.startsWith("http") ? item.thumbnail : `${MEDIA_BASE_URL}${item.thumbnail}`}
                        alt={item.client_name}
                        className="w-24 h-32 object-cover rounded-lg bg-gray-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 group">
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                          <FileImage size={24} className="text-gray-300" />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">No Image</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <div onClick={() => handleViewDetails(item)} className="cursor-pointer group">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 transition-colors group-hover:text-blue-500">{item.event_type}</p>
                            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">{item.client_name}</h3>
                          </div>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                            {item.status === 'delivered' && <CheckCircle size={14} />}
                            {item.status === 'uploading' && <UploadCloud size={14} className="animate-bounce" />}
                            {item.status === 'pending' && <Clock size={14} />}
                            {item.status === 'draft' && <ImageIcon size={14} />}
                            <span className="capitalize">{item.status}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Delivery Date: {item.delivery_date || 'Not set'}</p>
                      </div>

                      <div className="mt-4">
                        {item.status === 'uploading' ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-gray-600">
                              <span>Upload Progress</span>
                              <span>{item.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }}></div>
                            </div>
                            <div className="flex gap-2 mt-3 relative">
                              <button
                                onClick={() => handleViewDetails(item)}
                                className="flex-1 text-sm font-medium text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors font-bold"
                              >
                                View Progress
                              </button>
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === item.id ? null : item.id);
                                  }}
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                  <MoreHorizontal size={20} />
                                </button>
                                {activeMenu === item.id && (
                                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <button onClick={() => handleEdit(item)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-bold">
                                      <Edit2 size={16} /> Edit Details
                                    </button>
                                    <div className="h-px bg-gray-50 my-1 mx-2" />
                                    <button onClick={() => handleDelete(item.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">
                                      <Trash2 size={16} /> Delete Delivery
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-3 relative">
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="flex-1 text-sm font-medium text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors border border-blue-100 font-bold"
                            >
                              View Details
                            </button>
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(activeMenu === item.id ? null : item.id);
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100"
                              >
                                <MoreHorizontal size={20} />
                              </button>
                              {activeMenu === item.id && (
                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                  <button onClick={() => handleEdit(item)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-bold">
                                    <Edit2 size={16} /> Edit Details
                                  </button>
                                  <div className="h-px bg-gray-50 my-1 mx-2" />
                                  <button onClick={() => handleDelete(item.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">
                                    <Trash2 size={16} /> Delete Delivery
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalCount > 10 && (
            <div className="flex justify-center py-10 border-t border-gray-100 mt-6">
              <Pagination
                count={totalCount}
                pageSize={10}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* Sidebar Column (Overview) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6">Delivery Overview</h3>
            {/* Simple Donut Chart Representation */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="w-full h-full rounded-full border-[12px] border-gray-100"></div>
              <div className="absolute inset-0 w-full h-full rounded-full border-[12px] border-green-500 border-t-transparent border-l-transparent rotate-45"></div>
              <div className="absolute inset-0 w-full h-full rounded-full border-[12px] border-blue-500 border-t-transparent border-r-transparent border-b-transparent -rotate-12"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{deliveries.length}</span>
                <span className="text-xs text-gray-500">Total Deliveries</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Delivered</span>
                </div>
                <span className="font-semibold text-gray-900">{deliveries.filter(d => d.status === 'delivered').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Uploading</span>
                </div>
                <span className="font-semibold text-gray-900">{deliveries.filter(d => d.status === 'uploading').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-gray-600">Pending</span>
                </div>
                <span className="font-semibold text-gray-900">{deliveries.filter(d => d.status === 'pending').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-gray-600">Drafts</span>
              </div>
              <span className="font-semibold text-gray-900">{deliveries.filter(d => d.status === 'draft').length}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Need More Storage?</h3>
            <p className="text-blue-100 text-sm mb-4">You've used 85% of your 1TB cloud storage plan.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm">Upgrade Plan</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative h-64 bg-gray-100">
              {selectedDelivery.thumbnail ? (
                <img
                  src={selectedDelivery.thumbnail.startsWith("http") ? selectedDelivery.thumbnail : `${MEDIA_BASE_URL}${selectedDelivery.thumbnail}`}
                  className="w-full h-full object-cover"
                  alt={selectedDelivery.client_name}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                  <FileImage size={64} className="mb-2 opacity-20" />
                  <span className="text-sm font-medium uppercase tracking-widest">No Cover Image</span>
                </div>
              )}
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">{selectedDelivery.event_type}</p>
                <h2 className="text-3xl font-bold">{selectedDelivery.client_name}</h2>
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Date</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedDelivery.delivery_date || 'Not scheduled'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                    <Tag size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 text-sm font-bold rounded-full border ${getStatusColor(selectedDelivery.status)}`}>
                      <span className="capitalize">{selectedDelivery.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-gray-900">Delivery Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
                    <ExternalLink size={18} /> Generate Link
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleEdit(selectedDelivery);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 rounded-xl font-bold transition-all"
                  >
                    <Edit2 size={18} /> Modify Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Modify Delivery' : 'New Delivery'}</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Image Upload Option */}
              <div className="flex justify-center">
                <div className="relative group">
                  <input
                    type="file"
                    id="delivery_image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="delivery_image"
                    className="cursor-pointer block w-32 h-44 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-blue-400 overflow-hidden relative transition-all"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Preview</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="text-white" size={24} />
                    </div>
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Client Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      required
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={formData.client_name}
                      placeholder="Enter client's full name"
                      onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Event Type</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Wedding"
                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.event_type}
                    onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Delivery Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.delivery_date}
                    onChange={e => setFormData({ ...formData, delivery_date: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Delivery Status</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer text-sm font-medium"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="draft">Draft (Preparing)</option>
                    <option value="pending">Pending (Waiting for client)</option>
                    <option value="uploading">Uploading (In progress)</option>
                    <option value="delivered">Delivered (Finalized)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  {formData.id ? 'Update Delivery' : 'Create Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
