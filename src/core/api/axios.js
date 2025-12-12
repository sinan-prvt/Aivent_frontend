// src/core/api/axios.js
import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { getAccessToken, getRefreshToken, saveAccessToken, clearTokens } from "../utils/token";

// baseURL should be the API root (no trailing slash needed)
export const api = axios.create({
  baseURL: API_BASE_URL || "http://localhost:8000/api", // make sure env provides "http://localhost:8000/api"
  withCredentials: false,
});

// attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`; // <-- correct template
  }
  return config;
});

// response interceptor handles refresh token flow
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    const status = error.response?.status;
    // only try refresh once per request
    if (status === 401 && !original._retry && getRefreshToken()) {
      original._retry = true;
      try {
        // use the same api instance so baseURL is applied consistently
        const refreshResp = await api.post("/auth/token/refresh/", {
          refresh: getRefreshToken(),
        });

        const newAccess = refreshResp?.data?.access;
        if (!newAccess) throw new Error("No access token in refresh response");

        // persist token and update header on original request
        saveAccessToken(newAccess);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;

        return api(original); // retry
      } catch (err) {
        // clear tokens and forward error (user must re-login)
        try { clearTokens(); } catch(e){/* ignore */} 
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
