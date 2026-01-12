import axios from "axios";
import { getAccessToken } from "../../../core/utils/token";

const API_BASE_URL = "http://localhost:8006/api/bookings/";

const bookingApi = axios.create({
    baseURL: API_BASE_URL,
});

// Attach access token
bookingApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createBooking = async (bookingData) => {
    const response = await bookingApi.post("/", bookingData);
    return response.data;
};

export const getBookingDetails = async (bookingId) => {
    const response = await bookingApi.get(`/${bookingId}/`);
    return response.data;
};

export const confirmBooking = async (bookingId) => {
    const response = await bookingApi.post(`/${bookingId}/confirm/`);
    return response.data;
};
