import { useEffect, useState, useCallback, useMemo } from "react";
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
  Loader2,
  MapPin,
  FileText,
  CreditCard,
  User,
  Shield,
  Users,
  Banknote,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  ShieldCheck,
  Building
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
    address: "",
    gst_number: "",
    contact_person: "",
    business_type: "individual",
    bank_account_number: "",
    bank_ifsc: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { id: 0, title: "Business Details", icon: Briefcase, description: "Basic business information" },
    { id: 1, title: "Company Info", icon: Building2, description: "Legal & address details" },
    { id: 2, title: "Banking Details", icon: CreditCard, description: "Payment information" },
  ];

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() =>
        setErrors({ general: "Failed to load categories. Please refresh." })
      );
  }, []);

  const parentCategories = categories;
  const selectedCategory = parentCategories.find(
    (c) => c.id === Number(form.category_id)
  );
  const subCategories = selectedCategory?.children || [];

  // Validation functions
  const validateSection = useCallback((sectionId) => {
    const e = {};
    switch (sectionId) {
      case 0:
        if (!form.business_name.trim()) e.business_name = "Required";
        if (!form.contact_person.trim()) e.contact_person = "Required";
        if (!form.category_id) e.category_id = "Select category";
        if (!form.phone.trim()) e.phone = "Required";
        else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = "Invalid phone";
        if (!form.email.trim()) e.email = "Required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
        if (!form.password) e.password = "Required";
        else if (form.password.length < 8) e.password = "Min 8 characters";
        break;
      case 1:
        if (!form.address.trim()) e.address = "Required";
        if (!form.gst_number.trim()) e.gst_number = "Required";
        else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(form.gst_number))
          e.gst_number = "Invalid GST";
        break;
      case 2:
        if (!form.bank_account_number.trim()) e.bank_account_number = "Required";
        else if (form.bank_account_number.length < 9) e.bank_account_number = "Invalid";
        if (!form.bank_ifsc.trim()) e.bank_ifsc = "Required";
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.bank_ifsc)) e.bank_ifsc = "Invalid IFSC";
        break;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const validateAll = useCallback(() => {
    return sections.every(section => validateSection(section.id));
  }, [sections, validateSection]);

  const submit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      const firstErrorSection = sections.find(section => {
        const tempErrors = {};
        validateSection(section.id);
        return Object.keys(tempErrors).length > 0;
      });
      if (firstErrorSection) setActiveSection(firstErrorSection.id);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        business_name: form.business_name,
        contact_person: form.contact_person,
        category_id: Number(form.category_id),
        subcategory_ids: form.subcategory_ids,
        phone: form.phone,
        address: form.address,
        gst_number: form.gst_number,
        email: form.email,
        password: form.password,
        business_type: form.business_type,
        bank_account_number: form.bank_account_number,
        bank_ifsc: form.bank_ifsc,
      };

      const res = await applyVendor(payload);
      const vendorId = res?.data?.vendor_id;
      if (!vendorId) throw new Error("vendor_id missing");

      sessionStorage.setItem("vendor_id", vendorId);
      sessionStorage.setItem("vendor_email", form.email);
      navigate("/vendor/verify-otp");
    } catch (err) {
      setErrors({
        general: err?.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Memoized event handlers
  const handleInputChange = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  }, [errors]);

  const handleGstChange = useCallback((e) => {
    const value = e.target.value.toUpperCase();
    setForm(prev => ({ ...prev, gst_number: value }));
    if (errors.gst_number) setErrors(prev => ({ ...prev, gst_number: '' }));
  }, [errors]);

  const handleBankAccountChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm(prev => ({ ...prev, bank_account_number: value }));
    if (errors.bank_account_number) setErrors(prev => ({ ...prev, bank_account_number: '' }));
  }, [errors]);

  const handleIfscChange = useCallback((e) => {
    const value = e.target.value.toUpperCase();
    setForm(prev => ({ ...prev, bank_ifsc: value }));
    if (errors.bank_ifsc) setErrors(prev => ({ ...prev, bank_ifsc: '' }));
  }, [errors]);

  // Memoize Section1
// Replace the useMemo sections with these regular functions

