import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8002/api",  // adjust if needed
  withCredentials: true,
});

export default axiosInstance;
