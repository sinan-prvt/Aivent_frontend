import axios from "axios";
import { getAccessToken } from "../../../core/utils/token";

const API_BASE_URL = "http://localhost:8007/api/payments/";

const paymentApi = axios.create({
    baseURL: API_BASE_URL,
});

// Attach access token (payment service uses stateless JWT)
paymentApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const initiatePayment = async (paymentData) => {
    const response = await paymentApi.post("/initiate/", paymentData);
    return response.data;
};

export const verifyPayment = async (verificationData) => {
    const response = await paymentApi.post("/verify/", verificationData);
    return response.data;
};

// For testing/mocking
export const triggerMockSuccess = async (razorpayOrderId) => {
    const response = await paymentApi.post("/mock-success/", { razorpay_order_id: razorpayOrderId });
    return response.data;
};
