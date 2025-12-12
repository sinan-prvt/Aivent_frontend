import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendResetOTP } from "../api/auth.api";

function parseErrors(err) {
  try {
    const data = err?.response?.data;
    if (!data) return { non_field_errors: ["Network error"] };

    if (data.errors) return data.errors;
    if (data.detail) return { non_field_errors: [String(data.detail)] };
    if (data.message) return { non_field_errors: [String(data.message)] };

    const out = {};
    if (typeof data === "object") {
      for (const [k, v] of Object.entries(data)) {
        out[k] = Array.isArray(v) ? v.map(String) : [String(v)];
      }
      return out;
    }

    return { non_field_errors: [String(data)] };
  } catch {
    return { non_field_errors: ["Error parsing server response"] };
  }
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [nonField, setNonField] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setNonField("");
    setLoading(true);

    if (!email) {
      setErrors({ email: ["Email is required"] });
      setLoading(false);
      return;
    }

    try {
      await sendResetOTP(email);

      navigate(
  `/otp-verify?email=${encodeURIComponent(email)}&purpose=reset_password`
);
    } catch (err) {
      const parsed = parseErrors(err);

      const { non_field_errors, ...fields } = parsed;

      setErrors(fields);
      if (non_field_errors) {
        setNonField(non_field_errors.join(" | "));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-600 mb-4 text-sm">
          Enter your email address. We’ll send you an OTP to reset your password.
        </p>

        {nonField && (
          <div className="bg-red-100 text-red-700 rounded p-2 mb-3">
            {nonField}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setErrors({});
                setEmail(e.target.value);
              }}
              className={`w-full px-3 py-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.join(" ")}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <a href="/login" className="text-indigo-600 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
