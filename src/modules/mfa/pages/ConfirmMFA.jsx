import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmEnableMFA } from "../api/mfa.api";

function parseErrors(err) {
  try {
    const data = err?.response?.data;
    if (!data) return { non_field_errors: ["Network error"] };

    if (data.errors) return data.errors;

    if (data.detail) return { non_field_errors: [String(data.detail)] };

    if (data.message) return { non_field_errors: [String(data.message)] };

    return { non_field_errors: ["Unknown server error"] };
  } catch {
    return { non_field_errors: ["Error parsing server response"] };
  }
}

export default function ConfirmMFA() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const secret = state?.secret || null;

  const [code, setCode] = useState("");
  const [nonField, setNonField] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!secret) {
      setNonField("MFA setup data missing. Please restart the enabling process.");
    }
  }, [secret]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!secret) return;

    setLoading(true);
    setErrors({});
    setNonField("");

    if (!code || code.length < 4) {
      setErrors({ code: ["Enter a valid 6-digit TOTP code"] });
      setLoading(false);
      return;
    }

    try {
      await confirmEnableMFA(secret, code);

      navigate("/vendor", { replace: true });
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

  if (!secret) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="p-6 rounded-xl border bg-white shadow max-w-md">
          <p className="text-red-600 text-center font-medium">
            MFA secret missing. Please restart enabling MFA.
          </p>

          <div className="text-center mt-3">
            <a
              href="/mfa/enable"
              className="text-indigo-600 hover:underline text-sm"
            >
              Restart MFA Setup
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Confirm MFA Setup
        </h2>

        <p className="text-gray-600 text-sm text-center mb-4">
          Enter the 6-digit verification code from your authenticator app.
        </p>

        {nonField && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {nonField}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              TOTP Code
            </label>
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
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm & Enable MFA"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <a href="/mfa/enable" className="text-indigo-600 hover:underline">
            Back to QR Setup
          </a>
        </p>
      </div>
    </div>
  );
}
