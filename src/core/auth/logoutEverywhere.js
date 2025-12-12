import axios from "@/core/api/axiosInstance";
import { AUTH_KEYS } from "@/core/constants/authKeys";

export const logoutCurrentDevice = async (navigate) => {
  const refresh = localStorage.getItem(AUTH_KEYS.REFRESH);

  try {
    if (refresh) {
      await axios.post("/api/auth/logout/", {
        refresh: refresh,
      });
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }

  // Clear auth tokens
  localStorage.removeItem(AUTH_KEYS.ACCESS);
  localStorage.removeItem(AUTH_KEYS.REFRESH);
  localStorage.removeItem(AUTH_KEYS.USER);

  if (navigate) navigate("/login", { replace: true });
};


export const logoutEverywhere = async (navigate) => {
  const refresh = localStorage.getItem(AUTH_KEYS.REFRESH);

  try {
    if (refresh) {
      await axios.post("/api/auth/logout-all/", {
        refresh: refresh,
      });
    }
  } catch (error) {
    console.error("Logout-all failed:", error);
  }

  // Clear auth tokens
  localStorage.removeItem(AUTH_KEYS.ACCESS);
  localStorage.removeItem(AUTH_KEYS.REFRESH);
  localStorage.removeItem(AUTH_KEYS.USER);

  if (navigate) navigate("/login", { replace: true });
};
