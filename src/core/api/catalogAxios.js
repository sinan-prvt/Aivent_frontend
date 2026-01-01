
import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
    clearTokens,
} from "../utils/token";

// Catalog Service runs on port 8003
const API_BASE_URL = "http://localhost:8003/api";

const catalogApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
});

// Attach access token to requests
catalogApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh logic (same as core axios)
catalogApi.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (!original) return Promise.reject(error);

        if (error.response?.status === 401 && !original._retry && getRefreshToken()) {
            original._retry = true;
            try {
                // We use the AUTH service for refreshing tokens (usually on port 8000 via the main api instance or manually)
                // Here we can manually hit the refresh endpoint using the base axios to avoid circular dependency or context issues,
                // OR import the main 'api' to refresh.
                // However, usually refreshing is done against the Auth service.
                // Let's assume the auth service is at logical port 8000.
                // To keep it simple and consistent with `axios.js`, we'll try to refresh.
                // NOTE: The refresh endpoint is likely on the AUTH service, not Catalog service.
                // We should probably explicitly use the Auth service URL for refreshing.

                const authServiceUrl = "http://localhost:8000/api/auth/token/refresh/";
                const resp = await axios.post(authServiceUrl, {
                    refresh: getRefreshToken(),
                });

                const newAccess = resp.data.access;
                saveAccessToken(newAccess);

                original.headers.Authorization = `Bearer ${newAccess}`;
                return catalogApi(original);
            } catch (e) {
                clearTokens();
                // optionally redirect to login
            }
        }
        return Promise.reject(error);
    }
);

export default catalogApi;
