import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth.api";

function parseErrors(err) {
  try {
    const data = err?.response?.data;
    if (!data) return { non_field_errors: ["Network error"] };

    if (data.errors) return data.errors;
    if (data.detail) return { non_field_errors: [String(data.detail)] };
    if (data.message) return { non_field_errors: [String(data.message)] };

    const output = {};
    if (typeof data === "object") {
      for (const [key, value] of Object.entries(data)) {
        output[key] = Array.isArray(value) ? value.map(String) : [String(value)];
      }
      return output;
    }

    return { non_field_errors: [String(data)] };
  } catch {
    return { non_field_errors: ["Error parsing server response"] };
  }
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const email = params.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [nonField, setNonField] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email) {
      setNonField("Missing email. Please restart password reset.");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setLoading(true);
    setErrors({});
    setNonField("");

    if (!newPassword || newPassword.length < 8) {
      setErrors({ new_password: ["Password must be at least 8 characters"] });
      setLoading(false);
      return;
    }

    if (newPassword !== confirm) {
      setErrors({ confirm: ["Passwords do not match"] });
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email, newPassword);

      navigate("/login", { replace: true });
    } catch (err) {
      const parsed = parseErrors(err);
      const { non_field_errors, ...fieldErrors } = parsed;

      setErrors(fieldErrors);
      if (non_field_errors) {
        setNonField(non_field_errors.join(" | "));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl border shadow max-w-md">
          <p className="text-red-600 text-center font-medium">
            Password reset email missing. Restart process.
          </p>

          <div className="text-center mt-3">
            <a className="text-indigo-600 hover:underline text-sm" href="/forgot-password">
              Restart Reset Process
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-2">Reset Password</h2>

        <p className="text-center text-gray-600 mb-4 text-sm">
          Email: <span className="font-semibold">{email}</span>
        </p>

        {nonField && (
          <div className="bg-red-100 text-red-700 rounded p-2 mb-3">{nonField}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setErrors({});
                setNewPassword(e.target.value);
              }}
              className={`w-full px-3 py-2 border rounded ${
                errors.new_password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="At least 8 characters"
            />
            {errors.new_password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.new_password.join(" ")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => {
                setErrors({});
                setConfirm(e.target.value);
              }}
              className={`w-full px-3 py-2 border rounded ${
                errors.confirm ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Confirm your new password"
            />
            {errors.confirm && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirm.join(" ")}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
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
