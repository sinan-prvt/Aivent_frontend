import axios from "@/core/api/axiosInstance";

export const vendorLogin = async (payload) => {
  const res = await axios.post("/api/auth/login/", payload);
  return res.data;
};

export const verifyVendorMFA = async (payload) => {
  const res = await axios.post("/api/auth/verify-mfa/", payload);
  return res.data;
};
