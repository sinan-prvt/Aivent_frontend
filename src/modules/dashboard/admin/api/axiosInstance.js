// src/modules/dashboard/admin/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/admin", // all admin calls will be relative to this
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Optional: response interceptor for common error handling
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    // example: token expired handling can go here
    if (err.response?.status === 401) {
      // optionally redirect to login, or expose a callback
      console.warn("Unauthorized - maybe token expired");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
