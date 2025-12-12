import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOTP, sendOTP } from "../api/auth.api";

function parseErrors(err) {
  try {
    const data = err.response?.data;
    if (!data) return { non_field_errors: ["Network error"] };
    if (data.errors) return data.errors;
    return { non_field_errors: [data.message || "Unexpected error"] };
  } catch {
    return { non_field_errors: ["Unknown error"] };
  }
}

export default function OTPVerify() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const email = params.get("email");
  const purpose = params.get("purpose") || "email_verify";

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [nonField, setNonField] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  useEffect(() => {
    if (!email || !purpose) {
      setNonField("Invalid OTP verification link");
    }
  }, [email, purpose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setNonField("");
    setLoading(true);

    if (!otp || otp.length < 4) {
      setErrors({ otp: ["Enter valid OTP"] });
      setLoading(false);
      return;
    }

    try {
      await verifyOTP(email, purpose, otp);


      if (purpose === "email_verify") {
        navigate("/login", { replace: true });
      }

      if (purpose === "reset_password") {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
      }
    } catch (err) {
      const parsed = parseErrors(err);
      const { non_field_errors, otp, ...rest } = parsed;

      setErrors({ otp, ...rest });
      setNonField(non_field_errors?.join(" | "));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess("");
    try {
      await sendOTP(email, purpose);
      setResendSuccess("OTP sent again to your email");
    } catch {
      setNonField("Could not resend OTP. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Enter OTP
        </h2>
        <p className="text-center text-gray-600 text-sm mb-4">
          We sent a code to <span className="font-semibold">{email}</span>
        </p>

        {nonField && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {nonField}
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
            {resendSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${
                errors.otp ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter the 6-digit code"
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">
                {errors.otp.join(" ")}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <p className="text-center text-sm mt-4">
          <a className="text-indigo-600 hover:underline" href="/register">
            Back to Register
          </a>
        </p>
      </div>
    </div>
  );
}
