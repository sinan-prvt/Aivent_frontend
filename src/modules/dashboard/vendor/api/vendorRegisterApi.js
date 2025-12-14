import axios from "@/core/api/axiosInstance";

export const applyVendor = async (payload) => {
  const res = axios.post("http://localhost:8000/api/auth/register-vendor/", data);
  return res.data;
};

export const verifyVendorOtp = async (payload) => {
  const res = await axios.post("/api/vendors/verify-otp/", payload);
  return res.data;
};
