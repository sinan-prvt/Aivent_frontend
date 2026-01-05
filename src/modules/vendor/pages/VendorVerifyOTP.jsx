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
        <div className="max-w-sm w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Session Expired
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Your registration session has expired. Please restart the process.
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem("vendor_id");
                sessionStorage.removeItem("vendor_email");
                navigate("/vendor/apply");
              }}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Restart Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every(digit => digit !== "") && index === 5) {
      const fullOtp = newOtp.join("");
      handleSubmit(fullOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
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
      
      setIsVerified(true);
      
      sessionStorage.removeItem("vendor_id");
      sessionStorage.removeItem("vendor_email");
      
      setTimeout(() => {
        navigate("/vendor/pending");
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP code. Please try again.");
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
      await resendVendorOTP({ email });
      setTimeLeft(60);
      setShowResendSuccess(true);
      setError("");
      
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {/* Back Button - Compact */}
        <button
          onClick={() => navigate("/vendor/apply")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm mb-3">
              Enter the 6-digit code sent to
            </p>
            
            {/* Email Display */}
            <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gray-50 rounded-full mb-4 text-sm">
              <Mail className="w-3 h-3 text-gray-400 mr-1.5" />
              <span className="font-medium text-gray-900">
                {maskEmail(email)}
              </span>
              <Lock className="w-2.5 h-2.5 text-gray-400 ml-1.5" />
            </div>
          </div>

          {/* Success Message */}
          {showResendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-sm animate-fade-in">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              <span className="ml-2 text-green-800 font-medium">New OTP sent successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span className="ml-2 text-red-600">{error}</span>
            </div>
          )}

          {/* OTP Input */}
          <form onSubmit={submitForm} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                6-digit verification code
              </label>
              <div className="flex justify-center space-x-2 mb-3">
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
                      className={`w-10 h-10 text-center text-lg font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        error 
                          ? "border-red-300 bg-red-50" 
                          : digit 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting || isVerified}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <div className="inline-flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full text-xs">
                  <Clock className="w-3 h-3 mr-1.5" />
                  <span>Resend in <span className="font-semibold">{timeLeft}s</span></span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full"
                >
                  <RefreshCw className={`w-3 h-3 mr-1.5 ${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.some(digit => digit === "") || isVerified}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center text-sm ${
                isSubmitting || otp.some(digit => digit === "") || isVerified
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-200"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : isVerified ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Verified
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-1.5" />
                  Verify & Continue
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-gray-500 text-xs">
              Check spam folder or{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timeLeft > 0 || isResending}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                request new code
              </button>
            </p>
          </div>
        </div>

        {/* Progress Indicator - Compact */}
        <div className="mt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="w-8 h-0.5 bg-blue-600"></div>
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-xs font-bold">
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span className="font-medium">Register</span>
            <span className="font-medium text-blue-600">Verify</span>
            <span className="text-gray-500">Pending</span>
          </div>
        </div>

        {/* Security Note - Compact */}
        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-xs">
            <span className="font-medium">Note:</span> OTP valid for 10 minutes. Do not share this code.
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {isVerified && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center animate-scale-in max-w-xs">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Verified!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Account verified successfully
            </p>
            <div className="w-10 h-1 bg-linear-to-r from-green-400 to-blue-500 rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}