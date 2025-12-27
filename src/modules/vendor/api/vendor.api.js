// src/modules/vendor/api/vendor.api.js
import api from "@/core/api/axios";
import vendorApi from "@/core/api/vendorAxios";

/* =========================
   Vendor Registration Flow
========================= */

/* Apply as vendor */
export const applyVendor = (payload) =>
  vendorApi.post("/vendors/apply/", payload);

/* Confirm vendor OTP */
export const confirmVendorOTP = (payload) =>
  vendorApi.post("/vendors/confirm/", payload);

/* Resend vendor OTP */
export const resendVendorOTP = (payload) =>
  vendorApi.post("/vendors/resend-otp/", payload);

/* Get vendor status */
export const getVendorStatus = () =>
  vendorApi.get("/vendors/status/");

/* =========================
   Vendor Authentication
========================= */

/* Vendor login (shared auth service) */
export const vendorLogin = (payload) =>
  api.post("/auth/login/", payload);

/* Verify vendor MFA */
export const verifyVendorMFA = (payload) =>
  api.post("/auth/verify-mfa/", payload);
