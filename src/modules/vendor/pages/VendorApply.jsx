import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyVendor } from "../api/vendor.api";
import {
  Eye,
  EyeOff,
  Building2,
  Mail,
  Phone,
  Lock,
  Store,
} from "lucide-react";

export default function VendorApply() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    business_name: "",
    category_id: "",
    phone: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Categories based on user input
  const categories = [
    { id: 1, name: "Venue & Infrastructure" },
    { id: 2, name: "Catering & Food" },
    { id: 3, name: "Photography & Video" },
    { id: 4, name: "Sound & Music" },
    { id: 5, name: "Decoration & Styling" },
    { id: 6, name: "Lighting & Effects" },
    { id: 7, name: "Logistics & Utilities" },
    { id: 8, name: "Staffing & Management" },
    { id: 9, name: "Ritual & Ceremony Services" },
  ];

  const validateForm = () => {
    const e = {};

    if (!form.business_name.trim()) e.business_name = "Business name required";
    if (!form.category_id) e.category_id = "Select category";
    if (!form.phone.trim()) e.phone = "Phone required";
    if (!form.email.trim()) e.email = "Email required";
    if (!form.password) e.password = "Password required";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 🔥 BACKEND-CORRECT PAYLOAD
      const payload = {
        business_name: form.business_name,
        category_id: Number(form.category_id),
        subcategory_ids: [], // Fixed: backend expects 'subcategory_ids' not 'sub_category_ids'
        phone: form.phone,
        address: "NA",
        gst_number: "NA",
        email: form.email,
        password: form.password,
      };

      console.log("Vendor Apply Payload:", payload);

      const res = await applyVendor(payload);

      /**
       * Expected backend response:
       * {
       *   message: "OTP sent via auth-service",
       *   vendor_id: "uuid"
       * }
       */
      const vendorId = res?.data?.vendor_id;

      if (!vendorId) {
        throw new Error("vendor_id not returned from backend");
      }

      sessionStorage.setItem("vendor_id", vendorId);
      sessionStorage.setItem("vendor_email", form.email);

      navigate("/vendor/verify-otp");
    } catch (err) {
      console.error("Vendor Apply Error:", err?.response?.data || err);

      setErrors({
        general:
          err?.response?.data?.message ||
          JSON.stringify(err?.response?.data) ||
          "Vendor registration failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">
        <div className="text-center mb-6">
          <Store className="mx-auto w-12 h-12 text-blue-600" />
          <h2 className="text-2xl font-bold mt-2">Become a Vendor</h2>
        </div>

        {errors.general && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="text-sm font-medium">Business Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border rounded"
              />
            </div>
            {errors.business_name && (
              <p className="text-xs text-red-600">{errors.business_name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full py-2 px-3 border rounded"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-xs text-red-600">{errors.category_id}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border rounded"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border rounded"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-9 pr-10 py-2 border rounded"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Apply as Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
}
