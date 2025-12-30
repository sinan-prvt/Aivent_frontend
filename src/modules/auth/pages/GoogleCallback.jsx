import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../core/api/axios";
import { useAuth } from "../../../app/providers/AuthProvider";
import { saveAccessToken, saveRefreshToken } from "../../../core/utils/token";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      alert("No code received from Google");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await api.post("/auth/social/google/", { code });

        const { access, refresh, user } = res.data;

        saveAccessToken(access);
        saveRefreshToken(refresh);

        login(access, refresh, user);

        if (user.role === "admin") navigate("/admin", { replace: true });
        else if (user.role === "vendor") navigate("/vendor/dashboard", { replace: true });
        else navigate("/", { replace: true });

      } catch (err) {
        console.error(err);
        alert("Google login failed");
        navigate("/login");
      }
    })();
  }, []);

  return <p>Signing you in...</p>;
}
