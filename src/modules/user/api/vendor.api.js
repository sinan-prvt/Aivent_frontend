import axios from "axios";
import { getAccessToken, getRefreshToken, saveAccessToken, clearTokens } from "@/core/utils/token";

// Vendor Service runs on port 8002
const API_BASE_URL = "http://localhost:8002/api";

const vendorApi = axios.create({
    baseURL: API_BASE_URL,
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

// Refresh token check
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
            }
        }
        return Promise.reject(error);
    }
);

export const getPublicVendorDetail = async (userId) => {
    const response = await vendorApi.get(`/vendor/public/vendors/${userId}/`);
    return response.data;
};

export default vendorApi;
