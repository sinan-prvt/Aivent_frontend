// src/modules/dashboard/admin/api/adminApi.js
import api from "../../../../core/api/axios";

export const fetchMetrics = () =>
  api.get("/admin-api/metrics/").then((r) => r.data);

export const fetchUsers = (params = {}) =>
  api.get("/admin-api/users/", { params }).then((r) => r.data);

export const approveVendor = (userId, action = "approve") =>
  api
    .patch(`/admin-api/users/${userId}/approve-vendor/`, { action })
    .then((r) => r.data);

export const revokeTokens = (userId) =>
  api
    .post(`/admin-api/users/${userId}/revoke-tokens/`)
    .then((r) => r.data);

export const updateUser = (userId, payload) =>
  api.patch(`/admin-api/users/${userId}/`, payload).then((r) => r.data);
