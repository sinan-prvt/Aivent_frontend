import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyMFA } from "../api/mfa.api";
import {
  saveAccessToken,
  saveRefreshToken,
} from "../../../core/utils/token";

function parseErrors(err) {
  try {
    const data = err?.response?.data;
    if (!data) return { non_field_errors: ["Network error"] };

    if (data.errors) return data.errors;

    if (data.detail) return { non_field_errors: [data.detail] };

    if (data.message) return { non_field_errors: [data.message] };

    return { non_field_errors: ["Unknown error"] };
  } catch {
    return { non_field_errors: ["Error parsing backend response"] };
  }
}

export default function VerifyMFA() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const session_id = params.get("session_id");
  const email = params.get("email") || "your email";

  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [nonField, setNonField] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-medium">
          Invalid MFA session. Please login again.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setNonField("");

    if (!code || code.length < 4) {
      setErrors({ code: ["Enter a valid 6-digit code"] });
      setLoading(false);
      return;
    }

    try {
      const res = await verifyMFA(session_id, code);

      const access = res.data.access;
      const refresh = res.data.refresh;

      saveAccessToken(access);
      saveRefreshToken(refresh);

      const rawUser = localStorage.getItem("user");
      let user = null;

      try {
        if (rawUser) user = JSON.parse(rawUser);
      } catch {}

      if (user?.role === "vendor") navigate("/vendor", { replace: true });
      else if (user?.role === "admin") navigate("/admin", { replace: true });
      else navigate("/customer", { replace: true });
    } catch (err) {
      const parsed = parseErrors(err);
      const { non_field_errors, ...fieldErrors } = parsed;

      setErrors(fieldErrors);
      if (non_field_errors)
        setNonField(non_field_errors.join(" | "));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">MFA Verification</h2>

        <p className="text-gray-600 text-center text-sm mb-4">
          Enter the 6-digit code from your authenticator app
        </p>

        <p className="text-sm text-center text-gray-700 mb-4">
          Email: <span className="font-semibold">{email}</span>
        </p>

        {nonField && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {nonField}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">TOTP Code</label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${
                errors.code ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="123456"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">
                {errors.code.join(" ")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <a href="/login" className="text-indigo-600 hover:underline">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}
