// src/modules/vendor/api/vendor.api.js
import api from "@/core/api/axios";
import vendorApi from "@/core/api/vendorAxios";

/* =========================
   Vendor Registration Flow
========================= */

/* Apply as vendor */
export const applyVendor = (payload) =>
  vendorApi.post("/apply/", payload);

/* Confirm vendor OTP */
export const confirmVendorOTP = (payload) =>
  vendorApi.post("/confirm/", payload);

/* Resend vendor OTP */
export const resendVendorOTP = (payload) =>
  vendorApi.post("/resend-otp/", payload);

/* Get vendor status */
export const getVendorStatus = () =>
  vendorApi.get("/status/");

/* =========================
   Vendor Authentication
========================= */

/* Vendor login (shared auth service) */
export const verifyVendorMFA = (payload) =>
  api.post("/api/auth/verify-mfa/", payload);
