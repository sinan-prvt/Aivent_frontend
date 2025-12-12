// src/hooks/useProfile.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/modules/user/api/profile.api";


export const useProfile = () => {
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // ensure cached profile is updated
      qc.setQueryData(["profile"], data);
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
