// src/modules/dashboard/admin/api/adminApi.js
import axios from "./axiosInstance";

// Users
export async function fetchUsers(params = {}) {
  // params: { page, page_size, search, role, status }
  const { data } = await axios.get("/users", { params });
  // normalize: try to support different backend shapes
  return data;
}

export async function fetchUserDetails(userId) {
  const { data } = await axios.get(`/users/${userId}`);
  return data;
}

export async function updateUser(userId, body) {
  const { data } = await axios.put(`/users/${userId}`, body);
  return data;
}

// Example actions
export async function approveVendor(userId) {
  const { data } = await axios.post(`/users/${userId}/approve_vendor`);
  return data;
}

export async function revokeTokens(userId) {
  const { data } = await axios.post(`/users/${userId}/revoke_tokens`);
  return data;
}

// Metrics
export async function fetchDashboardMetrics() {
  const { data } = await axios.get("/metrics");
  return data;
}
