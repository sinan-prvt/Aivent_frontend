import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyVendorMFA } from "../api/vendor.api";
import { useAuth } from "@/app/providers/AuthProvider";

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

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      navigate("/login", { replace: true });
      return;
    }

    // 🚫 Setup page ONLY for first-time MFA
    if (payload.mfa_setup !== true) {
      navigate("/vendor/mfa", { replace: true });
      return;
    }

    setQr(payload.qr_code);
  }, [navigate]);

  const handleVerify = async () => {
    if (code.length !== 6) return alert("Enter valid code");

    const payload = JSON.parse(sessionStorage.getItem("mfa_payload"));

    try {
      const res = await verifyVendorMFA({
        mfa_token: payload.mfa_token,
        code,
      });

      login(res.data.access, res.data.refresh, res.data.user);

      sessionStorage.removeItem("mfa_payload");

      navigate("/vendor/dashboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.detail || "MFA setup failed");
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


