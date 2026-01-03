// src/modules/vendor/api/vendor.api.js
import api from "@/core/api/axios";
import vendorApi from "@/core/api/vendorAxios";
import catalogApi from "@/core/api/catalogAxios";

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

/* Get vendor profile (me) */
export const fetchVendorMe = () =>
  vendorApi.get("/me/");

/* Get vendor status */
export const getVendorStatus = () =>
  vendorApi.get("/status/");

/* =========================
   Vendor Authentication
========================= */

export const verifyVendorMFA = (payload) =>
  api.post("/api/auth/verify-mfa/", payload);

/* =========================
   Catalog
========================= */

export const fetchCategories = () =>
  catalogApi.get("/categories/");
