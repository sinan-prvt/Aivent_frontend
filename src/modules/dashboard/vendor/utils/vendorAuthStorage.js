export const setVendorTokens = (access, refresh) => {
  localStorage.setItem("vendor_access", access);
  localStorage.setItem("vendor_refresh", refresh);
};

export const clearVendorAuth = () => {
  localStorage.removeItem("vendor_access");
  localStorage.removeItem("vendor_refresh");
};

export const isVendorLoggedIn = () =>
  Boolean(localStorage.getItem("vendor_access"));
