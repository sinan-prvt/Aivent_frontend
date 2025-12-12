import api from "@/core/api/axios";

export const getProfile = async () => {
  const res = await api.get("/api/users/profile/");
  return res.data;
};

export const updateProfile = async (body) => {
  const res = await api.patch("/api/users/profile/", body);
  return res.data;
};
