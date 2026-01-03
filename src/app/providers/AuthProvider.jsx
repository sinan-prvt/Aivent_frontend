import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
  clearTokens,
} from "../../core/utils/token";
import { fetchMe } from "../../core/api/axios";

export const AuthContext = createContext(null);


function makeDisplayName(user) {
  if (!user) return null;
  return user.name || user.displayName || user.username || user.first_name ||
    (user.email ? user.email.split("@")[0] : null) || null;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // 1️⃣ Restore cached user immediately
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch { }
      }

      // 2️⃣ Token logic
      const token = getAccessToken();
      const skipMeOnce = sessionStorage.getItem("skip_me_once");

      // 3️⃣ Skip /auth/me ONCE (after MFA)
      if (!token || skipMeOnce) {
        sessionStorage.removeItem("skip_me_once");
        setInitialized(true);
        return;
      }

      // 4️⃣ Validate token
      try {
        const res = await fetchMe();
        let u = {
          ...res.data,
          displayName: makeDisplayName(res.data),
        };

        // 5️⃣ If vendor, fetch category & other profile details
        if (u.role === "vendor") {
          try {
            const { fetchVendorMe } = await import("../../modules/vendor/api/vendor.api");
            const vRes = await fetchVendorMe();
            // Merge but keep original ID and email as primary safely
            const vendorData = vRes.data;
            u = {
              ...u,
              category_id: vendorData.category_id,
              subcategory_ids: vendorData.subcategory_ids,
              business_name: vendorData.business_name,
              vendor_id: vendorData.id, // Store vendor-specific ID separately
              vendor_status: vendorData.status
            };
          } catch (err) {
            console.error("Failed to fetch vendor profile:", err);
          }
        }

        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } catch {
        clearTokens();
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, []);



  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
    };

    window.addEventListener("force-logout", handleForceLogout);

    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  const login = async (access, refresh, userObj) => {
    saveAccessToken(access);
    saveRefreshToken(refresh);

    let u = { ...userObj, displayName: makeDisplayName(userObj) };

    if (u.role === "vendor") {
      try {
        const { fetchVendorMe } = await import("../../modules/vendor/api/vendor.api");
        const vRes = await fetchVendorMe();
        const vendorData = vRes.data;
        u = {
          ...u,
          category_id: vendorData.category_id,
          subcategory_ids: vendorData.subcategory_ids,
          business_name: vendorData.business_name,
          vendor_id: vendorData.id,
          vendor_status: vendorData.status
        };
      } catch (err) {
        console.error("Failed to fetch vendor profile on login:", err);
      }
    }

    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    clearTokens();
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    initialized,
    token: getAccessToken(),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
