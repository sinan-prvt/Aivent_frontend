import axios from "axios";
import { API_BASE_URL } from "../config/env";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearTokens,
} from "../utils/token";

// ✅ CREATE INSTANCE ONCE
const api = axios.create({
  baseURL: API_BASE_URL || "http://localhost:8000/api",
  withCredentials: false,
});

// ✅ /auth/me
export const fetchMe = () => api.get("/api/auth/me/");

// ✅ attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;

// ✅ refresh token flow - FIXED to prevent infinite loop
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    // 🚫 NEVER retry the refresh endpoint itself - this prevents infinite loop
    if (original.url?.includes("/token/refresh")) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle 401 errors for other requests
    if (
      error.response?.status === 401 &&
      !original._retry &&
      getRefreshToken() &&
      !isRefreshing
    ) {
      original._retry = true;
      isRefreshing = true;

      try {
        const resp = await axios.post(
          `${API_BASE_URL || "http://localhost:8000/api"}/api/auth/token/refresh/`,
          { refresh: getRefreshToken() }
        );

        const newAccess = resp.data.access;
        saveAccessToken(newAccess);
        isRefreshing = false;

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshError) {
        isRefreshing = false;
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
