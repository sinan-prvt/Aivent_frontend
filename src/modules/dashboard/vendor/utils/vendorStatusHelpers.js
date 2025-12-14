export const isVendorApprovalPending = (error) =>
  error?.response?.status === 403 &&
  error?.response?.data?.detail === "Vendor approval pending";
