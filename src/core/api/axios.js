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

// ✅ refresh token flow
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    if (error.response?.status === 401 && !original._retry && getRefreshToken()) {
      original._retry = true;
      try {
        const resp = await api.post("/api/auth/token/refresh/", {
          refresh: getRefreshToken(),
        });

        const newAccess = resp.data.access;
        saveAccessToken(newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
