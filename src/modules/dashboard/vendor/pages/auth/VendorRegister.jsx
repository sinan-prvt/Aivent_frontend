import { useState } from "react";
import VendorRegisterForm from "../../components/auth/VendorRegisterForm";
import { applyVendor } from "../../api/vendorRegisterApi";
import { useNavigate } from "react-router-dom";

export default function VendorRegister() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await applyVendor(payload);

      navigate("/vendor/verify-otp", {
        state: {
          vendorId: res.vendor_id,
          email: payload.email,
        },
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Vendor Registration</h2>
      <VendorRegisterForm onSubmit={handleSubmit} loading={loading} />
    </>
  );
}
