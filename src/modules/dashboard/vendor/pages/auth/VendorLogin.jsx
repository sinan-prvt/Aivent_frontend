import { useState } from "react";
import { vendorLogin } from "../../api/vendorAuthApi";
import { useNavigate } from "react-router-dom";
import { isVendorApprovalPending } from "../../utils/vendorStatusHelpers";


export default function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await vendorLogin({ email, password });

      if (res.mfa_required) {
        navigate("/vendor/mfa", {
          state: {
            email,
            qrCode: res.qr_code || null,
          },
        });
        return;
      }

      // non-MFA (rare for vendor)
      setVendorTokens(res.data.access, res.data.refresh);
      navigate("/vendor/dashboard");

    } catch (e) {
        if (isVendorApprovalPending(e)) {
            navigate("/vendor/pending");
            return;
        }

        alert(e.response?.data?.detail || "Login failed");
    }
  };

  return (
    <>
      <h2>Vendor Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} disabled={loading}>Login</button>
    </>
  );
}
