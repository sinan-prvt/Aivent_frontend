import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyVendorMFA } from "../../api/vendorAuthApi";
import { setVendorTokens } from "../../utils/vendorAuthStorage";
import MFAQRCode from "../../components/mfa/MFAQRCode";
import MFAOtpInput from "../../components/mfa/MFAOtpInput";

export default function VendorMFAVerify() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.email) return <p>Invalid MFA access</p>;

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyVendorMFA({
        email: state.email,
        code: otp,
      });

      setVendorTokens(res.access, res.refresh);
      navigate("/vendor/dashboard");

    } catch (e) {
      alert(e.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Vendor MFA</h2>
      <MFAQRCode src={state.qrCode} />
      <MFAOtpInput value={otp} onChange={setOtp} />
      <button onClick={handleVerify} disabled={loading}>Verify</button>
    </>
  );
}
