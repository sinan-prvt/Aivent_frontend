import { useState } from "react";
import { registerUser } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, ''); // Remove non-digits
      const formatted = cleaned.slice(0, 10); // Limit to 10 digits
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character (@$!%*?&).";
    }

    setErrors(newErrors);
    
    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // Check if reCAPTCHA is available
      if (!window.grecaptcha || !window.grecaptcha.execute) {
        throw new Error("reCAPTCHA not loaded. Please refresh the page.");
      }

      await new Promise((resolve) => window.grecaptcha.ready(resolve));

      const token = await window.grecaptcha.execute(
        "6LdwKQ8sAAAAAE6NapNtdAu20LFs3HRs9iFd6ACx",
        { action: "register" }
      );

      const response = await registerUser({
        ...formData,
        recaptcha_token: token,
      });

      // Show success toast
      toast.success("Registration successful! Redirecting to OTP verification...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate(
          `/otp-verify?email=${encodeURIComponent(formData.email)}&purpose=email_verify`,
          { replace: true }
        );
      }, 2000);

    } catch (err) {
      console.error("REGISTER ERROR:", err?.response?.data);
      
      // Show error toast with detailed message
      let errorMessage = "Registration failed. Please try again.";
      
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: "bg-gray-200", text: "" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/(?=.*[a-z])/.test(password)) strength += 1;
    if (/(?=.*[A-Z])/.test(password)) strength += 1;
    if (/(?=.*\d)/.test(password)) strength += 1;
    if (/(?=.*[@$!%*?&])/.test(password)) strength += 1;

    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    
    return {
      strength: (strength / 5) * 100,
      color: colors[strength - 1] || "bg-gray-200",
      text: texts[strength - 1] || ""
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);


   return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      {/* Toast Container */}
      <ToastContainer />
      
      <div className=" bg-white rounded-3xl shadow-xl max-w-4xl w-full flex overflow-hidden h-[580px]">
          {/* Left Panel - Registration Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mb-3">Fill your details below to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  +91
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  maxLength="10"
                  className={`w-full pl-12 pr-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="flex justify-between mt-1">
                {errors.phone && (
                  <p className="text-red-500 text-xs flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.phone}
                  </p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {formData.phone.length}/10
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50 pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.text === "Strong" ? "text-green-600" :
                      passwordStrength.text === "Good" ? "text-blue-600" :
                      passwordStrength.text === "Fair" ? "text-yellow-600" :
                      passwordStrength.text === "Weak" ? "text-orange-600" : "text-red-600"
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  {/* <ul className="text-xs text-gray-600 mt-2 space-y-1">
                    <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                      <span className="mr-1">{formData.password.length >= 8 ? '✓' : '○'}</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <span className="mr-1">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}</span>
                      Lowercase letter
                    </li>
                    <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <span className="mr-1">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
                      Uppercase letter
                    </li>
                    <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <span className="mr-1">{/(?=.*\d)/.test(formData.password) ? '✓' : '○'}</span>
                      Number
                    </li>
                    <li className={`flex items-center ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <span className="mr-1">{/(?=.*[@$!%*?&])/.test(formData.password) ? '✓' : '○'}</span>
                      Special character (@$!%*?&)
                    </li>
                  </ul> */}
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Register Button with Loading Animation */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl 
                         font-semibold hover:bg-blue-700 transition disabled:bg-blue-400
                         disabled:cursor-not-allowed relative min-h-[48px] shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white border-opacity-30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-5 h-5 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
                  </div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel - Welcome Message */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 text-white 
                        items-center justify-center p-10 rounded-l-full">
          <div className="text-center max-w-sm">
            <h1 className="text-5xl font-bold mb-4">Welcome!</h1>
            <p className="text-lg">Join our community today.</p>
            
            {/* Registration Benefits List */}
            <div className="mt-10 text-left space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Secure account with OTP verification</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Access all platform features</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;