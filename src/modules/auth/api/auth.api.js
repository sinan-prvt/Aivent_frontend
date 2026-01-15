import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const instance = axios.create({
  baseURL: API_BASE + "/api/auth/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export const setAuthHeader = (accessToken) => {
  if (accessToken) instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  else delete instance.defaults.headers.common["Authorization"];
};

async function getRecaptchaToken(action = "general", timeout = 4000) {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === "undefined" || !window.grecaptcha) return null;

  const start = Date.now();
  while (!window.grecaptcha && Date.now() - start < timeout) {
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!window.grecaptcha) return null;

  try {
    return await window.grecaptcha.execute(siteKey, { action });
  } catch (e) {
    console.warn("reCAPTCHA execute failed:", e);
    return null;
  }
}

export const registerUser = (data) => {
  return instance.post("register/", data);
};

export async function sendOTP(email, purpose = "email_verify") {
  return instance.post("send-otp/", { email, purpose });
}

export async function verifyOTP(email, purpose, otp) {
  return instance.post("verify-otp/", { email, purpose, otp });
}

export async function login(payload) {
  const token = await getRecaptchaToken("login");
  const body = { ...payload, recaptcha_token: token };

  return instance.post("login/", body);
}

export async function verifyMFA(session_id, code) {
  return instance.post("verify-mfa/", { session_id, code });
}

export async function sendResetOTP(email) {
  return instance.post("send-reset-otp/", { email, purpose: "reset_password" });
}
export async function resetPassword(email, new_password) {
  return instance.post("reset-password/", { email, new_password });
}

import { getAccessToken } from '../../../core/utils/token';

export async function logout(refreshToken) {
  return instance.post("logout/", { refresh: refreshToken });
}

export async function getCustomerProfile(userId) {
  const token = getAccessToken();
  return axios.get(`${API_BASE}/api/users/profiles/${userId}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}
