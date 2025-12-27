import React, { useEffect, useState } from "react";
import {
  fetchUserDetails,
  updateUser,
  approveVendor,
} from "../../api/adminApi";
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
} from "lucide-react";

export default function UserDetailsModal({
  userId,
  isOpen,
  onClose,
  onUserUpdated,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
    email_verified: false,
    is_active: true,
  });

  /* ===========================
     FETCH USER DETAILS
  ============================ */
  useEffect(() => {
    if (!isOpen || !userId) return;

    let mounted = true;
    setLoading(true);

    fetchUserDetails(userId)
      .then((data) => {
        if (!mounted) return;
        setUser(data);
        setForm({
          username: data.username || "",
          email: data.email || "",
          role: data.role || "user",
          email_verified: !!data.email_verified,
          is_active: data.is_active !== false,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user details", err);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [isOpen, userId]);

  /* ===========================
     FORM CHANGE
  ============================ */
  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ===========================
     SAVE BASIC USER INFO
     (NOT vendor approval)
  ============================ */
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

  /* ===========================
     VENDOR APPROVAL ACTION
  ============================ */
  const handleVendorApproval = async (action) => {
    try {
      await approveVendor(userId, action); // approve | reject
      onUserUpdated();
      onClose();
    } catch (err) {
      console.error("Vendor approval failed", err);
      alert("Vendor approval failed");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-600";
      case "vendor":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getRoleColor(user?.role)}`} />
            <div>
              <h2 className="text-lg font-semibold">
                {edit ? "Edit User" : "User Details"}
              </h2>
              <p className="text-sm text-gray-500">ID: {userId}</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* USERNAME */}
              <Field
                icon={<User />}
                label="Username"
                edit={edit}
                name="username"
                value={form.username}
                onChange={onChange}
                display={user?.username}
              />

              {/* EMAIL */}
              <Field
                icon={<Mail />}
                label="Email"
                edit={edit}
                name="email"
                value={form.email}
                onChange={onChange}
                display={user?.email}
              />

              {/* ROLE */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Role</span>
                </div>
                {edit ? (
                  <select
                    name="role"
                    value={form.role}
                    onChange={onChange}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium">
                    {user?.role?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* STATUS */}
              <div className="border-t pt-4 space-y-3">
                <StatusRow
                  label="Email Verified"
                  value={form.email_verified}
                  edit={edit}
                  name="email_verified"
                  onChange={onChange}
                />
                <StatusRow
                  label="Account Active"
                  value={form.is_active}
                  edit={edit}
                  name="is_active"
                  onChange={onChange}
                />
              </div>

              {/* VENDOR APPROVAL (ACTION, NOT FORM) */}
              {user?.role === "vendor" && !user?.vendor_approved && (
                <div className="border-t pt-4 flex gap-3">
                  <button
                    onClick={() => handleVendorApproval("approve")}
                    className="flex-1 bg-green-600 text-white py-2 rounded"
                  >
                    Approve Vendor
                  </button>
                  <button
                    onClick={() => handleVendorApproval("reject")}
                    className="flex-1 bg-red-600 text-white py-2 rounded"
                  >
                    Reject Vendor
                  </button>
                </div>
              )}

              {/* CREATED DATE */}
              <div className="border-t pt-4 text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created:{" "}
                {new Date(
                  user?.date_joined || user?.created_at
                ).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-2">
          {edit ? (
            <>
              <button
                onClick={() => setEdit(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="px-4 py-2 border rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===========================
   SMALL HELPERS
=========================== */

function Field({ icon, label, edit, name, value, onChange, display }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        {label}
      </div>
      {edit ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="border rounded px-2 py-1 text-sm"
        />
      ) : (
        <span className="text-sm font-medium">{display || "—"}</span>
      )}
    </div>
  );
}

function StatusRow({ label, value, edit, name, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-sm">
        {value ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
        {label}
      </div>
      {edit && (
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
