import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8001/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
