import api from "@/core/api/axios";

export async function fetchUsers(params = {}) {
  const { data } = await api.get("/admin-api/users/", { params });
  return data;
}

export async function fetchUserDetails(userId) {
  const { data } = await api.get(`/admin-api/users/${userId}/`);
  return data;
}

export async function updateUser(userId, body) {
  const { data } = await api.patch(`/admin-api/users/${userId}/`, body);
  return data;
}

export async function approveVendor(userId, action = "approve") {
  return api.patch(
    `/admin-api/users/${userId}/approve-vendor/`,
    { action }
  );
} 

export async function revokeTokens(userId) {
  const { data } = await api.post(
    `/admin-api/users/${userId}/revoke-tokens/`
  );
  return data;
}

export async function fetchDashboardMetrics() {
  const { data } = await api.get("/admin-api/metrics/");
  return data;
}
