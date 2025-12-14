// src/modules/dashboard/admin/components/users/UserDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { fetchUserDetails, updateUser } from "../../api/adminApi";
import {
  Mail,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
  UserCheck,
  Calendar,
  Clock
} from "lucide-react";

export default function UserDetailsModal({ userId, isOpen, onClose, onUserUpdated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoading(true);
    fetchUserDetails(userId)
      .then((d) => {
        if (!mounted) return;
        setUser(d);
        setForm({
          username: d.username || "",
          email: d.email || "",
          role: d.role || "user",
          email_verified: !!d.email_verified,
          vendor_approved: !!d.vendor_approved,
          is_active: d.is_active !== false
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user details", err);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [isOpen, userId]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await updateUser(userId, form);
      onUserUpdated();
      setEdit(false);
      onClose();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-600";
      case "vendor": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container - Compact and centered */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getRoleColor(user?.role || 'user')}`}></div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {edit ? "Edit User" : "User Details"}
                </h2>
                <p className="text-sm text-gray-500">ID: {userId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Content - No scrolling */}
        <div className="p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Username</span>
                  </div>
                  {edit ? (
                    <input
                      name="username"
                      value={form.username}
                      onChange={onChange}
                      className="w-48 px-3 py-1 border rounded-md text-sm"
                      placeholder="Username"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 font-medium">{user?.username || "—"}</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Email</span>
                  </div>
                  {edit ? (
                    <input
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      className="w-48 px-3 py-1 border rounded-md text-sm"
                      placeholder="Email"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 font-medium">{user?.email || "—"}</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Role</span>
                  </div>
                  {edit ? (
                    <select
                      name="role"
                      value={form.role}
                      onChange={onChange}
                      className="w-48 px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user?.role).replace('600', '100')} ${getRoleColor(user?.role).replace('600', '800')}`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Account Status
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {form.email_verified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-700">Email Verified</span>
                    </div>
                    {edit ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="email_verified"
                          checked={form.email_verified}
                          onChange={onChange}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${form.email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {form.email_verified ? 'Yes' : 'No'}
                      </span>
                    )}
                  </div>

                  {user?.role === "vendor" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {form.vendor_approved ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm text-gray-700">Vendor Approved</span>
                      </div>
                      {edit ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="vendor_approved"
                            checked={form.vendor_approved}
                            onChange={onChange}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${form.vendor_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {form.vendor_approved ? 'Approved' : 'Pending'}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {form.is_active ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-700">Account Active</span>
                    </div>
                    {edit ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={form.is_active}
                          onChange={onChange}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${form.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {form.is_active ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div className="border-t pt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(user?.date_joined || user?.created_at).toLocaleDateString()}</span>
                  </div>
                  {/* <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Last login: {user?.last_login || user?.lastLoginAt ? new Date(user?.last_login || user?.lastLoginAt).toLocaleDateString() : 'Never'}</span>
                  </div> */}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          {edit ? (
            <>
              <button
                onClick={() => setEdit(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEdit(true)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-1.5" />
                Edit
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 