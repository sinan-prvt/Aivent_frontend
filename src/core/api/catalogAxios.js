import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearTokens,
} from "../utils/token";

// Catalog Service runs on port 8003
const API_BASE_URL = "http://localhost:8003/api/catalog";

const catalogApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Attach access token if available
catalogApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token via AUTH service
catalogApi.interceptors.response.use(
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
        return catalogApi(original);
      } catch (e) {
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

export default catalogApi;
