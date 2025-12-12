export const saveAccessToken = (token) =>
  localStorage.setItem("access", token);

export const saveRefreshToken = (token) =>
  localStorage.setItem("refresh", token);

export const getAccessToken = () => localStorage.getItem("access");
export const getRefreshToken = () => localStorage.getItem("refresh");

export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
