import axios from "@/core/api/axiosInstance"; 
import { AUTH_KEYS } from "@/core/constants/authKeys";

export const logoutEverywhere = async () => {
  try {
    // Call your backend logout-everywhere endpoint
    await axios.post("/auth/logout-everywhere/", {
      refresh_token: localStorage.getItem(AUTH_KEYS.REFRESH),
    });
  } catch (error) {
    console.error("Logout everywhere failed:", error);
  }

  // Clear stored auth tokens
  localStorage.removeItem(AUTH_KEYS.ACCESS);
  localStorage.removeItem(AUTH_KEYS.REFRESH);
  localStorage.removeItem(AUTH_KEYS.USER);

  return true; // allow UI to proceed
};
