import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
  clearTokens,
} from "../../core/utils/token";

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
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.email) {
          // ensure displayName exists
          parsed.displayName = makeDisplayName(parsed);
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error("Invalid user JSON:", e);
    }

    setInitialized(true);
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
    };

    window.addEventListener("force-logout", handleForceLogout);

    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  const login = (access, refresh, userObj) => {
    saveAccessToken(access);
    saveRefreshToken(refresh);

    const u = { ...userObj, displayName: makeDisplayName(userObj) };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
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
