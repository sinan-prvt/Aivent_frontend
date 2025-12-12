import { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import api from "@/core/api/axios"; 
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  Loader2,
  Lock,
  LogOut,
  Key,
  AlertCircle,
  Eye,
  EyeOff,
  Edit2,
  X,
  Check
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { logoutEverywhere } from "@/core/auth/logoutEverywhere";


export default function Profile() {
  const { profile, loading, saveProfile, saving } = useProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    phone: "",
    gender: "",
    dob: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    full_address: "",
  });

  const [jwtUsername, setJwtUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/default.png");
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password Reset States
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: ""
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Logout All States
  const [showLogoutAll, setShowLogoutAll] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  // Decode username from access token
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("access");
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        setJwtUsername(decoded.username || "");
      }
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }, []);

  // Load profile fields
  useEffect(() => {
    if (loading || !profile) return;

    const initialForm = {
      username: profile.username || jwtUsername || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      dob: profile.dob || "",
      country: profile.country || "",
      state: profile.state || "",
      city: profile.city || "",
      pincode: profile.pincode || "",
      full_address: profile.full_address || "",
    };

    setForm(initialForm);
    setOriginalForm(initialForm);
    setAvatarPreview(
      profile.avatar_url
        ? profile.avatar_url
        : "/default.png"
    );

  }, [loading, profile, jwtUsername]);

  const handleInput = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      // Exclude username from form submission as it cannot be changed
      const { username, ...formWithoutUsername } = form;
      
      Object.entries(formWithoutUsername).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          fd.append(key, val);
        }
      });

      const updated = await saveProfile(fd);

      // Update form with new data (excluding username)
      setForm((prev) => ({
        ...prev,
        phone: updated.phone ?? prev.phone,
        gender: updated.gender ?? prev.gender,
        dob: updated.dob ?? prev.dob,
        country: updated.country ?? prev.country,
        state: updated.state ?? prev.state,
        city: updated.city ?? prev.city,
        pincode: updated.pincode ?? prev.pincode,
        full_address: updated.full_address ?? prev.full_address,
      }));

      setOriginalForm({ ...form });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      const msg = error?.response?.data?.message || error?.response?.data?.detail || "Failed to update profile";
      alert(msg);
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  // Password Reset Function - Updated to match backend
  const handleResetPassword = async () => {
    const { current_password, new_password, confirm_new_password } = resetPasswordForm;
    
    if (!current_password) return alert("Enter your current password");
    if (new_password.length < 8) return alert("Password must be at least 8 characters");
    if (new_password !== confirm_new_password) return alert("Passwords do not match");
    
    try {
      setResetLoading(true);
      
      // Call the change password endpoint
      const res = await api.post("/api/auth/change-password/", {
        old_password: current_password,
        new_password: new_password,
      });
      
      setResetSuccess(true);
      setResetPasswordForm({ 
        current_password: "", 
        new_password: "", 
        confirm_new_password: "" 
      });
      
      setTimeout(() => { 
        setShowResetPassword(false); 
        setResetSuccess(false); 
      }, 1500);
      
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Password change failed";
      alert(msg);
    } finally {
      setResetLoading(false);
    }
  };

  // Logout All Devices Function - Updated to match backend
  const handleLogoutAll = async () => {
    try {
      setLogoutAllLoading(true);
      
      // Call logout-all endpoint (no body needed as it uses authentication header)
      await api.post("/api/auth/logout-all/");
      

      logoutEverywhere(navigate);

      
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Logout from all devices failed";
      alert(msg);
    } finally {
      setLogoutAllLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const formatDate = (d) => {
    if (!d) return "Not set";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Not set";
    }
  };

  const formatDateTime = (d) => {
    if (!d) return "Never";
    try {
      return new Date(d).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Never";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Success Toasts */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-800 font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}

      {resetSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-800 font-medium">Password changed successfully!</span>
          </div>
        </div>
      )}

      {logoutSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <span className="text-blue-800 font-medium">Logged out from all devices. Redirecting...</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your personal information and account security
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Active Now</span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="border-gray-300 hover:bg-gray-50"
            >
              ← Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6 shadow-lg border-0 overflow-hidden bg-linear-to-br from-white to-gray-50">
              <div className="flex flex-col items-center">
                {/* Avatar - Non-editable */}
                <div className="relative mb-6">
                  <div className="h-40 w-40 rounded-full border-4 border-white shadow-xl overflow-hidden">
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-0 right-0">
                    <div className="h-5 w-5 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center w-full">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {form.username || profile?.username || "No Name Set"}
                  </h2>
                  <div className="flex items-center justify-center text-gray-600 mb-4 whitespace-nowrap w-full">
                    <Mail className="h-4 w-4 mr-1 shrink-0" />
                    <span className="text-sm break-all">{profile?.email}</span>
                  </div>

                  {/* Role Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    profile?.role === 'admin' 
                      ? 'bg-red-50 text-red-700' 
                      : profile?.role === 'vendor'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {profile?.role?.toUpperCase() || 'USER'}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Joined On</p>
                      <p className="text-sm font-semibold">{formatDate(profile?.created_at)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Last Active</p>
                      <p className="text-sm font-semibold">Today</p>
                    </div>
                  </div>

                  {!isEditing ? (
                    <Button
                      className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleCancel}
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        onClick={handleSubmit}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Check size={16} className="mr-2" />
                        )}
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Navigation Tabs */}
            <Card className="p-4 shadow-lg border-0">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === "personal"
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span className="font-medium">Personal Info</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("account")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === "account"
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  <span className="font-medium">Account Security</span>
                </button>
              </nav>
            </Card>

            {/* Account Summary */}
            <Card className="p-6 shadow-lg border-0">
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Account Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email Verified</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile?.email_verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile?.email_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                
                {profile?.role === 'vendor' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Vendor Approval</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.vendor_approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profile?.vendor_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Account Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile?.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="p-8 shadow-xl border-0 overflow-hidden">
              {/* Tab Content Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeTab === "personal" && "Personal Information"}
                    {activeTab === "account" && "Account Security"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {activeTab === "personal" && "Update your personal details and contact information"}
                    {activeTab === "account" && "Manage your password and security settings"}
                  </p>
                </div>
                
                {activeTab === "personal" && isEditing && (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300"
                    >
                      <X size={16} className="mr-2" />
                      Discard
                    </Button>
                    <Button
                      className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6"
                      onClick={handleSubmit}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check size={16} className="mr-2" />
                      )}
                      {saving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === "personal" ? (
                <div className="space-y-10">
                  {/* Basic Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                        <p className="text-gray-600 text-sm">Your name, contact details, and basic info</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Username Field - Non-editable */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Username</label>
                          <span className="text-xs text-gray-400">Unique identifier</span>
                        </div>
                        <div className="relative group">
                          <div className="relative flex items-center">
                            <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="w-full">
                              <Input
                                value={form.username}
                                disabled={true}
                                readOnly
                                className="w-full pl-10 pr-10 bg-gray-50/80 border-gray-200 text-gray-700 cursor-not-allowed transition-colors group-hover:bg-gray-100/50"
                              />
                            </div>
                            <div className="absolute right-0 pr-3 flex items-center">
                              <div className="flex items-center space-x-1">
                                <Lock className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500 hidden sm:inline">Locked</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-1.5">
                          <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            <Shield className="h-3 w-3 mr-1" />
                            <span>Username is permanent and cannot be modified</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                          <Input
                            value={profile?.email || ""}
                            disabled
                            readOnly
                            className="bg-gray-50 border-gray-200 pl-10"
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                          <Input
                            value={form.phone}
                            disabled={!isEditing}
                            onChange={(e) => handleInput("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className={!isEditing ? "bg-gray-50 border-gray-200 pl-10" : "pl-10"}
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Gender</label>
                        <div className="relative">
                          <select
                            value={form.gender}
                            disabled={!isEditing}
                            onChange={(e) => handleInput("gender", e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              !isEditing 
                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            }`}
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={form.dob}
                            disabled={!isEditing}
                            onChange={(e) => handleInput("dob", e.target.value)}
                            className={!isEditing ? "bg-gray-50 border-gray-200 pl-10" : "pl-10"}
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <div className="relative">
                          <Input
                            value={profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Customer"}
                            disabled
                            readOnly
                            className="bg-gray-50 border-gray-200"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Role cannot be changed</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                        <p className="text-gray-600 text-sm">Your primary residence details</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Address</label>
                        <div className="relative">
                          <textarea
                            value={form.full_address}
                            disabled={!isEditing}
                            onChange={(e) => handleInput("full_address", e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border resize-none ${
                              !isEditing 
                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            }`}
                            placeholder="Enter your complete address"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">City</label>
                          <Input
                            value={form.city}
                            disabled={!isEditing}
                            onChange={(e) => handleInput("city", e.target.value)}
                            placeholder="e.g., New York"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">State/Province</label>
                          <Input
                            value={form.state}
                            disabled={!isEditing}
                            onChange={(e) => handleInput("state", e.target.value)}
                            placeholder="e.g., California"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Country</label>
                          <div className="relative">
                            <Input
                              value={form.country}
                              disabled={!isEditing}
                              onChange={(e) => handleInput("country", e.target.value)}
                              placeholder="e.g., United States"
                              className={!isEditing ? "bg-gray-50 border-gray-200 pl-10" : "pl-10"}
                            />
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Postal Code</label>
                          <Input
                            value={form.pincode}
                            disabled={!isEditing}
                            onChange={(e) => handleInput("pincode", e.target.value)}
                            placeholder="e.g., 10001"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "account" ? (
                <div className="space-y-8">
                  {/* Password Reset Section */}
                  {!showResetPassword ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Key className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">Change Password</h3>
                            <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setShowResetPassword(true)}
                          className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">Change Password</h3>
                          <p className="text-gray-600 text-sm">Enter your current password and new password</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowResetPassword(false);
                            setResetPasswordForm({
                              current_password: "",
                              new_password: "",
                              confirm_new_password: ""
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Current Password</label>
                          <div className="relative">
                            <Input
                              type={showPassword.current ? "text" : "password"}
                              value={resetPasswordForm.current_password}
                              onChange={(e) => setResetPasswordForm(prev => ({
                                ...prev,
                                current_password: e.target.value
                              }))}
                              placeholder="Enter your current password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("current")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
                          <div className="relative">
                            <Input
                              type={showPassword.new ? "text" : "password"}
                              value={resetPasswordForm.new_password}
                              onChange={(e) => setResetPasswordForm(prev => ({
                                ...prev,
                                new_password: e.target.value
                              }))}
                              placeholder="Enter new password (min 8 characters)"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("new")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm New Password</label>
                          <div className="relative">
                            <Input
                              type={showPassword.confirm ? "text" : "password"}
                              value={resetPasswordForm.confirm_new_password}
                              onChange={(e) => setResetPasswordForm(prev => ({
                                ...prev,
                                confirm_new_password: e.target.value
                              }))}
                              placeholder="Confirm your new password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("confirm")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 pt-4">
                          <Button
                            onClick={handleResetPassword}
                            disabled={resetLoading || !resetPasswordForm.current_password || !resetPasswordForm.new_password}
                            className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          >
                            {resetLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Lock className="h-4 w-4 mr-2" />
                            )}
                            {resetLoading ? "Updating..." : "Update Password"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowResetPassword(false);
                              setResetPasswordForm({
                                current_password: "",
                                new_password: "",
                                confirm_new_password: ""
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logout All Devices Section */}
                  {!showLogoutAll ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <LogOut className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">Logout from All Devices</h3>
                            <p className="text-gray-600 text-sm">This will log you out from all devices including this one</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setShowLogoutAll(true)}
                          className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout All
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-red-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <AlertCircle className="h-6 w-6 text-red-600 mt-1 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">Are you sure?</h3>
                          <p className="text-gray-600 mb-4">
                            This action will log you out from all devices where you are currently signed in.
                            You will need to log in again on this device.
                          </p>
                          <div className="flex items-center space-x-3">
                            <Button
                              onClick={handleLogoutAll}
                              disabled={logoutAllLoading}
                              className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                            >
                              {logoutAllLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <LogOut className="h-4 w-4 mr-2" />
                              )}
                              {logoutAllLoading ? "Processing..." : "Yes, Logout All"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowLogoutAll(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tips */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Security Tips</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span className="text-gray-600">Use a strong, unique password that you don't use elsewhere</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt=0.5 shrink-0" />
                        <span className="text-gray-600">Change your password regularly for better security</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span className="text-gray-600">Logout from all devices if you suspect unauthorized access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 border-0 shadow-sm bg-linear-to-r from-blue-50 to-white">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(profile?.created_at)}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-0 shadow-sm bg-linear-to-r from-green-50 to-white">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {profile?.email_verified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-0 shadow-sm bg-linear-to-r from-purple-50 to-white">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="text-lg font-bold text-gray-900">
                      {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Customer'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}