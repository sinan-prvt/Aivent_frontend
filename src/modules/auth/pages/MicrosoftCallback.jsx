import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../core/api/axios";
import { useAuth } from "../../../app/providers/AuthProvider";
import { saveAccessToken, saveRefreshToken } from "../../../core/utils/token";

export default function MicrosoftCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      alert("No code received from Microsoft");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await api.post("/auth/social/microsoft/", { code });
        const { access, refresh, user } = res.data;

        saveAccessToken(access);
        saveRefreshToken(refresh);

        login(access, refresh, user);

        if (user?.role === "admin") navigate("/admin");
        else if (user?.role === "vendor") navigate("/vendor");
        else navigate("/");
      } catch (err) {
        console.error("Microsoft callback error:", err);
        alert("Microsoft login failed");
        navigate("/login");
      }
    })();
  }, []);

  return <div className="min-h-screen flex items-center justify-center">Signing you in...</div>;
}
