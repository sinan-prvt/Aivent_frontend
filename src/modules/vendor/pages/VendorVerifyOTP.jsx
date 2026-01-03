import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { confirmVendorOTP, resendVendorOTP } from "../api/vendor.api";
import { 
  Shield, 
  Clock, 
  RefreshCw, 
  Key, 
  ArrowLeft, 
  Mail, 
  CheckCircle,
  AlertCircle,
  Lock
} from "lucide-react";

export default function VendorVerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const vendor_id = sessionStorage.getItem("vendor_id");
  const email = sessionStorage.getItem("vendor_email");

  // Handle resend cooldown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0].focus(), 100);
    }
  }, []);

  if (!vendor_id || !email) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Session Expired
            </h2>
            <p className="text-gray-600 mb-6">
              Your registration session has expired. Please restart the vendor registration process.
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem("vendor_id");
                sessionStorage.removeItem("vendor_email");
                navigate("/vendor/apply");
              }}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200"
            >
              Restart Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (index, value) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && index === 5) {
      const fullOtp = newOtp.join("");
      handleSubmit(fullOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === "Enter" && index === 5 && otp.every(digit => digit !== "")) {
      handleSubmit(otp.join(""));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      setError("");
      
      // Auto-submit after paste
      setTimeout(() => {
        handleSubmit(pastedData);
      }, 100);
    } else {
      setError("Please paste a valid 6-digit code");
    }
  };

  const handleSubmit = async (submittedOtp = null) => {
    const verificationOtp = submittedOtp || otp.join("");
    
    if (verificationOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await confirmVendorOTP({ vendor_id, email, otp: verificationOtp });
      
      // Show success state
      setIsVerified(true);
      
      // Clear session storage after successful verification
      sessionStorage.removeItem("vendor_id");
      sessionStorage.removeItem("vendor_email");
      
      // Navigate after a brief delay for better UX
      setTimeout(() => {
        navigate("/vendor/pending");
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP code. Please try again.");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0 || isResending) return;

    setIsResending(true);
    try {
      await resendVendorOTP({ email }); // Fixed: resendVendorOTP now calls auth service and only needs email
      setTimeLeft(60);
      setShowResendSuccess(true);
      setError("");
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowResendSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2 
      ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart.slice(-1)
      : '*'.repeat(localPart.length);
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Success State Overlay */}
          {isVerified && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 text-center animate-scale-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  OTP Verified!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your vendor account has been successfully verified.
                </p>
                <div className="w-12 h-1 bg-linear-to-r from-green-400 to-blue-500 rounded-full mx-auto"></div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={() => {
              navigate("/vendor/apply");
            }}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Registration
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mb-4">
              We've sent a 6-digit verification code to your email address
            </p>
            
            {/* Email Display */}
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 rounded-full mb-6">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <span className="font-medium text-gray-900">
                {maskEmail(email)}
              </span>
              <Lock className="w-3 h-3 text-gray-400 ml-2" />
            </div>
          </div>

          {/* Success Message for Resend */}
          {showResendSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <div className="ml-3">
                <p className="text-green-800 text-sm font-medium">
                  New OTP sent successfully! Check your email.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div className="ml-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Important:</strong> This OTP is valid for 10 minutes only. 
              Do not share this code with anyone for security reasons.
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={submitForm} className="space-y-8">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit verification code
              </label>
              <div className="flex justify-center space-x-2 md:space-x-3 mb-2">
                {otp.map((digit, index) => (
                  <div key={index} className="relative">
                    <input
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        error 
                          ? "border-red-300 bg-red-50 animate-shake" 
                          : digit 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting || isVerified}
                    />
                    {index === 2 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-px h-6 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-500 text-sm">
                  Type or paste the 6-digit code
                </p>
              </div>
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <div className="inline-flex items-center text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Resend code in <span className="font-semibold">{timeLeft}s</span>
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Sending..." : "Resend Verification Code"}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || otp.some(digit => digit === "") || isVerified}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                  isSubmitting || otp.some(digit => digit === "") || isVerified
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : isVerified ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verified Successfully
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5 mr-2" />
                    Verify & Continue
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timeLeft > 0 || isResending}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                request a new one
              </button>
            </p>
          </div>
        </div>

        {/* Registration Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="w-16 h-1 bg-blue-600"></div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 px-4">
            <span className="font-medium">Registration</span>
            <span className="font-medium text-blue-600">Verification</span>
            <span>Pending Review</span>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Secure Verification Process</span>
          </div>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            This verification ensures the security of your vendor account and protects against unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
}