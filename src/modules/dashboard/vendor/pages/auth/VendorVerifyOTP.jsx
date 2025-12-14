import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import VendorOTPInput from "../../components/auth/VendorOTPInput";
import { verifyVendorOtp } from "../../api/vendorRegisterApi";

export default function VendorVerifyOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.vendorId || !state?.email) {
    return <p>Invalid access</p>;
  }

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyVendorOtp({
        vendor_id: state.vendorId,
        otp,
        email: state.email,
      });

      alert("Vendor verified successfully");
      navigate("/vendor/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Verify Vendor OTP</h2>
      <VendorOTPInput value={otp} onChange={setOtp} />
      <button onClick={handleVerify} disabled={loading}>
        Verify
      </button>
    </>
  );
}
