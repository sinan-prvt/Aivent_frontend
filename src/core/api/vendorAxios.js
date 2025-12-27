import axios from "axios";

const vendorApi = axios.create({
  baseURL: import.meta.env.VITE_VENDOR_API_BASE_URL || "http://localhost:8002/api/vendors",
  withCredentials: false,
});

export default vendorApi;
