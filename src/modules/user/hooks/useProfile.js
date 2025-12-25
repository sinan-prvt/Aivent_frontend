// src/hooks/useProfile.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/modules/user/api/profile.api";

export const useProfile = () => {
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", "me"],
    queryFn: getProfile,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });

  return {
    profile: profileQuery.data || null,
    loading: profileQuery.isLoading,
    refresh: profileQuery.refetch,
    saveProfile: mutation.mutateAsync,
    saving: mutation.isLoading,
    error: profileQuery.error,
  };
};

