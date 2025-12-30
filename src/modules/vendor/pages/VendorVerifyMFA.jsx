import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyVendorMFA } from "../api/vendor.api";
import { useAuth } from "@/app/providers/AuthProvider";
import { saveAccessToken, saveRefreshToken } from "@/core/utils/token";
import { fetchMe } from "@/core/api/axios";

export default function VendorVerifyMFA() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔐 Read MFA payload ONCE
  const raw = sessionStorage.getItem("mfa_payload");
  const payload = raw ? JSON.parse(raw) : null;

  // ✅ ONLY REQUIRE mfa_token
  useEffect(() => {
    if (!payload?.mfa_token) {
      navigate("/login", { replace: true });
    }
  }, [navigate, payload]);

  if (!payload?.mfa_token) return null;

  const submit = async (e) => {
  e.preventDefault();
  setError("");

  if (code.length !== 6) {
    setError("Enter 6 digit code");
    return;
  }

  try {
    const res = await verifyVendorMFA({
      mfa_token: payload.mfa_token.trim(),
      code: code.trim(),
    });

    // 1️⃣ Save tokens
    saveAccessToken(res.data.access);
    saveRefreshToken(res.data.refresh);

    // 2️⃣ Fetch user explicitly
    const me = await fetchMe();

    // 3️⃣ Login with real user
    login(res.data.access, res.data.refresh, me.data);

    // 4️⃣ Cleanup MFA state
    sessionStorage.removeItem("mfa_payload");
    sessionStorage.setItem("skip_me_once", "1");

    // 5️⃣ Redirect
    navigate("/vendor/dashboard", { replace: true });

  } catch (err) {
    console.error("MFA Verify Error:", err);
    setError(
      err.response?.data?.detail ||
      err.message ||
      "Invalid MFA code"
    );
  }
};

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enter MFA Code</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            type="submit"
            disabled={code.length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
