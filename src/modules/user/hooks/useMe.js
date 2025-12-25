// src/hooks/useMe.js
import { useQuery } from "@tanstack/react-query";
import api from "@/core/api/axios";

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get("/api/auth/me/");
      return data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
};
