// src/modules/dashboard/admin/components/users/UserDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { fetchUserDetails, updateUser } from "../../api/adminApi";

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
        });
      })
      .catch((err) => {
        console.error("failed to fetch", err);
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
      console.error("save failed", err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-40"></div>
        <div className="bg-white rounded-lg shadow-xl z-10 max-w-2xl w-full">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">{edit ? "Edit User" : "User Details"}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading user...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Username</label>
                    {edit ? (
                      <input name="username" value={form.username} onChange={onChange} className="mt-1 w-full border rounded p-2" />
                    ) : (
                      <div className="mt-1 text-gray-900">{user?.username || "—"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Email</label>
                    {edit ? (
                      <input name="email" value={form.email} onChange={onChange} className="mt-1 w-full border rounded p-2" />
                    ) : (
                      <div className="mt-1 text-gray-900">{user?.email || "—"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Role</label>
                    {edit ? (
                      <select name="role" value={form.role} onChange={onChange} className="mt-1 w-full border rounded p-2">
                        <option value="user">User</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <div className="mt-1 text-gray-900">{user?.role}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Email Verified</label>
                    {edit ? (
                      <input type="checkbox" name="email_verified" checked={form.email_verified} onChange={onChange} className="mt-2" />
                    ) : (
                      <div className="mt-1 text-gray-900">{user?.email_verified ? "Yes" : "No"}</div>
                    )}
                  </div>

                  {user?.role === "vendor" && (
                    <div>
                      <label className="block text-sm text-gray-600">Vendor Approved</label>
                      {edit ? (
                        <input type="checkbox" name="vendor_approved" checked={form.vendor_approved} onChange={onChange} className="mt-2" />
                      ) : (
                        <div className="mt-1 text-gray-900">{user?.vendor_approved ? "Approved" : "Pending"}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <div>Created: {user?.created_at || user?.createdAt || "N/A"}</div>
                  <div>Last login: {user?.last_login || user?.lastLoginAt || "N/A"}</div>
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t flex justify-end gap-2">
            {edit ? (
              <>
                <button onClick={() => setEdit(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEdit(true)} className="px-4 py-2 border rounded">Edit</button>
                <button onClick={onClose} className="px-4 py-2 rounded border">Close</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
