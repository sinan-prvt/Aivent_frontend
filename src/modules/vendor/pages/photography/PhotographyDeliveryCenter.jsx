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
  Loader2
} from "lucide-react";
import { fetchDeliveries, createDelivery } from "../../api/photography.api";
import { useAuth } from "@/app/providers/AuthProvider";

export default function PhotographyDeliveryCenter() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Delivery Form
  const [formData, setFormData] = useState({
    client_name: "",
    event_type: "",
    delivery_date: "",
    status: "draft"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const res = await fetchDeliveries();
      setDeliveries(res.data);
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
      await createDelivery(formData);
      setIsModalOpen(false);
      setFormData({ client_name: "", event_type: "", delivery_date: "", status: "draft" });
      loadDeliveries();
    } catch (error) {
      console.error("Failed to create delivery", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'uploading': return 'bg-blue-50 text-blue-700 border-blue-100';
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
                    <img
                      src={item.thumbnail || "https://via.placeholder.com/150"}
                      alt={item.client_name}
                      className="w-24 h-32 object-cover rounded-lg bg-gray-100"
                    />

                    {/* Content */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.event_type}</p>
                            <h3 className="text-lg font-bold text-gray-900">{item.client_name}</h3>
                          </div>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                            {item.status === 'delivered' && <CheckCircle size={14} />}
                            {item.status === 'uploading' && <UploadCloud size={14} className="animate-bounce" />}
                            {item.status === 'draft' && <Clock size={14} />}
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
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 text-sm font-medium text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors">View Progress</button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><MoreHorizontal size={20} /></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 text-sm font-medium text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors border border-blue-100">View Details</button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100"><MoreHorizontal size={20} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600">Drafts</span>
                </div>
                <span className="font-semibold text-gray-900">{deliveries.filter(d => d.status === 'draft').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Need More Storage?</h3>
            <p className="text-blue-100 text-sm mb-4">You've used 85% of your 1TB cloud storage plan.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm">Upgrade Plan</button>
          </div>
        </div>
      </div>

      {/* Create Delivery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Create New Delivery</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  value={formData.client_name}
                  onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Wedding, Corporate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  value={formData.event_type}
                  onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  value={formData.delivery_date}
                  onChange={e => setFormData({ ...formData, delivery_date: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  Create Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
