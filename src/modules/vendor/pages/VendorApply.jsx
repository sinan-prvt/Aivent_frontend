import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyVendor, fetchCategories } from "../api/vendor.api";
import {
  Eye,
  EyeOff,
  Building2,
  Mail,
  Phone,
  Lock,
  Store,
  ChevronDown,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function VendorApply() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    business_name: "",
    category_id: "",
    subcategory_ids: [],
    phone: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  /* =========================
     Fetch Categories
  ========================= */

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() =>
        setErrors({ general: "Failed to load categories. Please refresh the page." })
      );
  }, []);

  const parentCategories = categories;

  const selectedCategory = parentCategories.find(
    (c) => c.id === Number(form.category_id)
  );

  const subCategories = selectedCategory?.children || [];

  /* =========================
     Validation
  ========================= */

  const validate = () => {
    const e = {};

    if (!form.business_name.trim())
      e.business_name = "Business name is required";

    if (!form.category_id)
      e.category_id = "Please select a category";

    if (!form.phone.trim())
      e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, '')))
      e.phone = "Please enter a valid 10-digit phone number";

    if (!form.email.trim())
      e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email address";

    if (!form.password)
      e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     Submit
  ========================= */

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        business_name: form.business_name,
        category_id: Number(form.category_id),
        subcategory_ids: form.subcategory_ids,
        phone: form.phone,
        address: "NA",
        gst_number: "NA",
        email: form.email,
        password: form.password,
      };

      const res = await applyVendor(payload);

      const vendorId = res?.data?.vendor_id;
      if (!vendorId)
        throw new Error("vendor_id missing");

      sessionStorage.setItem("vendor_id", vendorId);
      sessionStorage.setItem("vendor_email", form.email);

      navigate("/vendor/verify-otp");
    } catch (err) {
      setErrors({
        general:
          err?.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Store className="text-white" size={32} />
          </div> */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Marketplace
          </h1>
          <p className="text-gray-600">
            Start selling to thousands of customers
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="business_name"
                    placeholder="Your business name"
                    className={`w-full pl-10 pr-4 py-3 border ${errors.business_name ? 'border-red-300' : 'border-gray-300'} rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    value={form.business_name}
                    onChange={(e) => {
                      setForm({ ...form, business_name: e.target.value });
                      if (errors.business_name) setErrors({ ...errors, business_name: '' });
                    }}
                  />
                </div>
                {errors.business_name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.business_name}
                  </p>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Category
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`w-full px-4 py-3 border ${errors.category_id ? 'border-red-300' : 'border-gray-300'} rounded-xl bg-gray-50 flex items-center justify-between transition-all duration-200 hover:bg-gray-100 ${isCategoryOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
                  >
                    <span className="text-gray-700">
                      {selectedCategory?.name || "Select a category"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      {parentCategories.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => {
                            setForm({
                              ...form,
                              category_id: c.id,
                              subcategory_ids: []
                            });
                            setIsCategoryOpen(false);
                            if (errors.category_id) setErrors({ ...errors, category_id: '' });
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="text-gray-700">{c.name}</span>
                          {form.category_id === c.id && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.category_id && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.category_id}
                  </p>
                )}
              </div>

              {/* Subcategories */}
              {subCategories.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Select Subcategories
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subCategories.map((sc) => (
                      <label
                        key={sc.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.subcategory_ids.includes(sc.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={form.subcategory_ids.includes(sc.id)}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                subcategory_ids: e.target.checked
                                  ? [...prev.subcategory_ids, sc.id]
                                  : prev.subcategory_ids.filter((id) => id !== sc.id),
                              }))
                            }
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border rounded flex items-center justify-center ${form.subcategory_ids.includes(sc.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {form.subcategory_ids.includes(sc.id) && (
                              <Check className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700">{sc.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="phone"
                      placeholder="10-digit number"
                      className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      value={form.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setForm({ ...form, phone: value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Use a strong password with at least 8 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Apply as Vendor"
                )}
              </button>
            </form>

            {/* Footer Note */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                By applying, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}