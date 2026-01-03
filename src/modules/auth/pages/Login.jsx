import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";
import { useAuth } from "../../../app/providers/AuthProvider";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showErrorToast = (message) => {
    toast.error(message || "An error occurred", {
      duration: 4000,
      position: "top-right",
    });
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      duration: 3000,
      position: "top-right",
    });
  };

  const showInfoToast = (message) => {
    toast(message, {
      duration: 3000,
      position: "top-right",
      icon: "ℹ️",
    });
  };

  const showWarningToast = (message) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      icon: "⚠️",
      style: {
        background: '#fef3c7',
        color: '#92400e',
      }
    });
  };

  const showLoadingToast = (message) => {
    return toast.loading(message, {
      position: "top-right",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email.trim() || !formData.password.trim()) {
      showErrorToast("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    let loadingToastId;
    
    try {
      loadingToastId = showLoadingToast("Signing in...");
      
      sessionStorage.removeItem("mfa_payload");

      const res = await login(formData);
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      const payload = res.data;

      console.log("🔵 Login API response:", payload);

      // 🔐 MFA FLOW
      if (payload.mfa_required === true) {
        const mfaPayload = {
          mfa_token: payload.mfa_token,
          mfa_setup: payload.mfa_setup === true,
          qr_code: payload.qr_code || null,
        };

        localStorage.removeItem("user");
        sessionStorage.setItem("mfa_payload", JSON.stringify(mfaPayload));

        if (payload.mfa_setup) {
          showInfoToast("Please set up Multi-Factor Authentication");
          navigate("/vendor/mfa-setup", { replace: true });
        } else {
          showInfoToast("MFA verification required");
          navigate("/vendor/mfa", { replace: true });
        }

        return;
      }

      // ✅ Extract user data from response
      let userData = null;
      let tokens = null;
      
      // Handle different response formats
      if (payload.data && payload.data.user) {
        userData = payload.data.user;
        tokens = { access: payload.data.access, refresh: payload.data.refresh };
      } else if (payload.user) {
        userData = payload.user;
        tokens = { access: payload.access, refresh: payload.refresh };
      } else if (payload) {
        userData = payload;
        tokens = payload;
      }

      console.log("🔵 Extracted user data:", userData);

      // 🔴 CRITICAL: VENDOR APPROVAL CHECK
      if (userData && userData.role === "vendor") {
        // Check vendor approval status - look for different possible field names
        const isApproved = 
          userData.is_approved === true || 
          userData.approved === true ||
          userData.approval_status === "approved" ||
          userData.status === "approved" ||
          userData.vendor_status === "approved";
        
        const isPending = 
          userData.approval_status === "pending" ||
          userData.status === "pending" ||
          userData.vendor_status === "pending" ||
          userData.is_approved === false ||
          userData.approved === false;

        console.log("🔵 Vendor approval check:");
        console.log("   - isApproved:", isApproved);
        console.log("   - isPending:", isPending);
        console.log("   - User object:", userData);

        // If vendor is NOT approved
        if (!isApproved) {
          if (isPending) {
            showWarningToast("Your vendor account is pending admin approval. Please wait for approval before logging in.");
          } else {
            showErrorToast("Admin has not approved your vendor account yet. Please contact support.");
          }
          
          // Don't login, just show toast and stay on login page
          setIsLoading(false);
          return;
        }
        
        // If vendor is approved, continue with login
        showSuccessToast("Vendor account approved! Logging in...");
      }

      // Proceed with normal login for approved vendors and other roles
      if (userData && tokens?.access) {
        authLogin(tokens.access, tokens.refresh, userData);
        
        showSuccessToast(`Welcome back, ${userData.name || userData.email || "User"}!`);

        // Redirect based on role
        if (userData.role === "vendor") {
          navigate("/vendor/dashboard", { replace: true });
        } else if (userData.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        throw new Error("Invalid response format from server");
      }

    } catch (err) {
      // Dismiss loading toast if exists
      if (loadingToastId) toast.dismiss(loadingToastId);
      
      console.error("🔴 Login Error:", err);
      console.error("🔴 Error response:", err.response?.data);
      
      // Handle different error formats
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle vendor approval errors
        if (
          errorData.detail?.includes("not approved") || 
          errorData.message?.includes("not approved") ||
          errorData.detail?.includes("pending approval") ||
          errorData.message?.includes("pending approval")
        ) {
          errorMessage = "Admin has not approved your vendor account yet. Please wait for approval.";
          showWarningToast(errorMessage);
          setIsLoading(false);
          return;
        }
        
        // Handle validation errors
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(d => d.msg || d).join(", ");
        } 
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        else if (err.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        }
        else if (err.response.status === 403) {
          if (errorData.code === 'vendor_not_approved') {
            errorMessage = "Admin has not approved your vendor account yet.";
            showWarningToast(errorMessage);
            setIsLoading(false);
            return;
          } else {
            errorMessage = "Access denied. Please contact support.";
          }
        }
      } 
      else if (err.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      showErrorToast(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth button handlers
  const handleGoogleLogin = () => {
    if (isLoading) {
      showErrorToast("Please wait for current operation to complete");
      return;
    }
    
    try {
      const clientId = "368057036266-6guernmjcbua4siag0kfgjpht9i7l9bi.apps.googleusercontent.com";
      const redirectUri = "http://localhost:5173/auth/google/callback";

      const url =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        `?client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=code` +
        `&access_type=offline` +
        `&prompt=select_account` +
        `&scope=openid%20email%20profile`;

      showInfoToast("Redirecting to Google...");
      window.location.href = url;
    } catch (error) {
      showErrorToast("Failed to initiate Google login");
    }
  };

  const handleMicrosoftLogin = () => {
    if (isLoading) {
      showErrorToast("Please wait for current operation to complete");
      return;
    }
    
    try {
      const clientId = "1d6f3723-9d92-41b2-81af-44dc76c477af";
      const redirectUri = "http://localhost:5173/auth/microsoft/callback";
      const scope = encodeURIComponent("openid profile email");

      const url =
        `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` +
        `?client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_mode=query` +
        `&scope=${scope}` +
        `&state=ms_auth`;

      showInfoToast("Redirecting to Microsoft...");
      window.location.href = url;
    } catch (error) {
      showErrorToast("Failed to initiate Microsoft login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full flex overflow-hidden max-h-[520px]">
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-500 mb-8">Welcome back! Enter your details.</p>

          <div className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm border rounded-xl border-gray-300
                         focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSubmit(e);
                }
              }}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm border rounded-xl border-gray-300
                         focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSubmit(e);
                }
              }}
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
                onClick={(e) => {
                  if (isLoading) {
                    e.preventDefault();
                    showErrorToast("Please wait for login to complete");
                  }
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl 
                         font-semibold hover:bg-blue-700 transition disabled:bg-blue-500
                         disabled:cursor-not-allowed relative min-h-12"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white border-opacity-30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-5 h-5 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
                  </div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>

          <div className="mt-8">
            <p className="text-center text-gray-500 text-sm mb-3">Or continue with</p>

            <div className="flex justify-center gap-4">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100 disabled:opacity-50 transition"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                title="Sign in with Google"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 12.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.17 24.55c0-1.57-.14-3.08-.39-4.55H24v9.02h12.69c-.55 2.97-2.24 5.49-4.76 7.18l7.31 5.69C43.68 37.41 46.17 31.41 46.17 24.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.54 28.44C9.96 26.87 9.64 25.17 9.64 23.39c0-1.78.32-3.48.9-5.05l-7.98-6.19C.99 15.54 0 19.65 0 23.99c0 4.34.99 8.45 2.56 12.01l7.98-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 47.98c6.48 0 11.93-2.14 15.91-5.81l-7.31-5.69c-2.03 1.37-4.62 2.17-8.6 2.17-6.26 0-11.57-3.22-14.46-8.09l-7.98 6.19C6.51 42.6 14.62 47.98 24 47.98z"
                  />
                </svg>
              </button>

              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100 disabled:opacity-50 transition"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
                title="Sign in with Microsoft"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
                  <rect width="10" height="10" x="1" y="1" fill="#F25022" />
                  <rect width="10" height="10" x="12" y="1" fill="#7FBA00" />
                  <rect width="10" height="10" x="1" y="12" fill="#00A4EF" />
                  <rect width="10" height="10" x="12" y="12" fill="#FFB900" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?
            <Link 
              to="/register" 
              className="text-blue-600 ml-1 hover:underline"
              onClick={(e) => {
                if (isLoading) {
                  e.preventDefault();
                  showErrorToast("Please wait for login to complete");
                }
              }}
            >
              Create one here
            </Link>
          </p>
        </div>

        <div className="hidden lg:flex w-1/2 bg-blue-600 text-white 
                items-center justify-center p-10 rounded-l-full">
          <div className="text-center max-w-sm">
            <h1 className="text-5xl font-bold mb-4">Welcome!</h1>
            <p className="text-lg">Access your account to continue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;