import axios from "axios";

const chatAxios = axios.create({
    baseURL: "http://localhost:8005/api/chat/",
    withCredentials: true,
});

chatAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default chatAxios;