const Section1 = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Business Name */}
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-2">
          <Building className="h-4 w-4 text-blue-600" />
          <label className="block text-sm font-semibold text-gray-800">
            Business Name
          </label>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <input
          name="business_name"
          placeholder="e.g., ABC Enterprises"
          className={`w-full px-4 py-3 border ${errors.business_name ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200`}
          value={form.business_name}
          onChange={handleInputChange('business_name')}
        />
        {errors.business_name && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.business_name}
          </div>
        )}
      </div>

      {/* Contact Person */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-blue-600" />
          <label className="block text-sm font-semibold text-gray-800">
            Contact Person
          </label>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <input
          name="contact_person"
          placeholder="Full name"
          className={`w-full px-4 py-3 border ${errors.contact_person ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200`}
          value={form.contact_person}
          onChange={handleInputChange('contact_person')}
        />
        {errors.contact_person && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.contact_person}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Store className="h-4 w-4 text-blue-600" />
          <label className="block text-sm font-semibold text-gray-800">
            Business Category
          </label>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className={`w-full px-4 py-3 border ${errors.category_id ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white flex items-center justify-between text-left transition-all duration-200`}
          >
            <span className={`${selectedCategory ? 'text-gray-900' : 'text-gray-500'}`}>
              {selectedCategory?.name || "Select a category"}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isCategoryOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {parentCategories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      category_id: c.id,
                      subcategory_ids: []
                    }));
                    setIsCategoryOpen(false);
                    if (errors.category_id) setErrors(prev => ({ ...prev, category_id: '' }));
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Store className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-800 font-medium">{c.name}</span>
                  </div>
                  {form.category_id === c.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.category_id && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.category_id}
          </div>
        )}
      </div>

      {/* Subcategories */}
      {subCategories.length > 0 && (
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Specializations (Optional)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {subCategories.map((sc) => (
              <label
                key={sc.id}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border cursor-pointer transition-all ${form.subcategory_ids.includes(sc.id) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
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
                  className="hidden"
                />
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${form.subcategory_ids.includes(sc.id) ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                  {form.subcategory_ids.includes(sc.id) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{sc.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Phone */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Phone className="h-4 w-4 text-blue-600" />
          <label className="block text-sm font-semibold text-gray-800">
            Phone Number
          </label>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-700 font-medium text-sm">+91</span>
          </div>
          <input
            name="phone"
            placeholder="Enter 10-digit number"
            className={`w-full pl-14 pr-4 py-3 border ${errors.phone ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200`}
            value={form.phone}
            onChange={handlePhoneChange}
          />
        </div>
        {errors.phone && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.phone}
          </div>
        )}
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-blue-600" />
          <label className="block text-sm font-semibold text-gray-800">
            Business Email
          </label>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <input
          name="email"
          type="email"
          placeholder="business@example.com"
          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200`}
          value={form.email}
          onChange={handleInputChange('email')}
        />
        {errors.email && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.email}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-4 w-4 text-blue-600" />
          <label className="block text-sm font-semibold text-gray-800">
            Password
          </label>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            className={`w-full px-4 py-3 border ${errors.password ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 pr-12`}
            value={form.password}
            onChange={handleInputChange('password')}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.password}
          </div>
        )}
        {form.password && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Password Strength</span>
              <span className="text-xs font-semibold text-gray-900">
                {form.password.length < 4 ? "Weak" : 
                 form.password.length < 8 ? "Fair" : 
                 /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? "Strong" : "Good"}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  form.password.length < 4 ? 'bg-red-500' : 
                  form.password.length < 8 ? 'bg-yellow-500' : 
                  /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ 
                  width: `${Math.min(
                    form.password.length < 4 ? form.password.length * 25 : 
                    form.password.length < 8 ? 25 + (form.password.length - 3) * 12.5 :
                    75 + (form.password.length - 7) * 3.125, 100
                  )}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Section2 = () => (
  <div className="space-y-6">
    {/* Business Type */}
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Business Structure
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { value: "individual", label: "Individual", icon: User, description: "Sole Proprietor" },
          { value: "partnership", label: "Partnership", icon: Users, description: "Multiple Owners" },
          { value: "private_limited", label: "Private Ltd.", icon: Building2, description: "Registered Company" }
        ].map((type) => (
          <label
            key={type.value}
            className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 ${form.business_type === type.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'}`}
          >
            <input
              type="radio"
              name="business_type"
              value={type.value}
              checked={form.business_type === type.value}
              onChange={(e) => setForm(prev => ({ ...prev, business_type: e.target.value }))}
              className="sr-only"
            />
            <div className="text-center">
              <div className="mb-2">
                <type.icon className="h-8 w-8 mx-auto text-blue-600" />
              </div>
              <span className="block text-sm font-semibold text-gray-900 mb-1">
                {type.label}
              </span>
              <span className="text-xs text-gray-600">
                {type.description}
              </span>
            </div>
            {form.business_type === type.value && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>

    {/* Address */}
    <div>
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <label className="block text-sm font-semibold text-gray-800">
          Business Address
        </label>
        <span className="text-red-500 text-sm">*</span>
      </div>
      <textarea
        name="address"
        placeholder="Complete business address with PIN code"
        rows="3"
        className={`w-full px-4 py-3 border ${errors.address ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none`}
        value={form.address}
        onChange={handleInputChange('address')}
      />
      {errors.address && (
        <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
          <AlertCircle size={14} />
          {errors.address}
        </div>
      )}
    </div>

    {/* GST */}
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-blue-600" />
        <label className="block text-sm font-semibold text-gray-800">
          GST Number
        </label>
        <span className="text-red-500 text-sm">*</span>
      </div>
      <div className="relative">
        <input
          name="gst_number"
          placeholder="22AAAAA0000A1Z5"
          className={`w-full px-4 py-3 border ${errors.gst_number ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 uppercase font-mono tracking-wider`}
          value={form.gst_number}
          onChange={handleGstChange}
        />
      </div>
      {errors.gst_number && (
        <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
          <AlertCircle size={14} />
          {errors.gst_number}
        </div>
      )}
    </div>
  </div>
);

const Section3 = () => (
  <div className="space-y-6">
    {/* Security Notice */}
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Secure Banking Information</p>
          <p className="text-xs text-gray-600">Your financial details are encrypted with bank-level security</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Bank Account */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Bank Account Number
          <span className="text-red-500 text-sm ml-1">*</span>
        </label>
        <input
          name="bank_account_number"
          placeholder="e.g., 123456789012"
          className={`w-full px-4 py-3 border ${errors.bank_account_number ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 font-mono`}
          value={form.bank_account_number}
          onChange={handleBankAccountChange}
        />
        {errors.bank_account_number && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.bank_account_number}
          </div>
        )}
      </div>

      {/* IFSC Code */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          IFSC Code
          <span className="text-red-500 text-sm ml-1">*</span>
        </label>
        <input
          name="bank_ifsc"
          placeholder="e.g., SBIN0001234"
          className={`w-full px-4 py-3 border ${errors.bank_ifsc ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300 hover:border-blue-400'} rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 uppercase font-mono`}
          value={form.bank_ifsc}
          onChange={handleIfscChange}
        />
        {errors.bank_ifsc && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle size={14} />
            {errors.bank_ifsc}
          </div>
        )}
      </div>

      {/* Account Holder */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Account Holder Verification
        </label>
        <div className="p-4 border border-gray-300 rounded-xl bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{form.contact_person || "Not specified"}</p>
                <p className="text-xs text-gray-500">Primary account holder</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Note: Account holder name should match your bank records. Updates to business name won't affect this field.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Terms & Conditions */}
    <div className="pt-6 border-t border-gray-200">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="flex items-center justify-center w-5 h-5 mt-0.5">
          <input
            type="checkbox"
            required
            className="w-5 h-5 text-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          />
        </div>
        <div className="text-sm">
          <p className="text-gray-900 font-medium mb-1">
            Terms & Conditions Agreement
          </p>
          <p className="text-gray-600">
            I confirm that all information provided is accurate and I agree to the{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline">Privacy Policy</a>.
            I understand that providing false information may result in account suspension.
          </p>
        </div>
      </label>
    </div>
  </div>
);

  const renderSection = useCallback(() => {
    switch (activeSection) {
      case 0: return <Section1 />;
      case 1: return <Section2 />;
      case 2: return <Section3 />;
      default: return <Section1 />;
    }
  }, [activeSection, Section1, Section2, Section3]);

  const nextSection = useCallback(() => {
    if (validateSection(activeSection)) {
      setActiveSection(Math.min(activeSection + 1, sections.length - 1));
    }
  }, [activeSection, validateSection]);

  const prevSection = useCallback(() => {
    setActiveSection(Math.max(activeSection - 1, 0));
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vendor Onboarding
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Complete your business profile to start selling on our platform. All information is secured with 256-bit encryption.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-300 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${(activeSection / (sections.length - 1)) * 100}%` }}
              />
            </div>
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === index;
              const isCompleted = index < activeSection;
              
              return (
                <div key={section.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => index <= activeSection && setActiveSection(index)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all duration-300 transform hover:scale-110 ${
                      isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg' : 
                      isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl ring-2 ring-blue-200 ring-offset-2' : 
                      'bg-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    )}
                  </button>
                  <div className="text-center">
                    <span className={`block text-xs font-semibold ${
                      isActive ? 'text-blue-600' : 
                      isCompleted ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {section.title}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5 hidden md:block">
                      {section.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="text-red-700 font-medium text-sm mb-1">Registration Error</p>
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={submit}>
              {/* Current Section */}
              <div className="min-h-[400px]">
                {renderSection()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 mt-6 border-t border-gray-200">
                <div>
                  {activeSection > 0 && (
                    <button
                      type="button"
                      onClick={prevSection}
                      className="px-5 py-2.5 text-gray-700 font-medium text-sm hover:text-gray-900 flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeSection < sections.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextSection}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-7 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium text-sm rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Complete Registration
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>256-bit SSL Encrypted</span>
                  <span className="text-gray-300 mx-2">•</span>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/vendor/login")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Average approval time: <span className="font-semibold text-gray-700">24-48 hours</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
}