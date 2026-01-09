import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearTokens,
} from "../utils/token";
import axios from "axios";

const vendorApi = axios.create({
  baseURL:
    import.meta.env.VITE_VENDOR_API_BASE_URL ||
    "http://localhost:8002/api/vendors/",
  withCredentials: false,
});

// Attach access token if available
vendorApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token via AUTH service
vendorApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    if (
      error.response?.status === 401 &&
      !original._retry &&
      getRefreshToken()
    ) {
      original._retry = true;
      try {
        const authServiceUrl =
          "http://localhost:8000/api/auth/token/refresh/";

        const resp = await axios.post(authServiceUrl, {
          refresh: getRefreshToken(),
        });

        const newAccess = resp.data.access;
        saveAccessToken(newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return vendorApi(original);
      } catch (e) {
        clearTokens();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default vendorApi;