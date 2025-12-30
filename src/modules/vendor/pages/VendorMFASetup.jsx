import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyVendorMFA } from "../api/vendor.api";
import { useAuth } from "@/app/providers/AuthProvider";
import { saveAccessToken, saveRefreshToken } from "@/core/utils/token";
import { fetchMe } from "@/core/api/axios";

const VendorMFASetup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState("");
  const [qr, setQr] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("mfa_payload");
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }

    const payload = JSON.parse(raw);

    // ✅ SETUP REQUIRES qr_code + mfa_token
    if (!payload.mfa_token || !payload.qr_code) {
      navigate("/login", { replace: true });
      return;
    }

    setQr(payload.qr_code);
  }, [navigate]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      alert("Enter 6 digit code");
      return;
    }

    const raw = sessionStorage.getItem("mfa_payload");
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }

    const payload = JSON.parse(raw);
    console.log("🔵 MFA Setup - Payload:", payload);
    console.log("🔵 MFA Setup - Code:", code);

    try {
      const requestPayload = {
        mfa_token: payload.mfa_token.trim(),
        code: code.trim(),
      };
      console.log("🔵 MFA Setup - Request:", requestPayload);

      const res = await verifyVendorMFA(requestPayload);
      console.log("🔵 MFA Setup - Response:", res);
      console.log("🔵 MFA Setup - Response data:", res.data);

      sessionStorage.setItem("skip_me_once", "1");

      saveAccessToken(res.data.access);
      saveRefreshToken(res.data.refresh);

      // Force fetch user
      const me = await fetchMe();
      login(res.data.access, res.data.refresh, me.data);
      sessionStorage.removeItem("mfa_payload");

      navigate("/vendor/dashboard", { replace: true });
    } catch (err) {
      console.error("🔴 MFA Setup - Error:", err);
      console.error("🔴 MFA Setup - Error response:", err.response);
      alert(err.response?.data?.detail || err.message || "Invalid MFA code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-semibold">Set up MFA</h2>

      {qr && <img src={qr} alt="MFA QR" className="w-48" />}

      <input
        className="border p-2 rounded text-center"
        placeholder="6-digit code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
      />

      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Verify & Continue
      </button>
    </div>
  );
};

export default VendorMFASetup;


