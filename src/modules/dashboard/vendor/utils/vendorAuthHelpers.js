export const getVendorAccessToken = () =>
  localStorage.getItem("vendor_access");

export const hasVendorMFACompleted = () =>
  localStorage.getItem("vendor_mfa_verified") === "true";
